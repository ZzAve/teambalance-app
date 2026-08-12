package com.github.zzave.teambalance.api.domain.model

/** Where an [Event] takes place, as free text. */
@JvmInline
value class EventLocation(val value: String) {
    override fun toString(): String = value
}
