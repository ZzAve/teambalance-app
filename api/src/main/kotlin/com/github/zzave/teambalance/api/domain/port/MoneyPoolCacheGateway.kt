package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.CachedMoneyPool
import com.github.zzave.teambalance.api.domain.model.TeamId

/**
 * Remembers what Bunq answered for a team's money pool, so that page views do not each make a Bunq call.
 * Keyed by team and account. ADR-0023 says any team-keyed cache must be invalidated when the Active Team
 * switches; the key here is the team the request acts for, so a switch reads another team's entry and
 * carries nothing over. The cache is per instance and in memory: another instance keeps its own entry
 * until it refreshes or expires.
 */
interface MoneyPoolCacheGateway {
    /**
     * The pool for [teamId] and [account]. Only a read with nothing remembered waits for Bunq. A read of a
     * value older than the refresh interval gets that value and has Bunq asked again in the background.
     * [com.github.zzave.teambalance.api.domain.model.MoneyPool.Rejected] is remembered until [evict];
     * when Bunq does not answer, the last known value is served while there is one.
     */
    fun read(teamId: TeamId, account: BunqAccountId): CachedMoneyPool

    /** Forgets everything remembered for [teamId], for every account. */
    fun evict(teamId: TeamId)
}
