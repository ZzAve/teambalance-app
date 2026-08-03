package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TeamSummary
import java.util.UUID

/**
 * Read-side access to platform-level teams. Slice 1 needed only the tenant schema names to keep every
 * team migrated at boot; create-team added the slug pre-check; #158 adds the per-user lookup that powers
 * `/auth/me`'s has-a-team gate signal.
 */
interface TeamRepository {
    /** Schema names of all teams — the source of truth for which tenant schemas must exist. */
    fun findAllSchemaNames(): List<String>

    /**
     * True if a team with this [slug] already exists. A best-effort pre-check so create-team can reject
     * a duplicate name before provisioning a schema; the `slug`/`schema_name` UNIQUE constraints remain
     * the authoritative guard against a concurrent collision.
     */
    fun existsBySlug(slug: String): Boolean

    /** The team the user actively belongs to, or null if teamless (v1: one team per user). */
    fun findByUserId(userId: UUID): TeamSummary?
}
