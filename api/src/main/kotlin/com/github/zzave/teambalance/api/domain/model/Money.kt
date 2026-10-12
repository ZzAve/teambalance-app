package com.github.zzave.teambalance.api.domain.model

/** An amount of euro cents. */
@JvmInline
value class Money(val cents: Long) {
    override fun toString(): String = cents.toString()
}
