package com.github.zzave.teambalance.api.domain.model

/** The one-time code Bunq appends to the callback, exchanged for a [BunqGrant]. */
@JvmInline
value class BunqAuthorizationCode(val value: String) {
    override fun toString(): String = "BunqAuthorizationCode(****)"
}
