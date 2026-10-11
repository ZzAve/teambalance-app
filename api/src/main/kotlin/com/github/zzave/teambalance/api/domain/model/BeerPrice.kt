package com.github.zzave.teambalance.api.domain.model

/** What one beer costs, in euro cents. */
@JvmInline
value class BeerPrice(val cents: Long) {
    init {
        require(cents in 1..MAX_CENTS) { "Beer price must be between 1 and $MAX_CENTS cents" }
    }

    companion object {
        const val MAX_CENTS = 10_000L
    }
}
