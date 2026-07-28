package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CurrentTeamProvider
import com.github.zzave.teambalance.api.application.CurrentUserProvider
import com.github.zzave.teambalance.api.application.InvitationService
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.AcceptInvitation
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateInvitation
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ExpireInvitations
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RotateInvitation
import com.github.zzave.teambalance.api.interfaces.generated.model.AcceptedInvitation
import com.github.zzave.teambalance.api.interfaces.generated.model.Invitation
import org.springframework.web.bind.annotation.RestController

@RestController
class InvitationController(
    private val invitationService: InvitationService,
    private val currentUserProvider: CurrentUserProvider,
    private val currentTeamProvider: CurrentTeamProvider,
) : CreateInvitation.Handler,
    AcceptInvitation.Handler,
    ExpireInvitations.Handler,
    RotateInvitation.Handler {

    override suspend fun createInvitation(request: CreateInvitation.Request): CreateInvitation.Response<*> {
        val userId = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()

        val invitation = invitationService.generateInviteLink(callerId = userId, teamId = teamId)
        return CreateInvitation.Response201(
            Invitation(
                token = invitation.token,
                expiresAt = invitation.expiresAt.toString(),
            ),
        )
    }

    override suspend fun acceptInvitation(request: AcceptInvitation.Request): AcceptInvitation.Response<*> {
        val userId = currentUserProvider.requireCurrentUserId()
        val teamId = invitationService.acceptInvitation(request.path.token, userId)
            ?: return AcceptInvitation.Response404(Unit)
        return AcceptInvitation.Response200(AcceptedInvitation(teamId = teamId.toString()))
    }

    override suspend fun expireInvitations(request: ExpireInvitations.Request): ExpireInvitations.Response<*> {
        val userId = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()

        invitationService.expireActiveInvitations(callerId = userId, teamId = teamId)
        return ExpireInvitations.Response204(Unit)
    }

    override suspend fun rotateInvitation(request: RotateInvitation.Request): RotateInvitation.Response<*> {
        val userId = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()

        val invitation = invitationService.rotateInviteLink(callerId = userId, teamId = teamId)
        return RotateInvitation.Response201(
            Invitation(
                token = invitation.token,
                expiresAt = invitation.expiresAt.toString(),
            ),
        )
    }
}
