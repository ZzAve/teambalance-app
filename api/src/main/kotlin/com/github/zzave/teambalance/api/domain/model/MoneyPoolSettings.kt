package com.github.zzave.teambalance.api.domain.model

data class MoneyPoolSettings(
    val enabled: Boolean,
    val beerPrice: BeerPrice? = null,
    val bunqMeLink: BunqMeLink? = null,
) {
    /** The page members top up through: the pool is on and a bunq.me page is set. */
    val topUpLink: BunqMeLink? get() = bunqMeLink?.takeIf { enabled && it.isBunqMePage }
}
