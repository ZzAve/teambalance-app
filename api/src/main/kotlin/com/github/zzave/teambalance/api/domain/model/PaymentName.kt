package com.github.zzave.teambalance.api.domain.model

/** The counterparty name shown for a [Payment]. */
@JvmInline
value class PaymentName(val value: String) {
    override fun toString(): String = value
}
