package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.TeamId

/**
 * Remembers what Bunq answered for a team's money pool, so that page views do not each make a Bunq call.
 * Keyed by team and account, as ADR-0023 requires of every team-keyed cache. The cache is per instance
 * and in memory: another instance keeps its own entry until it refreshes or expires.
 */
interface MoneyPoolCacheGateway {
    /**
     * The pool for [teamId] and [account], from [load] when nothing usable is remembered. [load] answers
     * [MoneyPool.Connected] (a fresh value), [MoneyPool.Rejected] (remembered until [evict]) or
     * [MoneyPool.Unavailable] (Bunq did not answer: the last known value is served while there is one).
     */
    fun read(teamId: TeamId, account: BunqAccountId, load: () -> MoneyPool): MoneyPool

    /** Forgets everything remembered for [teamId], for every account. */
    fun evict(teamId: TeamId)
}
