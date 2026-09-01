package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Invitation(
    val id: UUID,
    val teamId: TeamId,
    /**
     * The permission role this link grants on acceptance (ADR-0024 §5). [Role.USER] is the ordinary
     * shareable link ("one link, many joiners", ADR-0025); [Role.ADMIN] is the single-use handover
     * link that gives a memberless team its first Admin.
     */
    val role: Role,
    /**
     * When this link was spent, or null while unspent. Only ever set for an [Role.ADMIN] link, which is
     * single-use: the one accept that wins the conditional consume stamps it, and a later accept of the
     * same token finds it non-null and is refused. A [Role.USER] link never sets it — it stays reusable.
     */
    val consumedAt: Instant?,
    val tokenHash: TokenHash,
    /**
     * The recoverable copy of the token, so an admin can be shown this link again (ADR-0025).
     *
     * Null only for invitations minted before ADR-0025, which were hash-only. V011 expired every one
     * of those, so an *active* invitation always carries it — but the accept path still loads
     * long-expired rows by hash before checking expiry, so the type stays honest about them.
     */
    val encryptedToken: EncryptedToken?,
    val createdBy: UserId,
    val expiresAt: Instant,
    val createdAt: Instant,
)
