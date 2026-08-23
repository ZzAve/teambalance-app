package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * Durable storage for [ActAs] episodes (ADR-0024). One store for the grant and the **Act-as Record**,
 * because they are the same episode read at two different times.
 */
interface ActAsRepository {
    /**
     * The caller's open episode, **expired or not**. An open row whose box has passed is precisely
     * "entered and lapsed", which is what tells `ACT_AS_EXPIRED` apart from a generic 403 — so
     * filtering expiry out here would delete the distinction.
     */
    fun findOpenFor(userId: UserId): ActAs?

    /** Inserts a new episode or updates an existing one by [ActAs.id]. */
    fun save(actAs: ActAs)

    /** Every episode inside [teamId], newest first — the team-visible record (ADR-0024 §4). */
    fun findForTeam(teamId: TeamId): List<ActAs>
}
