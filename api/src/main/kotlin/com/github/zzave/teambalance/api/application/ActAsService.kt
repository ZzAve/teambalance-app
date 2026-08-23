package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.TeamNotFoundException
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.ActAsRepository
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import java.time.Clock
import java.time.Instant

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
    private val actAsGateway: ActAsGateway,
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
    fun enter(userId: UserId, teamId: TeamId): EnteredActAs {
        platformAdminGateway.requirePlatformAdmin(userId.value)
        val routing = teamRepository.findTenantRoutingUnchecked(teamId) ?: throw TeamNotFoundException(teamId)
        val team = teamRepository.findById(teamId) ?: throw TeamNotFoundException(teamId)
        val now = clock.instant()
        close(userId, now)
        val grant = ActAs.enter(userId = userId, teamId = teamId, now = now)
        actAsRepository.save(grant)
        // Clear before pin, for the same reason sign-in does: pinning must not inherit a previous tenant.
        tenantRoutingGateway.clearRouting()
        tenantRoutingGateway.pinRouting(routing)
        return EnteredActAs(grant, team)
    }

    /**
     * The grant in force for *this request*, named. Read through [ActAsGateway] rather than the
     * repository so it can only ever report what the pipeline already established — `/auth/me` must
     * not be a second, independently-derived answer to "am I acting as anyone?".
     */
    fun current(): EnteredActAs? =
        actAsGateway.current()?.let { grant ->
            teamRepository.findById(grant.teamId)?.let { EnteredActAs(grant, it) }
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
        return carry(open, clock.instant()) ?: ActAsResolution.Lapsed
    }

    /**
     * Slides an unexpired grant forward and says where its work lands. Null for a grant that is done
     * — and for one whose Team has since been deleted, which leaves nothing to route to and is
     * treated as the box closing rather than as a fallback to any other tenant.
     */
    private fun carry(grant: ActAs, now: Instant): ActAsResolution.Active? =
        grant.takeIf { it.isActiveAt(now) }
            ?.let { teamRepository.findTenantRoutingUnchecked(it.teamId) }
            ?.let { ActAsResolution.Active(grant.slidTo(now).also(actAsRepository::save), it) }

    /** The team-visible **Act-as Record** for [teamId], newest first. Authorization is the caller's. */
    fun recordsFor(teamId: TeamId): List<ActAs> = actAsRepository.findForTeam(teamId)

    private fun close(userId: UserId, now: Instant) {
        actAsRepository.findOpenFor(userId)?.let { actAsRepository.save(it.copy(exitedAt = now)) }
    }
}

/** A grant together with the Team it names — the banner is useless without the name (ADR-0024 §4). */
data class EnteredActAs(val actAs: ActAs, val team: TeamSummary)

/** What act-as says about the current request — the three answers the request pipeline branches on. */
sealed interface ActAsResolution {
    /** An entered, unexpired grant. [routing] is where its work lands. */
    data class Active(val actAs: ActAs, val routing: TenantRouting) : ActAsResolution

    /** Entered, then ran out. Resolves to no tenant, and reports `ACT_AS_EXPIRED`. */
    data object Lapsed : ActAsResolution

    /** No act-as at all — the ordinary Member path (the overwhelming majority of requests). */
    data object None : ActAsResolution
}
