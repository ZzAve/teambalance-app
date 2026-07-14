package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Invitation

interface InvitationRepository {
    fun save(invitation: Invitation): Invitation
    fun findByTokenHash(tokenHash: String): Invitation?
}
