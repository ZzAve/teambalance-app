package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolOverview
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.BeerCount
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
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
    private val clock: Clock,
    private val authorizationService: AuthorizationService,
) {
    /** Readable by any member. Any failure reaching Bunq is reported as [MoneyPool.Unavailable]. */
    fun getMoneyPool(): MoneyPoolOverview {
        val settings = settingsRepository.get()
        val pool = if (!settings.enabled) {
            MoneyPool.Off
        } else {
            connectionRepository.find()?.accountId?.let { readFromBunq(it, settings) } ?: MoneyPool.NotConnected
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

    @Suppress("TooGenericExceptionCaught")
    private fun readFromBunq(account: BunqAccountId, settings: MoneyPoolSettings): MoneyPool {
        val today = LocalDate.now(clock)
        val since = seasonRepository.get().start?.takeIf { !it.isAfter(today) } ?: today.minusDays(DEFAULT_HISTORY_DAYS)
        return try {
            val balance = bunqGateway.fetchBalance(account)
            MoneyPool.Connected(
                balance = balance,
                payments = bunqGateway.fetchPayments(account, since, PAYMENT_LIMIT),
                beerPrice = settings.beerPrice,
                beerCount = settings.beerPrice?.let { BeerCount.buying(balance, it) },
            )
        } catch (e: Exception) {
            log.warn("Reading the money pool from Bunq failed", e)
            MoneyPool.Unavailable
        }
    }

    private val log = LoggerFactory.getLogger(MoneyPoolService::class.java)

    private companion object {
        const val DEFAULT_HISTORY_DAYS = 90L
        const val PAYMENT_LIMIT = 200
    }
}
