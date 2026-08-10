package com.github.zzave.teambalance.api.domain.model

/**
 * The tenant routing for a user, resolved from a single `team_members`↔`teams` row so the team a
 * request is attributed to and the schema its tenant-scoped work lands in can never diverge (v1: one
 * team per user). Used to pin both onto the session at login so later requests read them back without
 * a concurrent first-write to the session store. See ADR-0018 / SessionTenantContextFilter.
 */
data class TenantRouting(
    val teamId: TeamId,
    val schemaName: String,
)
