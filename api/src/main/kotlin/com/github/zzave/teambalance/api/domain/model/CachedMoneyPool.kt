package com.github.zzave.teambalance.api.domain.model

/**
 * What the cache holds of a team's money pool. [refreshing] is true when [pool] is older than the refresh
 * interval and Bunq is being asked again: a read shortly after gets the new value.
 */
data class CachedMoneyPool(val pool: MoneyPool, val refreshing: Boolean)
