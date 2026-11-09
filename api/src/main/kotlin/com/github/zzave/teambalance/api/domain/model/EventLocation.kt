package com.github.zzave.teambalance.api.domain.model

/** Where an [Event] takes place, as free text. */
@JvmInline
value class EventLocation(val value: String) {
    init {
        require(value.codePointCount(0, value.length) <= MAX_LENGTH) { "Event location must be at most $MAX_LENGTH characters" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 500
    }
}
