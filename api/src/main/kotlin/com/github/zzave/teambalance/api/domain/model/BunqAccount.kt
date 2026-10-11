package com.github.zzave.teambalance.api.domain.model

/** The name Bunq gives one of its accounts, as the Admin recognises it when picking the team's account. */
@JvmInline
value class BunqAccountName(val value: String) {
    override fun toString(): String = value
}

/** One of the Bunq accounts a grant covers. */
data class BunqAccount(val id: BunqAccountId, val name: BunqAccountName)

/** The accounts the current grant covers, and the one the money pool reads (null until picked). */
data class BunqAccounts(val accounts: List<BunqAccount>, val selected: BunqAccountId?)
