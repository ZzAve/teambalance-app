package com.github.zzave.teambalance.api.domain.model

sealed interface MoneyPool {
    data object Off : MoneyPool
    data object NotConnected : MoneyPool
    data object Unavailable : MoneyPool
    data object Rejected : MoneyPool
    data class Connected(
        val balance: Money,
        val payments: List<Payment>,
        val beerPrice: BeerPrice? = null,
        val beerCount: BeerCount? = null,
    ) : MoneyPool
}
