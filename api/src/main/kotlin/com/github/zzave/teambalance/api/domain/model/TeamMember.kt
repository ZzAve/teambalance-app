package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

data class TeamMember(
    val userId: UUID,
    val displayName: String,
    val role: String,
    val positionId: UUID?,
    // The label of the assigned position, resolved via a join for display; null when unassigned.
    val position: String?,
)
