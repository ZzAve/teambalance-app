package com.github.zzave.teambalance.api.domain.model

/** A number of whole beers. */
@JvmInline
value class BeerCount(val value: Long) {
    companion object {
        /** What the [balance] buys at [price]; an empty or overdrawn balance buys none. */
        fun buying(balance: Money, price: BeerPrice) = BeerCount(maxOf(0L, balance.cents) / price.cents)
    }
}
