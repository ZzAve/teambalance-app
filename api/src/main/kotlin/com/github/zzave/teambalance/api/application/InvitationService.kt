package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.InviteToken
import com.github.zzave.teambalance.api.domain.model.Role
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

/**
 * The plaintext invite token plus its expiry — what an admin needs to build and share a link.
 *
 * Since ADR-0025 this is no longer show-once: the token is persisted encrypted as well as hashed, so
 * the same value can be handed back on a later request via [InvitationService.activeInviteLink].
 */
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
    // Reversible counterpart to the hash, so the team's current link can be shown again (ADR-0025).
    private val tokenCipher: InviteTokenCipher,
) {
    companion object {
        // Invite links don't expire on a timer by default in v1 — an admin rotates/expires
        // them explicitly (#38). This TTL is a long-lived backstop, not the invalidation mechanism.
        val INVITE_TTL: Duration = Duration.ofDays(365)
        private const val TOKEN_BYTE_LENGTH = 32
        private val secureRandom = SecureRandom()
    }

    /**
     * The team's current invite link, or null if it has none — the read that lets an admin come back
     * to a link they already shared instead of being forced to mint a replacement (ADR-0025).
     *
     * Null also covers a pre-ADR-0025 invitation that carries no ciphertext. V011 expired every one
     * of those, so this is unreachable in practice; treating it as "no link" rather than throwing
     * means a stray hash-only row surfaces to the admin as an offer to generate one, which is the
     * honest answer and the recoverable path.
     *
     * Admin-only: [callerId] must be an admin of [teamId] (the server-resolved tenant).
     */
    fun activeInviteLink(callerId: UserId, teamId: TeamId): GeneratedInvitation? {
        authorizationService.requireAdmin(callerId, teamId)
        return invitationRepository.findActiveByTeam(teamId, clock.instant())?.let(::reveal)
    }

    /**
     * The team's invite link, minting one only if it has none. Idempotent by design: a team has at
     * most one active link, so repeat calls return the same token rather than quietly adding another
     * usable credential (ADR-0025 — the unbounded accumulation this replaces was the security half of
     * the bug). Minting a *replacement* is [rotateInviteLink]'s job.
     *
     * The token is persisted twice over: as a salted hash, which is what [acceptInvitation] matches
     * on, and encrypted, which is what lets it be shown again.
     *
     * Admin-only: [callerId] must be an admin of [teamId] (the server-resolved tenant), and is also
     * recorded as the invitation's creator.
     */
    fun generateInviteLink(callerId: UserId, teamId: TeamId): GeneratedInvitation {
        authorizationService.requireAdmin(callerId, teamId)
        val now = clock.instant()
        invitationRepository.findActiveByTeam(teamId, now)?.let(::reveal)?.let { return it }

        val token = generateToken()
        invitationRepository.save(mint(token, callerId, teamId, now, Role.USER))
        return GeneratedInvitation(token = token, expiresAt = now.plus(INVITE_TTL))
    }

    /**
     * The single-use, **ADMIN**-granting handover link (ADR-0024 §5) — how a memberless team gets its
     * first Admin. Distinct from [generateInviteLink]: that mints the shareable USER link ("one link,
     * many joiners", ADR-0025), whereas an ADMIN grant with those semantics would hand Admin to
     * everyone the recipient forwards it to, so this link is spent on first accept.
     *
     * Idempotent while unspent: with a live, unconsumed ADMIN link already present it returns that one
     * rather than minting a second, so a team holds at most one live ADMIN credential. Once the previous
     * was accepted (consumed) or expired, this mints a fresh one.
     *
     * The one-live-link property is held here, not in the schema — the same service-held invariant
     * ADR-0025 chose for the USER link (a partial unique index can't bite on the time-based
     * active-ness). So two near-simultaneous mints could each pass the find and leave two live ADMIN
     * links. That is an anti-accumulation weakening, **not** a single-use hole: single-use is enforced
     * at accept by the conditional [InvitationRepository.consume], so every link is still spent at most
     * once. The extra-credential window is the accepted ADR-0025 trade-off, and the UI disables the
     * button while the mint is in flight; the operator, not an accident, decides what to hand out.
     *
     * Admin-only: [callerId] must be an admin of [teamId] — which, for the memberless handover, is the
     * acting-in Platform Admin's Virtual Member (ADR-0024 §2).
     */
    fun generateAdminInviteLink(callerId: UserId, teamId: TeamId): GeneratedInvitation {
        authorizationService.requireAdmin(callerId, teamId)
        val now = clock.instant()
        invitationRepository.findActiveAdminByTeam(teamId, now)?.let(::reveal)?.let { return it }

        val token = generateToken()
        invitationRepository.save(mint(token, callerId, teamId, now, Role.ADMIN))
        return GeneratedInvitation(token = token, expiresAt = now.plus(INVITE_TTL))
    }

    /**
     * Joins the presenting user to the invitation's team and makes it their Active Team, so a joiner
     * who was already a Member elsewhere lands where they just accepted (ADR-0023 §4).
     *
     * Returns null for an unknown or expired token — no distinction, to avoid leaking which it is.
     */
    fun acceptInvitation(token: String, userId: UserId): TeamId? {
        val now = Instant.now(clock)
        val invitation = invitationRepository.findByTokenHash(hashToken(token))
            ?.takeIf { it.expiresAt.isAfter(now) }
            ?.takeIf { claim(it, now) }
            ?: return null

        teamMemberRepository.addMember(invitation.teamId, userId, invitation.role)
        activeTeamService.activate(userId, invitation.teamId)
        return invitation.teamId
    }

    /**
     * Claims the invitation for the caller who is about to accept it, returning whether it may proceed.
     *
     * A single-use ADMIN link is consumed conditionally *before* it grants anything (ADR-0024 §5), so
     * at most one accept ever passes: consume-first is the fail-safe order — a lost race or an
     * already-spent link returns false and joins nobody, rather than risking two admins from one link.
     * A USER link is reusable, always claimable, and never consumed.
     */
    private fun claim(invitation: Invitation, now: Instant): Boolean =
        invitation.role != Role.ADMIN || invitationRepository.consume(invitation.id, now)

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
        invitationRepository.rotate(teamId, mint(token, callerId, teamId, now, Role.USER), now)
        return GeneratedInvitation(token = token, expiresAt = now.plus(INVITE_TTL))
    }

    private fun mint(token: InviteToken, callerId: UserId, teamId: TeamId, now: Instant, role: Role) = Invitation(
        id = UUID.randomUUID(),
        teamId = teamId,
        role = role,
        consumedAt = null,
        tokenHash = hashToken(token.value),
        encryptedToken = tokenCipher.encrypt(token),
        createdBy = callerId,
        expiresAt = now.plus(INVITE_TTL),
        createdAt = now,
    )

    /** The stored form back to something shareable; null for a hash-only pre-ADR-0025 row. */
    private fun reveal(invitation: Invitation): GeneratedInvitation? =
        invitation.encryptedToken?.let { encrypted: EncryptedToken ->
            GeneratedInvitation(token = tokenCipher.decrypt(encrypted), expiresAt = invitation.expiresAt)
        }

    private fun generateToken(): InviteToken {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return InviteToken(Base64.getUrlEncoder().withoutPadding().encodeToString(bytes))
    }

    /**
     * Salted SHA-256, hex-encoded. Still the token's identity for lookup: [acceptInvitation] hashes
     * the presented token this way and matches on the stored digest, so a joiner's token never causes
     * a decryption. ADR-0025 added an encrypted copy beside it for the admin read path; it did not
     * change what accept matches on.
     */
    private fun hashToken(token: String): TokenHash =
        TokenHash(
            MessageDigest.getInstance("SHA-256")
                .digest((tokenSalt + token).toByteArray())
                .joinToString("") { "%02x".format(it) },
        )
}
