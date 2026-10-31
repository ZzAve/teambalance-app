package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolOverview
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.BeerCount
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.LocalDate

class MoneyPoolService(
    private val settingsRepository: MoneyPoolSettingsRepository,
    private val connectionRepository: BunqConnectionRepository,
    private val seasonRepository: SeasonRepository,
    private val bunqGateway: BunqGateway,
    private val grantCipher: TokenCipher,
    private val clock: Clock,
    private val authorizationService: AuthorizationService,
    private val cache: MoneyPoolCacheGateway,
) {
    /**
     * Readable by any member. A stored grant that does not decrypt or that Bunq rejects is
     * [MoneyPool.Rejected]; any other failure reaching Bunq is [MoneyPool.Unavailable]. What Bunq
     * answered is remembered per team by [cache]; the beer figures come from the current settings.
     */
    fun getMoneyPool(teamId: TeamId): MoneyPoolOverview {
        val settings = settingsRepository.get()
        val pool = if (!settings.enabled) {
            MoneyPool.Off
        } else {
            val connection = connectionRepository.find()
            val account = connection?.accountId
            if (connection == null || account == null) {
                MoneyPool.NotConnected
            } else {
                cache.read(teamId, account) { readFromBunq(account) }.withBeerFigures(settings)
            }
        }
        return MoneyPoolOverview(pool, canTopUp = settings.topUpLink != null)
    }

    /** Whether the current team switched the money pool on; read by every member's navigation. */
    fun isEnabled(): Boolean = settingsRepository.get().enabled

    fun getSettings(callerId: UserId, teamId: TeamId): MoneyPoolSettings {
        authorizationService.requireAdmin(callerId, teamId)
        return settingsRepository.get()
    }

    /** Admin-only. Replaces all settings; a null price or link clears it. */
    fun updateSettings(callerId: UserId, teamId: TeamId, settings: MoneyPoolSettings): MoneyPoolSettings {
        authorizationService.requireAdmin(callerId, teamId)
        return settingsRepository.save(settings)
    }

    private fun MoneyPool.withBeerFigures(settings: MoneyPoolSettings): MoneyPool =
        if (this is MoneyPool.Connected) {
            copy(beerPrice = settings.beerPrice, beerCount = settings.beerPrice?.let { BeerCount.buying(balance, it) })
        } else {
            this
        }

    /**
     * Reads the connection again: the cache fixes its view of evictions before it calls this, so a connect
     * that evicted after the first read cannot leave the outcome of the grant it replaced behind. A connection
     * that is gone, or whose account is no longer [account], has nothing to report for this key; it is
     * [MoneyPool.Unavailable], which the cache keeps only for its retry interval.
     */
    private fun readFromBunq(account: BunqAccountId): MoneyPool {
        val connection = connectionRepository.find()?.takeIf { it.accountId == account } ?: return MoneyPool.Unavailable
        return decrypt(connection.grant)?.let { askBunq(it, account) } ?: MoneyPool.Rejected
    }

    @Suppress("TooGenericExceptionCaught")
    private fun askBunq(grant: BunqGrant, account: BunqAccountId): MoneyPool {
        val today = LocalDate.now(clock)
        val since = seasonRepository.get().start?.takeIf { !it.isAfter(today) } ?: today.minusDays(DEFAULT_HISTORY_DAYS)
        return try {
            val balance = bunqGateway.fetchBalance(grant, account)
            MoneyPool.Connected(balance, bunqGateway.fetchPayments(grant, account, since, PAYMENT_LIMIT))
        } catch (e: BunqGrantRejectedException) {
            logFailure(e)
            MoneyPool.Rejected
        } catch (e: Exception) {
            logFailure(e)
            MoneyPool.Unavailable
        }
    }

    /** Null when the stored grant does not decrypt (rotated key, damaged row). */
    @Suppress("TooGenericExceptionCaught")
    private fun decrypt(storedGrant: EncryptedToken): BunqGrant? =
        try {
            BunqGrant(grantCipher.decrypt(storedGrant))
        } catch (e: Exception) {
            log.warn("Decrypting the Bunq grant failed: ${e.javaClass.simpleName}")
            null
        }

    /** Class name at WARN; the grant is passed into the call, so an exception message could carry it. */
    private fun logFailure(e: Exception) {
        log.warn("Reading the money pool from Bunq failed: ${e.javaClass.simpleName}")
        log.debug("Reading the money pool from Bunq failed", e)
    }

    private val log = LoggerFactory.getLogger(MoneyPoolService::class.java)

    private companion object {
        const val DEFAULT_HISTORY_DAYS = 90L
        const val PAYMENT_LIMIT = 200
    }
}
