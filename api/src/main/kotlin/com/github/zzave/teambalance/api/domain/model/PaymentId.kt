package com.github.zzave.teambalance.api.domain.model

/** Bunq's id of a [Payment]; a [Receipt] is stored under it. */
@JvmInline
value class PaymentId(val value: String) {
    override fun toString(): String = value
}
