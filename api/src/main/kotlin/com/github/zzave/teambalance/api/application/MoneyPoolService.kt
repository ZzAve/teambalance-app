package com.github.zzave.teambalance.api.application

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
        if (!settingsRepository.get().enabled) return MoneyPool.Off
        val connection = connectionRepository.find() ?: return MoneyPool.NotConnected
        val since = seasonRepository.get().start ?: LocalDate.now(clock).minusDays(DEFAULT_HISTORY_DAYS)
        return try {
            MoneyPool.Connected(
                balance = bunqGateway.fetchBalance(connection.accountId),
                payments = bunqGateway.fetchPayments(connection.accountId, since, PAYMENT_LIMIT),
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
