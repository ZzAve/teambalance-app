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
 * The Active Team (ADR-0021): the one Team a request is scoped to, **explicitly selected and never
 * inferred**. This is the single tenant-resolution seam — every path that decides which Team a caller
 * is working in goes through here, so there is exactly one place where "may they have it?" is asked.
 *
 * Two operations, and the difference between them is the whole design:
 *
 *  - [resolveLanding] answers "where does this caller land when they haven't said?" — the remembered
 *    Team if it is *still* a valid active membership, else their sole membership, else nothing. It
 *    never picks between several Teams: with more than one and none remembered, the answer is null and
 *    the caller has to choose. That is what replaced `ORDER BY team_id LIMIT 1`, which chose by UUID.
 *  - [activate] performs a **switch** to a *named* Team. It verifies membership, remembers the choice,
 *    and re-pins the session routing. Every switch is the same kind of switch — a deliberate one and a
 *    link-induced one are indistinguishable here, deliberately (ADR-0021 §3).
 *
 * Nothing here answers "not yours" differently from "does not exist": both are null, so the Team id
 * space cannot be probed. Act-as (ADR-0022) will plug a second *authorization* source into the
 * membership check without adding a second resolution path.
 */
class ActiveTeamService(
    private val teamMemberRepository: TeamMemberRepository,
    private val teamRepository: TeamRepository,
    private val userRepository: UserRepository,
    private val tenantRoutingGateway: TenantRoutingGateway,
) {
    /** Every Team the user is an active Member of — what the switcher lists. Empty for a teamless user. */
    fun teamsOf(userId: UserId): List<TeamSummary> = teamRepository.findTeamsOf(userId.value)

    /**
     * Where the caller lands with no Team named: their remembered Active Team while it is still a
     * valid active membership, otherwise their sole membership, otherwise nothing.
     *
     * The remembered id is re-verified rather than trusted. Sessions slide for four weeks and survive
     * restarts (ADR-0014/0015), so a remembered Team can outlive the membership behind it; verifying
     * turns that into "force a choice" instead of a route into a tenant they were removed from.
     */
    fun resolveLanding(userId: UserId): TenantRouting? =
        userRepository.findLastActiveTeamId(userId)
            ?.let { teamMemberRepository.findTenantRouting(it, userId) }
            ?: teamMemberRepository.findSoleTenantRouting(userId)

    /**
     * Switches the caller's Active Team to [teamId] and returns the routing it resolved to, or null
     * when they may not have that Team (which reads the same as "no such Team").
     */
    fun activate(userId: UserId, teamId: TeamId): TenantRouting? =
        teamMemberRepository.findTenantRouting(teamId, userId)?.also { adopt(userId, it) }

    /**
     * Switches the caller's Active Team to the Team addressed by [slug] — the authorized switch a
     * shared `/t/:slug/…` link performs — and returns it, or null when the slug is unknown *or* not
     * theirs. The two cases are deliberately indistinguishable.
     */
    fun activateBySlug(userId: UserId, slug: Slug): TeamSummary? =
        teamRepository.findBySlug(slug)?.takeIf { activate(userId, it.id) != null }

    /**
     * Resolves and pins the caller's landing Team at sign-in, returning it. A teamless user — or one
     * with several Teams and none remembered — pins nothing and lands on a choice instead.
     *
     * The clear is unconditional and comes first, precisely *because* the pin is conditional. A
     * sign-in can land on a session that already carries someone else's routing (a shared phone, a
     * second magic link in the same browser); resolving to nothing would then leave that routing in
     * place and hand the new caller the previous caller's tenant.
     */
    fun pinLanding(userId: UserId): TeamId? {
        tenantRoutingGateway.clearRouting()
        return resolveLanding(userId)?.also(tenantRoutingGateway::pinRouting)?.teamId
    }

    /**
     * Makes [routing] the caller's Active Team: remembered on the user, then re-pinned on the session.
     *
     * The re-pin is not a cache refresh — it is the **invalidation**. `TenantRoutingSession` memoizes
     * `(schema, teamId)` as a pair and every later request reads it back without touching the
     * database, so a switch that failed to overwrite it would leave the caller reading and writing the
     * previous tenant. That is why pinning is part of this method and not left to the caller.
     */
    private fun adopt(userId: UserId, routing: TenantRouting) {
        userRepository.rememberActiveTeam(userId, routing.teamId)
        tenantRoutingGateway.pinRouting(routing)
    }
}
