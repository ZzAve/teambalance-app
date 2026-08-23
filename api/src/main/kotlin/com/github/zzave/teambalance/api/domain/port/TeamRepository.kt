package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamSummary
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
}
