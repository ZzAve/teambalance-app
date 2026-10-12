package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import java.time.Clock
import java.time.LocalDate

/**
 * Dev/test/e2e adapter serving a canned balance and payment history for any account.
 * Active in every profile except prod, where [UnconfiguredBunqGatewayAdapter] stands in until the
 * real Bunq adapter exists (ADR-0042).
 */
@Component
@Profile("!prod")
class FakeBunqGatewayAdapter(private val clock: Clock) : BunqGateway {

    override fun fetchBalance(account: BunqAccountId): Money = Money(BALANCE_CENTS)

    override fun fetchPayments(account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> {
        val today = LocalDate.now(clock)
        return PAYMENTS.map { it.on(today) }.filter { !it.date.isBefore(since) }.take(limit)
    }

    private class CannedPayment(val daysAgo: Long, val name: String, val cents: Long, val direction: PaymentDirection) {
        fun on(today: LocalDate) = Payment(today.minusDays(daysAgo), PaymentName(name), Money(cents), direction)
    }

    private companion object {
        const val BALANCE_CENTS = 18_750L

        val PAYMENTS = listOf(
            CannedPayment(5, "Lisa de Vries", 2_000, PaymentDirection.IN),
            CannedPayment(7, "Sporthal De Kuil", 4_500, PaymentDirection.OUT),
            CannedPayment(12, "Tom Bakker", 1_000, PaymentDirection.IN),
            CannedPayment(19, "Jan Jansen", 5_000, PaymentDirection.IN),
            CannedPayment(26, "Drankenhandel Smit", 3_250, PaymentDirection.OUT),
            CannedPayment(33, "Sanne Visser", 2_000, PaymentDirection.IN),
            CannedPayment(47, "Nevobo", 6_000, PaymentDirection.OUT),
            CannedPayment(61, "Mark Smits", 1_000, PaymentDirection.IN),
        )
    }
}
