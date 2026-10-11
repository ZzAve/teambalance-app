package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import java.time.LocalDate

/**
 * Dev/test/e2e adapter serving a canned balance and payment history for any account.
 * Active in every profile except prod, where [UnconfiguredBunqGatewayAdapter] stands in until the
 * real Bunq adapter exists (ADR-0042).
 */
@Component
@Profile("!prod")
class FakeBunqGatewayAdapter : BunqGateway {

    override fun fetchBalance(account: BunqAccountId): Money = Money(BALANCE_CENTS)

    override fun fetchPayments(account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> =
        PAYMENTS.filter { !it.date.isBefore(since) }.take(limit)

    private companion object {
        const val BALANCE_CENTS = 18_750L

        val PAYMENTS = listOf(
            payment("2026-10-06", "Lisa de Vries", 2_000, PaymentDirection.IN),
            payment("2026-10-04", "Sporthal De Kuil", 4_500, PaymentDirection.OUT),
            payment("2026-09-29", "Tom Bakker", 1_000, PaymentDirection.IN),
            payment("2026-09-22", "Jan Jansen", 5_000, PaymentDirection.IN),
            payment("2026-09-15", "Drankenhandel Smit", 3_250, PaymentDirection.OUT),
            payment("2026-09-08", "Sanne Visser", 2_000, PaymentDirection.IN),
            payment("2026-08-25", "Nevobo", 6_000, PaymentDirection.OUT),
            payment("2026-08-11", "Mark Smits", 1_000, PaymentDirection.IN),
        )

        fun payment(date: String, name: String, cents: Long, direction: PaymentDirection) =
            Payment(LocalDate.parse(date), PaymentName(name), Money(cents), direction)
    }
}
