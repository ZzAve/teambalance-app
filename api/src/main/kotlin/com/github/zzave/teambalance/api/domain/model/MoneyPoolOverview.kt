package com.github.zzave.teambalance.api.domain.model

import java.time.LocalDate

/**
 * What a member sees of the pool: its state, and whether they can top it up. [refreshing] is true when
 * [pool] is an older value and Bunq is being asked again (see [CachedMoneyPool]).
 *
 * [payments] is what the pool lists, newest first: the Bunq payments of a connected pool together with the
 * out-of-pocket expenses, which need no Bunq (ADR-0048). Without a working connection it holds the
 * out-of-pocket expenses alone. [receiptVersions] has the version of the [Receipt] of each of them that has
 * one. [historyStart] is the first day [payments] covers. A pool that is switched off lists nothing and has
 * no [historyStart].
 */
data class MoneyPoolOverview(
    val pool: MoneyPool,
    val canTopUp: Boolean,
    val refreshing: Boolean,
    val payments: List<Payment> = emptyList(),
    val receiptVersions: Map<PaymentId, String> = emptyMap(),
    val historyStart: LocalDate? = null,
)
