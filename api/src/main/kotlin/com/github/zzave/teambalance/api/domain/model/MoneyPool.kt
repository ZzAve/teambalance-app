package com.github.zzave.teambalance.api.domain.model

import java.time.LocalDate

sealed interface MoneyPool {
    data object Off : MoneyPool
    data object NotConnected : MoneyPool
    data object Unavailable : MoneyPool
    data object Rejected : MoneyPool
    data class Connected(
        val balance: Money,
        /** The payments read from Bunq. */
        val payments: List<Payment>,
        /** The first day the payments cover: Bunq was asked for payments since this day. */
        val historyStart: LocalDate,
        val beerPrice: BeerPrice? = null,
        val beerCount: BeerCount? = null,
    ) : MoneyPool
}

private const val DEFAULT_HISTORY_DAYS = 90L

/** The first day the money pool covers on [today]: the season start once the season has begun, else the last 90 days. */
fun Season.moneyPoolHistoryStart(today: LocalDate): LocalDate =
    start?.takeIf { !it.isAfter(today) } ?: today.minusDays(DEFAULT_HISTORY_DAYS)
