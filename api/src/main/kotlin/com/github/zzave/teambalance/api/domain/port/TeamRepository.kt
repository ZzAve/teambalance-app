package com.github.zzave.teambalance.api.domain.port

/**
 * Read-side access to platform-level teams. Minimal by design: Slice 1 only needs the tenant schema
 * names to keep every team's schema migrated at boot; the full Team aggregate arrives with create-team.
 */
interface TeamRepository {
    /** Schema names of all teams — the source of truth for which tenant schemas must exist. */
    fun findAllSchemaNames(): List<String>
}
