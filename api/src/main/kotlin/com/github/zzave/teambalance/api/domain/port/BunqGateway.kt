package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import java.time.LocalDate

interface BunqGateway {
    fun fetchBalance(account: BunqAccountId): Money

    /** Payments dated on or after [since], newest first, at most [limit]. */
    fun fetchPayments(account: BunqAccountId, since: LocalDate, limit: Int): List<Payment>
}
