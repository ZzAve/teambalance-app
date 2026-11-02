package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

/**
 * A started Bunq connection waiting for the browser to come back from Bunq. Only the hash of the
 * `state` is kept; the plaintext travels through Bunq and returns on the callback.
 */
data class BunqOAuthState(
    val id: UUID,
    val tokenHash: TokenHash,
    val teamId: TeamId,
    val adminUserId: UserId,
    val expiresAt: Instant,
    val usedAt: Instant?,
    val createdAt: Instant,
)
