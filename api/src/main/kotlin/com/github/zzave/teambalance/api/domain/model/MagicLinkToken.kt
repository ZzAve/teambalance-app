package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class MagicLinkToken(
    val id: UUID,
    val tokenHash: String,
    val email: String,
    val expiresAt: Instant,
    val usedAt: Instant?,
    val createdAt: Instant,
)
