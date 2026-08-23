package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Invitation(
    val id: UUID,
    val teamId: TeamId,
    val tokenHash: TokenHash,
    /**
     * The recoverable copy of the token, so an admin can be shown this link again (ADR-0025).
     *
     * Null only for invitations minted before ADR-0025, which were hash-only. V010 expired every one
     * of those, so an *active* invitation always carries it — but the accept path still loads
     * long-expired rows by hash before checking expiry, so the type stays honest about them.
     */
    val encryptedToken: EncryptedToken?,
    val createdBy: UserId,
    val expiresAt: Instant,
    val createdAt: Instant,
)
