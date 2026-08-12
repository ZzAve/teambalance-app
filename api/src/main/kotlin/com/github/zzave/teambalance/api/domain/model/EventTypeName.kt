package com.github.zzave.teambalance.api.domain.model

/** The name of an [EventType]. */
@JvmInline
value class EventTypeName(val value: String) {
    override fun toString(): String = value
}
