package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

data class TeamMember(
    val userId: UUID,
    val displayName: String,
    val role: String,
    val teamRole: String?,
)
