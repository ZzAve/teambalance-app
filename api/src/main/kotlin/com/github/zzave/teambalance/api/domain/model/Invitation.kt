package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Invitation(
    val id: UUID,
    val teamId: UUID,
    val token: String,
    val createdBy: UUID,
    val expiresAt: Instant,
    val createdAt: Instant,
)
