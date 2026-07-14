package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.Base64
import java.util.UUID

/** The plaintext invite token (shown to the admin once) plus its expiry. Never persisted. */
data class GeneratedInvitation(val token: String, val expiresAt: Instant)

@Service
class InvitationService(
    private val invitationRepository: InvitationRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val clock: Clock,
    // App-wide secret mixed into the token hash. Supplied via INVITATION_TOKEN_SALT in live
    // environments (see application.yml); dev and test use a hardcoded value.
    @Value("\${teambalance.invitation.token-salt}") private val tokenSalt: String,
) {
    companion object {
        // Invite links don't expire on a timer by default in v1 — an admin rotates/expires
        // them explicitly (#38). This TTL is a long-lived backstop, not the invalidation mechanism.
        val INVITE_TTL: Duration = Duration.ofDays(365)
        private const val TOKEN_BYTE_LENGTH = 32
        private val secureRandom = SecureRandom()
    }

    /**
     * Mints a fresh invite link for the team: a random token returned to the caller once, with only
     * its salted hash persisted. The plaintext is never stored, so a DB-read adversary cannot recover
     * a usable link. Because the hash is one-way, a repeat call can't re-show a previous link — each
     * call mints a new one; links already shared keep working until they expire. #38 adds explicit
     * rotate/expire to invalidate them.
     */
    fun generateInviteLink(teamId: UUID, createdBy: UUID): GeneratedInvitation {
        val now = Instant.now(clock)
        val token = generateToken()
        invitationRepository.save(
            Invitation(
                id = UUID.randomUUID(),
                teamId = teamId,
                tokenHash = hashToken(token),
                createdBy = createdBy,
                expiresAt = now.plus(INVITE_TTL),
                createdAt = now,
            ),
        )
        return GeneratedInvitation(token = token, expiresAt = now.plus(INVITE_TTL))
    }

    /**
     * Joins the presenting user to the invitation's team. Returns null for an unknown or expired
     * token (rotated/revoked tokens will read the same way once #38 lands) so the controller can
     * answer with a plain 404 — no distinction is made between "never existed" and "expired" to
     * avoid leaking which is the case.
     */
    fun acceptInvitation(token: String, userId: UUID): UUID? {
        val now = Instant.now(clock)
        val invitation = invitationRepository.findByTokenHash(hashToken(token))
            ?.takeIf { it.expiresAt.isAfter(now) }
            ?: return null
        teamMemberRepository.addMember(invitation.teamId, userId)
        return invitation.teamId
    }

    /** Invalidates every currently-active invite link for the team; already-expired ones are untouched. */
    fun expireActiveInvitations(teamId: UUID) {
        invitationRepository.expireActive(teamId, Instant.now(clock))
    }

    /** Invalidates the team's active invite link(s) and mints a fresh one in its place. */
    fun rotateInviteLink(teamId: UUID, createdBy: UUID): GeneratedInvitation {
        expireActiveInvitations(teamId)
        return generateInviteLink(teamId, createdBy)
    }

    private fun generateToken(): String {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    /**
     * Salted SHA-256, hex-encoded. The salt is an app-wide secret (not per-record), so a leaked DB
     * alone can't be brute-forced without it. The accept path (#37) will hash the presented token the
     * same way and match on the stored hash.
     */
    private fun hashToken(token: String): String =
        MessageDigest.getInstance("SHA-256")
            .digest((tokenSalt + token).toByteArray())
            .joinToString("") { "%02x".format(it) }
}
