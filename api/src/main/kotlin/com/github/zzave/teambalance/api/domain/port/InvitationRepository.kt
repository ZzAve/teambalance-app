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
     * The team's current shareable (USER) invite link, or null if it has none. At most one is active at
     * a time — the invariant [InvitationRepository] callers maintain by minting through
     * `InvitationService.generateInviteLink` (idempotent) or [rotate] (expire-and-replace). Scoped to
     * [Role.USER] so a live ADMIN handover link is never mistaken for the shareable one, and never
     * re-shown by the admin's "current link" read.
     */
    fun findActiveByTeam(teamId: TeamId, now: Instant): Invitation?

    /**
     * The team's current unspent ADMIN handover link, or null if it has none — active at [now],
     * [Role.ADMIN], and not yet consumed. Backs the idempotent mint of the handover link, so a team
     * holds at most one live ADMIN credential at a time (ADR-0024 §5).
     */
    fun findActiveAdminByTeam(teamId: TeamId, now: Instant): Invitation?

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
