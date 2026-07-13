package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Invitation
import java.util.UUID

interface InvitationRepository {
    fun save(invitation: Invitation): Invitation

    /** The team's most recently created invitation, or null if none exists yet. */
    fun findLatestByTeamId(teamId: UUID): Invitation?
}
