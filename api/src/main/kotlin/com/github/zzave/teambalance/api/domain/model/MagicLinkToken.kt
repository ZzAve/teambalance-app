package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class MagicLinkToken(
    val id: UUID,
    val tokenHash: TokenHash,
    val email: Email,
    val expiresAt: Instant,
    val usedAt: Instant?,
    val createdAt: Instant,
    /**
     * The Invite Link this sign-in was requested from, or null for an ordinary login (#342).
     *
     * Resolved when the link is requested and accepted when it is verified, which is what makes
     * joining survive the email being opened in another browser or on another device: the only thing
     * that has to travel is the emailed URL, and it already points here. The carry used to be the
     * joiner's `localStorage`, which is per browser profile and so did not travel at all.
     *
     * Bound to this one magic link rather than to the email address. Anyone may request a magic link
     * for any address, so an email-keyed binding would let an invite attach itself to a sign-in the
     * recipient asked for themselves.
     */
    val invitationId: UUID?,
)
