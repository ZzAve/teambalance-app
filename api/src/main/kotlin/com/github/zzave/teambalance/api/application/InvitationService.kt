package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.InviteToken
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.Base64
import java.util.UUID

/** The plaintext invite token (shown to the admin once) plus its expiry. Never persisted. */
data class GeneratedInvitation(val token: InviteToken, val expiresAt: Instant)

class InvitationService(
    private val invitationRepository: InvitationRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val authorizationService: AuthorizationService,
    private val activeTeamService: ActiveTeamService,
    private val clock: Clock,
    // App-wide secret mixed into the token hash. Read from teambalance.invitation.token-salt by the
    // composition root — INVITATION_TOKEN_SALT in live environments (see application.yml), a
    // hardcoded value in dev and test.
    private val tokenSalt: String,
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
     *
     * Admin-only: [callerId] must be an admin of [teamId] (the server-resolved tenant), and is also
     * recorded as the invitation's creator.
     */
    fun generateInviteLink(callerId: UserId, teamId: TeamId): GeneratedInvitation {
        authorizationService.requireAdmin(callerId, teamId)
        val now = clock.instant()
        val token = generateToken()
        invitationRepository.save(mint(token, callerId, teamId, now))
        return GeneratedInvitation(token = token, expiresAt = now.plus(INVITE_TTL))
    }

    /**
     * Joins the presenting user to the invitation's team **and makes it their Active Team**, so a
     * joiner lands where they just accepted rather than back in whichever Team they were in before
     * (ADR-0021 §4). That second half is why accepting is no longer fire-and-forget: since #143 a
     * joiner may already be a Member somewhere, and joining without switching would leave them
     * looking at the wrong Team.
     *
     * Returns null for an unknown or expired token (rotated/revoked tokens read the same way once #38
     * lands) so the controller can answer with a plain 404 — no distinction is made between "never
     * existed" and "expired" to avoid leaking which is the case.
     */
    fun acceptInvitation(token: String, userId: UserId): TeamId? {
        val now = Instant.now(clock)
        val invitation = invitationRepository.findByTokenHash(hashToken(token))
            ?.takeIf { it.expiresAt.isAfter(now) }
            ?: return null
        teamMemberRepository.addMember(invitation.teamId, userId)
        activeTeamService.activate(userId, invitation.teamId)
        return invitation.teamId
    }

    /**
     * Invalidates every currently-active invite link for the team; already-expired ones are untouched.
     * Admin-only: [callerId] must be an admin of [teamId] (the server-resolved tenant).
     */
    fun expireActiveInvitations(callerId: UserId, teamId: TeamId) {
        authorizationService.requireAdmin(callerId, teamId)
        invitationRepository.expireActive(teamId, Instant.now(clock))
    }

    /**
     * Invalidates the team's active invite link(s) and mints a fresh one in its place. Atomic: a
     * failure to mint rolls the expire back rather than leaving the team with no usable link. That
     * guarantee lives in [InvitationRepository.rotate] — the expire and the mint are handed over as a
     * single port call, so this service states the intent without naming a transaction.
     *
     * Admin-only: [callerId] must be an admin of [teamId] (the server-resolved tenant).
     */
    fun rotateInviteLink(callerId: UserId, teamId: TeamId): GeneratedInvitation {
        authorizationService.requireAdmin(callerId, teamId)
        val now = clock.instant()
        val token = generateToken()
        invitationRepository.rotate(teamId, mint(token, callerId, teamId, now), now)
        return GeneratedInvitation(token = token, expiresAt = now.plus(INVITE_TTL))
    }

    private fun mint(token: InviteToken, callerId: UserId, teamId: TeamId, now: Instant) = Invitation(
        id = UUID.randomUUID(),
        teamId = teamId,
        tokenHash = hashToken(token.value),
        createdBy = callerId,
        expiresAt = now.plus(INVITE_TTL),
        createdAt = now,
    )

    private fun generateToken(): InviteToken {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return InviteToken(Base64.getUrlEncoder().withoutPadding().encodeToString(bytes))
    }

    /**
     * Salted SHA-256, hex-encoded. The salt is an app-wide secret (not per-record), so a leaked DB
     * alone can't be brute-forced without it. The accept path (#37) will hash the presented token the
     * same way and match on the stored hash.
     */
    private fun hashToken(token: String): TokenHash =
        TokenHash(
            MessageDigest.getInstance("SHA-256")
                .digest((tokenSalt + token).toByteArray())
                .joinToString("") { "%02x".format(it) },
        )
}
