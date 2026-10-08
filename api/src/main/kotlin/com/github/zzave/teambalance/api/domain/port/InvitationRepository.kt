package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import java.time.Instant
import java.util.UUID

interface InvitationRepository {
    fun save(invitation: Invitation): Invitation
    fun findByTokenHash(tokenHash: TokenHash): Invitation?

    /**
     * The invitation by its own id, regardless of expiry or consumption — expiry is the caller's check,
     * exactly as it is on [findByTokenHash].
     *
     * The id-shaped read exists because a sign-in requested from an Invite Link remembers the
     * invitation rather than the token (#342): the plaintext never reaches the magic-link record, so
     * accept-on-verification cannot go back through the hash.
     */
    fun findById(invitationId: UUID): Invitation?

    /**
     * The team's current unspent link of [role], or null if it has none — active at [now] and not yet
     * consumed. At most one is active per role at a time, the invariant callers maintain by minting
     * through `InvitationService.generateInviteLink` (idempotent) or [rotate] (expire-and-replace).
     * Scoped by role so a live ADMIN handover link is never mistaken for the shareable USER one, and
     * never re-shown by the "current link" read (ADR-0024 §5). A USER link is never consumed, so the
     * unspent filter only narrows ADMIN links.
     */
    fun findActive(teamId: TeamId, role: Role, now: Instant): Invitation?

    /**
     * Marks the invitation [invitationId] consumed as of [now], but only if it was still unspent —
     * `UPDATE … SET consumed_at = :now WHERE id = :id AND consumed_at IS NULL`. Returns true iff one
     * row changed, so a second accept of a single-use ADMIN link (or a lost race) gets false and joins
     * nobody. Consume-first ordering makes the failure mode fail-safe: at most one caller ever passes.
     */
    fun consume(invitationId: UUID, now: Instant): Boolean

    /**
     * Marks the team's active (unexpired) links **of [role]** as expired as of [now]. Scoped by role so
     * revoking the shareable USER link never collaterally kills a live single-use ADMIN handover link,
     * and vice-versa — they are independent credentials (ADR-0024 §5), each revoked on its own path.
     */
    fun expireActive(teamId: TeamId, role: Role, now: Instant)

    /**
     * Expires the team's active invitations **of [replacement]'s role** and mints [replacement] in
     * their place, as ONE unit: if the mint fails the expiry is rolled back, so a team is never left
     * without a usable link. The role scoping keeps a USER rotate off the ADMIN handover link (and
     * vice-versa) — the replacement's role decides which link is being reissued.
     *
     * Expire-then-mint is the only operation in the codebase whose atomicity spans two distinct
     * writes, so it is expressed as a single port call — the application states the intent and the
     * adapter makes it atomic, keeping "one port call is one transaction" intact.
     */
    fun rotate(teamId: TeamId, replacement: Invitation, now: Instant): Invitation
}
