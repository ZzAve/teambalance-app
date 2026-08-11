package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/**
 * The minimal view of a team the platform layer hands back for identity purposes — the has-a-team gate
 * signal on `/auth/me` (#158). Just enough to name the team the caller belongs to; the tenant schema
 * and any team attributes stay behind the aggregate.
 */
data class TeamSummary(
    val id: UUID,
    val name: TeamName,
    val slug: Slug,
)
