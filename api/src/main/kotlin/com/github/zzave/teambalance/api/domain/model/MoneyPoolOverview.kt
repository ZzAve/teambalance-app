package com.github.zzave.teambalance.api.domain.model

/**
 * What a member sees of the pool: its state, and whether they can top it up. [refreshing] is true when
 * [pool] is an older value and Bunq is being asked again (see [CachedMoneyPool]).
 */
data class MoneyPoolOverview(val pool: MoneyPool, val canTopUp: Boolean, val refreshing: Boolean)
