package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository

/**
 * The Active Team (ADR-0023): the one Team a request is scoped to, explicitly selected and never
 * inferred. The single tenant-resolution seam — every path deciding which Team a caller works in
 * comes through here.
 *
 * Every "may they have it?" answers null for both "not yours" and "no such Team", so the Team id
 * space cannot be probed.
 */
class ActiveTeamService(
    private val teamMemberRepository: TeamMemberRepository,
    private val teamRepository: TeamRepository,
    private val userRepository: UserRepository,
    private val tenantRoutingGateway: TenantRoutingGateway,
) {
    fun teamsOf(userId: UserId): List<TeamSummary> = teamRepository.findTeamsOf(userId.value)

    /**
     * Where the caller lands with no Team named. Null when they have several and remember none —
     * there is no defensible pick, so the choice becomes theirs.
     *
     * The remembered Team is re-verified rather than trusted: sessions slide for four weeks
     * (ADR-0015), long enough to outlive the membership behind them.
     */
    fun resolveLanding(userId: UserId): TenantRouting? =
        userRepository.findLastActiveTeamId(userId)
            ?.let { teamMemberRepository.findTenantRouting(it, userId) }
            ?: teamMemberRepository.findSoleTenantRouting(userId)

    fun activate(userId: UserId, teamId: TeamId): TenantRouting? =
        teamMemberRepository.findTenantRouting(teamId, userId)?.also { makeActive(userId, it) }

    /** The authorized switch a shared `/t/:slug/…` link performs. */
    fun activateBySlug(userId: UserId, slug: Slug): TeamSummary? =
        teamRepository.findBySlug(slug)?.takeIf { activate(userId, it.id) != null }

    /**
     * Signs the caller into their landing Team. Clearing is unconditional precisely because pinning
     * is not: a sign-in over a live session would otherwise inherit the previous caller's tenant.
     */
    fun pinLanding(userId: UserId): TeamId? {
        tenantRoutingGateway.clearRouting()
        return resolveLanding(userId)?.also(tenantRoutingGateway::pinRouting)?.teamId
    }

    /**
     * Re-pinning is the session-memo invalidation, not a cache refresh — later requests read the memo
     * without touching the database, so a switch that skipped this would keep serving the old tenant.
     */
    private fun makeActive(userId: UserId, routing: TenantRouting) {
        userRepository.rememberActiveTeam(userId, routing.teamId)
        tenantRoutingGateway.pinRouting(routing)
    }
}
