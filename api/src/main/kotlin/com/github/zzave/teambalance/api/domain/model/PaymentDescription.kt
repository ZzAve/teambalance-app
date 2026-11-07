package com.github.zzave.teambalance.api.domain.model

/** The description Bunq holds for a [Payment]. Read for attribution only; never returned by the API. */
@JvmInline
value class PaymentDescription(val value: String) {
    override fun toString(): String = "PaymentDescription"
}
