package com.github.zzave.teambalance.api.domain.model

data class MoneyPoolSettings(
    val enabled: Boolean,
    val beerPrice: BeerPrice? = null,
    val bunqMeLink: BunqMeLink? = null,
)
