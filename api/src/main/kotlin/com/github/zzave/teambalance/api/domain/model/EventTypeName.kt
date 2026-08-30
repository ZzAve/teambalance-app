package com.github.zzave.teambalance.api.domain.model

/**
 * The name of an [EventType] ("Match", "Training").
 *
 * The length cap lives here rather than only on the write path, so it also holds for names the JPA
 * mapper builds — and, more to the point, so a 101-character name is a 400 from the value object
 * instead of a 500 from `VARCHAR(100)`. Mirrors [PositionLabel], whose column it matches.
 */
@JvmInline
value class EventTypeName(val value: String) {
    init {
        require(value.length <= MAX_LENGTH) { "Event type name must be at most $MAX_LENGTH characters" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 100
    }
}
