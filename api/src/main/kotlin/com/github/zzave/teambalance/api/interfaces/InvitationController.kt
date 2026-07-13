package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.CurrentTeamProvider
import com.github.zzave.teambalance.api.application.CurrentUserProvider
import com.github.zzave.teambalance.api.application.InvitationService
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateInvitation
import com.github.zzave.teambalance.api.interfaces.generated.model.Invitation
import org.springframework.web.bind.annotation.RestController

@RestController
class InvitationController(
    private val invitationService: InvitationService,
    private val currentUserProvider: CurrentUserProvider,
    private val currentTeamProvider: CurrentTeamProvider,
    private val authorizationService: AuthorizationService,
) : CreateInvitation.Handler {

    override suspend fun createInvitation(request: CreateInvitation.Request): CreateInvitation.Response<*> {
        val userId = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()
        authorizationService.requireAdmin(userId, teamId)

        val invitation = invitationService.generateInviteLink(teamId = teamId, createdBy = userId)
        return CreateInvitation.Response201(
            Invitation(
                token = invitation.token,
                expiresAt = invitation.expiresAt.toString(),
            ),
        )
    }
}
