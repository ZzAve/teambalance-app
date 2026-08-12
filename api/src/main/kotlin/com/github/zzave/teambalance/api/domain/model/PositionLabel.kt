package com.github.zzave.teambalance.api.domain.model

/** The display label of a [Position] ("Setter", "Libero"). */
@JvmInline
value class PositionLabel(val value: String) {
    init {
        require(value.length <= MAX_LENGTH) { "Position label must be at most $MAX_LENGTH characters" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 50
    }
}
