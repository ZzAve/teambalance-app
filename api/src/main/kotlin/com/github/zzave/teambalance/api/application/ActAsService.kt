package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.TeamNotFoundException
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.ActAsRepository
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import java.time.Clock

/**
 * How **Act-as** is entered, carried and left (ADR-0024).
 *
 * It builds no tenant-resolution machinery of its own: entering pins the tenant through the same
 * [TenantRoutingGateway] the Active Team uses, and leaving clears it the way `pinLanding` does. What
 * act-as adds is a *second authorization source* — a grant that [resolve] re-checks on every request,
 * and that `AuthorizationService` reads through `ActAsGateway` to synthesize the **Virtual Member**.
 *
 * The 60-minute box is enforced here rather than by the session, because the session's memoized
 * tenant routing is never re-verified: a grant that rode that memo alone would never expire.
 */
class ActAsService(
    private val platformAdminGateway: PlatformAdminGateway,
    private val actAsRepository: ActAsRepository,
    private val teamRepository: TeamRepository,
    private val tenantRoutingGateway: TenantRoutingGateway,
    private val clock: Clock,
) {
    /**
     * Every team on the platform, for the console (ADR-0024 §6). Restricting the *list* would be
     * theatre — a Platform Admin owns the database; what makes this defensible is that *entering* is
     * explicit, boxed, and recorded.
     */
    fun teamsToEnter(userId: UserId): List<TeamSummary> {
        platformAdminGateway.requirePlatformAdmin(userId.value)
        return teamRepository.findAll()
    }

    /**
     * Enters [teamId]. The platform-admin gate is the *only* place membership is not consulted, which
     * is why it comes first and why the routing lookup it unlocks is named for what it skips.
     *
     * Entering a second team closes the first: one open grant per Platform Admin, so the banner can
     * never name a team the caller has already left.
     */
    fun enter(userId: UserId, teamId: TeamId): ActAs {
        platformAdminGateway.requirePlatformAdmin(userId.value)
        val routing = teamRepository.findTenantRoutingUnchecked(teamId) ?: throw TeamNotFoundException(teamId)
        val now = clock.instant()
        close(userId, now)
        val grant = ActAs.enter(userId = userId, teamId = teamId, now = now)
        actAsRepository.save(grant)
        // Clear before pin, for the same reason sign-in does: pinning must not inherit a previous tenant.
        tenantRoutingGateway.clearRouting()
        tenantRoutingGateway.pinRouting(routing)
        return grant
    }

    /**
     * Leaves whatever team the caller is in. Ungated on purpose: closing your own grant can only ever
     * reduce access, and refusing to let a lapsed caller tidy up would strand them.
     */
    fun exit(userId: UserId) {
        close(userId, clock.instant())
        tenantRoutingGateway.clearRouting()
    }

    /**
     * The per-request check. Slides the box on activity, so act-as survives work and not idleness.
     *
     * [ActAsResolution.Lapsed] is a *found* episode that ran out, distinct from [ActAsResolution.None].
     * The row stays open until the caller exits or enters elsewhere, so every request in between says
     * `ACT_AS_EXPIRED` rather than one saying it and the rest degrading to a bare permission denial.
     */
    fun resolve(userId: UserId): ActAsResolution {
        val open = actAsRepository.findOpenFor(userId) ?: return ActAsResolution.None
        val now = clock.instant()
        if (!open.isActiveAt(now)) return ActAsResolution.Lapsed
        // A team deleted under a live grant leaves nothing to route to; treat it as the box closing
        // rather than falling back to any other tenant.
        val routing = teamRepository.findTenantRoutingUnchecked(open.teamId) ?: return ActAsResolution.Lapsed
        val slid = open.slidTo(now)
        actAsRepository.save(slid)
        return ActAsResolution.Active(slid, routing)
    }

    /** The team-visible **Act-as Record** for [teamId], newest first. Authorization is the caller's. */
    fun recordsFor(teamId: TeamId): List<ActAs> = actAsRepository.findForTeam(teamId)

    private fun close(userId: UserId, now: java.time.Instant) {
        actAsRepository.findOpenFor(userId)?.let { actAsRepository.save(it.copy(exitedAt = now)) }
    }
}

/** What act-as says about the current request — the three answers the request pipeline branches on. */
sealed interface ActAsResolution {
    /** An entered, unexpired grant. [routing] is where its work lands. */
    data class Active(val actAs: ActAs, val routing: TenantRouting) : ActAsResolution

    /** Entered, then ran out. Resolves to no tenant, and reports `ACT_AS_EXPIRED`. */
    data object Lapsed : ActAsResolution

    /** No act-as at all — the ordinary Member path (the overwhelming majority of requests). */
    data object None : ActAsResolution
}
