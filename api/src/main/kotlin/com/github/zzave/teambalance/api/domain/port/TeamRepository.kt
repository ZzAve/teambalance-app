package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import java.util.UUID

/**
 * Read-side access to platform-level teams. Slice 1 needed only the tenant schema names to keep every
 * team migrated at boot; create-team added the slug pre-check; #158 added the per-user lookup that powers
 * `/auth/me`; #143 turned that lookup into a *list*, because a user may be a Member of several Teams.
 */
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
     * Every team the user is an active Member of, by name, or empty when they belong to none. Ordered
     * so a switcher listing them is stable between requests; the order carries no other meaning — in
     * particular it is *not* a fallback for "which team is active" (ADR-0023 §1).
     */
    fun findTeamsOf(userId: UUID): List<TeamSummary>

    /**
     * The team addressed by [slug], regardless of who is asking — the slug is a Team's public address
     * (ADR-0019 §2), so this says nothing about membership. Authorization is a separate step: resolving
     * a slug here and failing the membership check must be indistinguishable from an unknown slug.
     */
    fun findBySlug(slug: Slug): TeamSummary?
}
