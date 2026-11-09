package com.github.zzave.teambalance.api.domain.model

/** The name of an [Event]. */
@JvmInline
value class EventTitle(val value: String) {
    init {
        require(value.codePointCount(0, value.length) <= MAX_LENGTH) { "Event title must be at most $MAX_LENGTH characters" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 200
    }
}
