package com.github.zzave.teambalance.api.domain.model

/** Identifies the one Bunq account a team's money pool reads from. */
@JvmInline
value class BunqAccountId(val value: String) {
    override fun toString(): String = value
}
