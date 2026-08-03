package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Invitation(
    val id: UUID,
    val teamId: TeamId,
    val tokenHash: TokenHash,
    val createdBy: UserId,
    val expiresAt: Instant,
    val createdAt: Instant,
)
