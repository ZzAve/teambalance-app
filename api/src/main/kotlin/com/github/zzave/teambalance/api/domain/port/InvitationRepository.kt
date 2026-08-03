package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.TeamId
import java.time.Instant
import java.util.UUID

interface InvitationRepository {
    fun save(invitation: Invitation): Invitation
    fun findByTokenHash(tokenHash: String): Invitation?

    /** Marks every currently-active (unexpired) invitation for the team as expired as of [now]. */
    fun expireActive(teamId: TeamId, now: Instant)

    /**
     * Expires the team's active invitations and mints [replacement] in their place, as ONE unit: if
     * the mint fails the expiry is rolled back, so a team is never left without a usable link.
     *
     * Expire-then-mint is the only operation in the codebase whose atomicity spans two distinct
     * writes, so it is expressed as a single port call — the application states the intent and the
     * adapter makes it atomic, keeping "one port call is one transaction" intact.
     */
    fun rotate(teamId: TeamId, replacement: Invitation, now: Instant): Invitation
}
