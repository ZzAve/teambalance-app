package com.github.zzave.teambalance.api.domain.port

/**
 * Read-side access to platform-level teams. Minimal by design: Slice 1 only needs the tenant schema
 * names to keep every team's schema migrated at boot; the full Team aggregate arrives with create-team.
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
}
