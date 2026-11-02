package com.github.zzave.teambalance.api.domain.model

/** What a member sees of the pool: its state, and whether they can top it up. */
data class MoneyPoolOverview(val pool: MoneyPool, val canTopUp: Boolean)
