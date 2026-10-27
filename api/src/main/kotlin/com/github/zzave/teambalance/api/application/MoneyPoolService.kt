package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.MoneyPool
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
) {
    /** Readable by any member. Any failure reaching Bunq is reported as [MoneyPool.Unavailable]. */
    fun getMoneyPool(): MoneyPool =
        if (!settingsRepository.get().enabled) {
            MoneyPool.Off
        } else {
            connectionRepository.find()?.let { readFromBunq(it.accountId) } ?: MoneyPool.NotConnected
        }

    @Suppress("TooGenericExceptionCaught")
    private fun readFromBunq(account: BunqAccountId): MoneyPool {
        val today = LocalDate.now(clock)
        val since = seasonRepository.get().start?.takeIf { !it.isAfter(today) } ?: today.minusDays(DEFAULT_HISTORY_DAYS)
        return try {
            MoneyPool.Connected(
                balance = bunqGateway.fetchBalance(account),
                payments = bunqGateway.fetchPayments(account, since, PAYMENT_LIMIT),
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
