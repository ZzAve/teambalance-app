package com.github.zzave.teambalance.api.domain.model

/** The optional label on an [EventReference] ("Nevobo", "Digital match form"). */
@JvmInline
value class EventReferenceText(val value: String) {
    init {
        require(value.length <= MAX_LENGTH) { "Reference title must be at most $MAX_LENGTH characters" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 100
    }
}
