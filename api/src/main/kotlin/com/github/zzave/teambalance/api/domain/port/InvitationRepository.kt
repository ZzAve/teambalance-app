package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Invitation
import java.time.Instant
import java.util.UUID

interface InvitationRepository {
    fun save(invitation: Invitation): Invitation
    fun findByTokenHash(tokenHash: String): Invitation?

    /** Marks every currently-active (unexpired) invitation for the team as expired as of [now]. */
    fun expireActive(teamId: UUID, now: Instant)
}
