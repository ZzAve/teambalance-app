package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.InviteToken
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.UUID

/**
 * The plaintext invite token plus its expiry — what an admin needs to build and share a link.
 *
 * Since ADR-0025 this is no longer show-once: the token is persisted encrypted as well as hashed, so
 * the same value can be handed back on a later request via [InvitationService.activeInviteLink].
 */
data class GeneratedInvitation(val token: InviteToken, val expiresAt: Instant)

// One cohesive owner of every invite-link operation — generate / current / rotate / revoke for both
// the shareable USER link and the single-use ADMIN handover link, plus accept. The two link kinds are
// exact parallels sharing the same mint/reveal/hash machinery, so keeping them in one class is what
// avoids duplicating that machinery; that pushes the method count just over detekt's default.
@Suppress("TooManyFunctions")
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
    private val tokenCipher: TokenCipher,
) {
    companion object {
        // Invite links don't expire on a timer by default in v1 — an admin rotates/expires
        // them explicitly (#38). This TTL is a long-lived backstop, not the invalidation mechanism.
        val INVITE_TTL: Duration = Duration.ofDays(365)
        private const val TOKEN_BYTE_LENGTH = 32
    }

    /**
     * The team's current unspent link of [role], or null if it has none — the read that lets an admin
     * come back to a link they already shared instead of being forced to mint a replacement
     * (ADR-0025). [Role.USER] is the shareable "one link, many joiners" link; [Role.ADMIN] is the
     * single-use handover link (ADR-0024 §5), offered back only while unspent.
     *
     * Null also covers a pre-ADR-0025 invitation that carries no ciphertext. V011 expired every one
     * of those, so this is unreachable in practice; treating it as "no link" rather than throwing
     * means a stray hash-only row surfaces to the admin as an offer to generate one, which is the
     * honest answer and the recoverable path.
     *
     * Admin-only: the caller must be an admin of the scope's team — which, for the memberless handover,
     * is the acting-in Platform Admin's Virtual Member (ADR-0024 §2).
     */
    fun activeInviteLink(scope: TeamScope, role: Role): GeneratedInvitation? {
        authorizationService.requireAdmin(scope)
        return invitationRepository.findActive(scope.teamId, role, clock.instant())?.let(::reveal)
    }

    /**
     * The team's link of [role], minting one only if it has none. Idempotent by design: a team has at
     * most one active link per role, so repeat calls return the same token rather than quietly adding
     * another usable credential (ADR-0025 — the unbounded accumulation this replaces was the security
     * half of the bug). Minting a *replacement* is [rotateInviteLink]'s job.
     *
     * The token is persisted twice over: as a salted hash, which is what [acceptInvitation] matches
     * on, and encrypted, which is what lets it be shown again.
     *
     * The one-live-link property is held here, not in the schema (a partial unique index can't bite on
     * the time-based active-ness). So two near-simultaneous mints could each pass the find and leave two
     * live links. For [Role.ADMIN] that is an anti-accumulation weakening, **not** a single-use hole:
     * single-use is enforced at accept by the conditional [InvitationRepository.consume], so every
     * handover link is still spent at most once. The extra-credential window is the accepted ADR-0025
     * trade-off, and the UI disables the button while the mint is in flight.
     *
     * Admin-only: the caller must be an admin of the scope's team, and is also recorded as the
     * invitation's creator.
     */
    fun generateInviteLink(scope: TeamScope, role: Role): GeneratedInvitation {
        authorizationService.requireAdmin(scope)
        val now = clock.instant()
        invitationRepository.findActive(scope.teamId, role, now)?.let(::reveal)?.let { return it }

        val token = generateToken()
        invitationRepository.save(mint(token, scope, now, role))
        return GeneratedInvitation(token = token, expiresAt = now.plus(INVITE_TTL))
    }

    /**
     * Invalidates the team's active links of [role] and mints a fresh one in its place. Atomic: a
     * failure to mint rolls the expire back rather than leaving the team with no usable link. That
     * guarantee lives in [InvitationRepository.rotate] — the expire and the mint are handed over as a
     * single port call, so this service states the intent without naming a transaction. Rotate is
     * role-scoped by the replacement's role, so rotating the USER link leaves a live ADMIN handover
     * link alone and vice-versa.
     *
     * Admin-only: the caller must be an admin of the scope's team.
     */
    fun rotateInviteLink(scope: TeamScope, role: Role): GeneratedInvitation {
        authorizationService.requireAdmin(scope)
        val now = clock.instant()
        val token = generateToken()
        invitationRepository.rotate(scope.teamId, mint(token, scope, now, role), now)
        return GeneratedInvitation(token = token, expiresAt = now.plus(INVITE_TTL))
    }

    /**
     * Revokes the team's active links of [role] without a replacement. Scoped by role, so revoking the
     * ADMIN handover link ("I don't want to hand over right now after all") keeps the shareable USER
     * link working, and vice-versa. Already-expired links are untouched.
     *
     * Admin-only: the caller must be an admin of the scope's team.
     */
    fun expireInviteLinks(scope: TeamScope, role: Role) {
        authorizationService.requireAdmin(scope)
        invitationRepository.expireActive(scope.teamId, role, Instant.now(clock))
    }

    /**
     * Joins the presenting user to the invitation's team and makes it their Active Team, so a joiner
     * who was already a Member elsewhere lands where they just accepted (ADR-0023 §4).
     *
     * Returns null for an unknown or expired token — no distinction, to avoid leaking which it is.
     */
    fun acceptInvitation(token: String, userId: UserId): TeamId? =
        accept(invitationRepository.findByTokenHash(hashToken(token)), userId)

    /**
     * Accepts the invitation a Magic Link was requested from, named by id rather than by token (#342).
     *
     * The plaintext token never reaches the magic-link record — it holds a reference, so that an
     * emailed login link carries no join credential of its own — which is why this path cannot go back
     * through the hash. Same refusal semantics as [acceptInvitation]: null for an invitation that has
     * since expired, been rotated away, or, for the single-use ADMIN handover link, already been spent.
     */
    fun acceptPendingInvitation(invitationId: UUID, userId: UserId): TeamId? =
        accept(invitationRepository.findById(invitationId), userId)

    /**
     * The id of the live invitation [token] names, or null when it names none — what a magic-link
     * request resolves so a dead link is refused before any email is sent (#342).
     *
     * "Live" has to mean both unexpired **and** unspent. A single-use ADMIN handover link that was
     * already accepted is as dead as an expired one, and checking only the expiry sent an email for
     * it, then failed on verification and landed the joiner on `?invite=unavailable` — the round trip
     * this method exists to avoid. [acceptInvitation] already refuses it, via `claim`.
     *
     * Resolution only: nothing is claimed or consumed here. An unspent ADMIN link that is merely
     * requested stays unspent, so the person who actually clicks through is the one who spends it,
     * and a request never burns a link on someone's behalf.
     */
    fun findPendingInvitation(token: String): UUID? =
        invitationRepository.findByTokenHash(hashToken(token))
            ?.takeIf { it.expiresAt.isAfter(Instant.now(clock)) }
            ?.takeIf { it.consumedAt == null }
            ?.id

    private fun accept(invitation: Invitation?, userId: UserId): TeamId? {
        val now = Instant.now(clock)
        val claimed = invitation
            ?.takeIf { it.expiresAt.isAfter(now) }
            ?.takeIf { claim(it, now) }
            ?: return null

        teamMemberRepository.addMember(claimed.teamId, userId, claimed.role)
        activeTeamService.activate(userId, claimed.teamId)
        return claimed.teamId
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

    private fun mint(token: InviteToken, scope: TeamScope, now: Instant, role: Role) = Invitation(
        id = UUID.randomUUID(),
        teamId = scope.teamId,
        role = role,
        consumedAt = null,
        tokenHash = hashToken(token.value),
        encryptedToken = tokenCipher.encrypt(token.value),
        createdBy = scope.userId,
        expiresAt = now.plus(INVITE_TTL),
        createdAt = now,
    )

    /** The stored form back to something shareable; null for a hash-only pre-ADR-0025 row. */
    private fun reveal(invitation: Invitation): GeneratedInvitation? =
        invitation.encryptedToken?.let { encrypted: EncryptedToken ->
            GeneratedInvitation(token = InviteToken(tokenCipher.decrypt(encrypted)), expiresAt = invitation.expiresAt)
        }

    private fun generateToken(): InviteToken = InviteToken(SecureTokens.urlSafe(TOKEN_BYTE_LENGTH))

    /**
     * Salted SHA-256, hex-encoded. Still the token's identity for lookup: [acceptInvitation] hashes
     * the presented token this way and matches on the stored digest, so a joiner's token never causes
     * a decryption. ADR-0025 added an encrypted copy beside it for the admin read path; it did not
     * change what accept matches on.
     */
    private fun hashToken(token: String): TokenHash =
        TokenHash(SecureTokens.sha256Hex((tokenSalt + token).toByteArray()))
}
