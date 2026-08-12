package com.github.zzave.teambalance.api.domain.model

/** The name of an [Event]. */
@JvmInline
value class EventTitle(val value: String) {
    override fun toString(): String = value
}
