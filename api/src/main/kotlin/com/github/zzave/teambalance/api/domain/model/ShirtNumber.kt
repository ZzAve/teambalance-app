package com.github.zzave.teambalance.api.domain.model

/** The number a [TeamMember] plays under in a team: a whole number of up to three digits (ADR-0038). */
@JvmInline
value class ShirtNumber(val value: Int) {
    init {
        require(value in RANGE) { "Shirt number must be between ${RANGE.first} and ${RANGE.last}: $value" }
    }

    override fun toString(): String = value.toString()

    companion object {
        val RANGE = 0..999
    }
}
