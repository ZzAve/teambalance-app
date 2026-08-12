package com.github.zzave.teambalance.api.domain.model

/** An [Event]'s optional free-text description. */
@JvmInline
value class EventDescription(val value: String) {
    override fun toString(): String = value
}
