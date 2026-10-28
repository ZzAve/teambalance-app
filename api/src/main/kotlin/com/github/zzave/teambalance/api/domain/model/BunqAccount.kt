package com.github.zzave.teambalance.api.domain.model

/** The name Bunq gives one of its accounts, as the Admin recognises it. */
@JvmInline
value class BunqAccountName(val value: String) {
    override fun toString(): String = value
}

/** One of the Bunq accounts a grant covers. */
data class BunqAccount(val id: BunqAccountId, val name: BunqAccountName)
