package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.moneyPoolHistoryStart
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.LocalDate

/**
 * Reads a team's money pool from Bunq, for the cache to remember. The cache calls it outside a request
 * (a refresh runs in the background), so it sets the tenant itself.
 *
 * SECURITY: the tenant comes from the key of a cache entry, and an entry is made only by
 * [MoneyPoolService.getMoneyPool], with the tenant of the request it serves.
 */
class MoneyPoolReader(
    private val connectionRepository: BunqConnectionRepository,
    private val seasonRepository: SeasonRepository,
    private val bunqGateway: BunqGateway,
    private val grantCipher: TokenCipher,
    private val clock: Clock,
    private val tenantScopeGateway: TenantScopeGateway,
) {
    /**
     * A stored grant that does not decrypt or that Bunq rejects is [MoneyPool.Rejected]; any other failure
     * reaching Bunq is [MoneyPool.Unavailable].
     *
     * Reads the connection at the time of the call: the cache drops the answer of a read that an evict
     * overtook, so a connect cannot leave the outcome of the grant it replaced behind. A connection that
     * is gone, or whose account is no longer [account], has nothing to report for this key; it is
     * [MoneyPool.Unavailable], which the cache keeps only for its retry interval.
     */
    fun read(tenant: TenantRouting, account: BunqAccountId): MoneyPool =
        tenantScopeGateway.within(tenant) {
            val connection = connectionRepository.find()?.takeIf { it.accountId == account }
                ?: return@within MoneyPool.Unavailable
            decrypt(connection.grant, tenant.teamId)?.let { askBunq(it, account) } ?: MoneyPool.Rejected
        }

    @Suppress("TooGenericExceptionCaught")
    private fun askBunq(grant: BunqGrant, account: BunqAccountId): MoneyPool {
        val since = seasonRepository.get().moneyPoolHistoryStart(LocalDate.now(clock))
        return try {
            val balance = bunqGateway.fetchBalance(grant, account)
            MoneyPool.Connected(balance, bunqGateway.fetchPayments(grant, account, since, PAYMENT_LIMIT), since)
        } catch (e: BunqGrantRejectedException) {
            logFailure(e)
            MoneyPool.Rejected
        } catch (e: Exception) {
            logFailure(e)
            MoneyPool.Unavailable
        }
    }

    /** Null when the stored grant does not decrypt (rotated key, damaged row, made for another team or before teams were bound). */
    @Suppress("TooGenericExceptionCaught")
    private fun decrypt(storedGrant: EncryptedToken, teamId: TeamId): BunqGrant? =
        try {
            BunqGrant(grantCipher.decrypt(storedGrant, TokenCipher.aadOf(teamId, Purpose.BUNQ_GRANT)))
        } catch (e: Exception) {
            log.warn("Decrypting the Bunq grant failed: ${e.javaClass.simpleName}")
            null
        }

    /** Class name at WARN; the grant is passed into the call, so an exception message could carry it. */
    private fun logFailure(e: Exception) {
        log.warn("Reading the money pool from Bunq failed: ${e.javaClass.simpleName}")
        log.debug("Reading the money pool from Bunq failed", e)
    }

    private val log = LoggerFactory.getLogger(MoneyPoolReader::class.java)

    private companion object {
        const val PAYMENT_LIMIT = 200
    }
}
