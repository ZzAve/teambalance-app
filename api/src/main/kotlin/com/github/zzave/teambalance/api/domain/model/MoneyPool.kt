package com.github.zzave.teambalance.api.domain.model

import java.time.LocalDate

sealed interface MoneyPool {
    data object Off : MoneyPool
    data object NotConnected : MoneyPool
    data object Unavailable : MoneyPool
    data object Rejected : MoneyPool
    data class Connected(
        val balance: Money,
        val payments: List<Payment>,
        /** The first day the payments cover: Bunq was asked for payments since this day. */
        val historyStart: LocalDate,
        val beerPrice: BeerPrice? = null,
        val beerCount: BeerCount? = null,
        /** The version of each expense's [Receipt], for the expenses that have one. */
        val receiptVersions: Map<PaymentId, String> = emptyMap(),
    ) : MoneyPool
}
