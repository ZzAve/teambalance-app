package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Invitation(
    val id: UUID,
    val teamId: UUID,
    /** Salted SHA-256 of the invite token — never the plaintext (which is shown to the admin once). */
    val tokenHash: String,
    val createdBy: UserId,
    val expiresAt: Instant,
    val createdAt: Instant,
)
