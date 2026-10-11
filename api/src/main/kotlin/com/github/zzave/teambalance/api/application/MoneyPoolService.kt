package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
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
    fun getMoneyPool(): MoneyPool {
        val connection = connectionRepository.find()
        return when {
            !settingsRepository.get().enabled -> MoneyPool.Off
            connection == null -> MoneyPool.NotConnected
            else -> readFromBunq(connection.accountId)
        }
    }

    private fun readFromBunq(account: BunqAccountId): MoneyPool {
        val since = seasonRepository.get().start ?: LocalDate.now(clock).minusDays(DEFAULT_HISTORY_DAYS)
        return try {
            MoneyPool.Connected(
                balance = bunqGateway.fetchBalance(account),
                payments = bunqGateway.fetchPayments(account, since, PAYMENT_LIMIT),
            )
        } catch (_: Exception) {
            MoneyPool.Unavailable
        }
    }

    private companion object {
        const val DEFAULT_HISTORY_DAYS = 90L
        const val PAYMENT_LIMIT = 200
    }
}
