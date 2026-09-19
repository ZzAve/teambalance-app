package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import java.util.UUID

/** Read-side access to platform-level teams. */
interface TeamRepository {
    /** Schema names of all teams — the source of truth for which tenant schemas must exist. */
    fun findAllSchemaNames(): List<SchemaName>

    /**
     * True if a team with this [slug] already exists. A best-effort pre-check so create-team can reject
     * a duplicate name before provisioning a schema; the `slug`/`schema_name` UNIQUE constraints remain
     * the authoritative guard against a concurrent collision.
     */
    fun existsBySlug(slug: Slug): Boolean

    /**
     * Every team the user is an active Member of, in a stable display order. That order is not a
     * fallback for "which team is active" (ADR-0023 §1).
     */
    fun findTeamsOf(userId: UUID): List<TeamSummary>

    /** The team at this slug, regardless of who is asking — membership is a separate check. */
    fun findBySlug(slug: Slug): TeamSummary?

    /** The team's public identity, for naming a Team the caller is already authorized for. */
    fun findById(teamId: TeamId): TeamSummary?

    /**
     * Routing for [teamId] with **no membership check at all** — the one lookup that can reach a
     * tenant its caller does not belong to.
     *
     * `TeamMemberRepository.findTenantRouting` is the ordinary path and stays membership-checked; this
     * exists for the two callers that have no membership row to check against. It reads `public.teams`
     * alone, so it cannot be "fixed" into a checked lookup by accident — the check simply isn't
     * expressible here, which is why the absence is stated in the name.
     *
     * **Two sanctioned callers, and no others.** A third call site is a cross-tenant hole; the guard is
     * this list, not the method.
     *
     * 1. **Act-as** (ADR-0024): `ActAsService.enter` and the per-request `ActAsService.resolve` (via
     *    `carry`), both reached only behind `PlatformAdminGateway` — a grant exists only for a platform
     *    admin, who is structurally a member of nothing (ADR-0024 §3), so there is no row to find.
     * 2. **The calendar-link feed** (ADR-0032): `CalendarFeedTenantFilter`, which binds a tenant from a
     *    public team slug on a request that carries no session at all, so again there is no member to
     *    check. Routing alone serves nothing there: every row the feed returns is still gated on a
     *    token that hashes to a link *in that schema*, on that link being live, and on its owner still
     *    being a member — the membership check moves to `CalendarFeedService`, it does not disappear.
     */
    fun findTenantRoutingUnchecked(teamId: TeamId): TenantRouting?

    /** Every team on the platform, in display order — the platform console lists all (ADR-0024 §6). */
    fun findAll(): List<TeamSummary>
}
