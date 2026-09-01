package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.InvitationService
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.AcceptInvitation
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateAdminInvitation
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateInvitation
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ExpireAdminInvitations
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ExpireInvitations
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetActiveAdminInvitation
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetActiveInvitation
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RotateAdminInvitation
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RotateInvitation
import com.github.zzave.teambalance.api.interfaces.generated.model.AcceptedInvitation
import com.github.zzave.teambalance.api.interfaces.generated.model.Invitation
import org.springframework.web.bind.annotation.RestController

@RestController
class InvitationController(
    private val invitationService: InvitationService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : CreateInvitation.Handler,
    CreateAdminInvitation.Handler,
    GetActiveAdminInvitation.Handler,
    RotateAdminInvitation.Handler,
    ExpireAdminInvitations.Handler,
    AcceptInvitation.Handler,
    ExpireInvitations.Handler,
    GetActiveInvitation.Handler,
    RotateInvitation.Handler {

    /**
     * The team's current invite link, so an admin returning to the screen sees the link they already
     * shared rather than being handed a new one (ADR-0025). 204 when the team has none — an absent
     * link is an ordinary state the UI turns into a "generate one" offer, not an error.
     */
    override suspend fun getActiveInvitation(request: GetActiveInvitation.Request): GetActiveInvitation.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()

        val invitation = invitationService.activeInviteLink(callerId = userId, teamId = teamId)
            ?: return GetActiveInvitation.Response204(Unit)
        return GetActiveInvitation.Response200(
            Invitation(
                token = invitation.token.value,
                expiresAt = invitation.expiresAt.toString(),
            ),
        )
    }

    override suspend fun createInvitation(request: CreateInvitation.Request): CreateInvitation.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()

        val invitation = invitationService.generateInviteLink(callerId = userId, teamId = teamId)
        return CreateInvitation.Response201(
            Invitation(
                token = invitation.token.value,
                expiresAt = invitation.expiresAt.toString(),
            ),
        )
    }

    /**
     * The single-use, ADMIN-granting handover link (ADR-0024 §5). Same team-scoped admin gate as
     * [createInvitation]; the acting-in Platform Admin passes it through their Virtual Member. The
     * distinct minting keeps this link off the shareable USER link's idempotency and GET-active read.
     */
    override suspend fun createAdminInvitation(
        request: CreateAdminInvitation.Request,
    ): CreateAdminInvitation.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()

        val invitation = invitationService.generateAdminInviteLink(callerId = userId, teamId = teamId)
        return CreateAdminInvitation.Response201(
            Invitation(
                token = invitation.token.value,
                expiresAt = invitation.expiresAt.toString(),
            ),
        )
    }

    /**
     * The team's current unspent ADMIN handover link, so it survives a refresh (ADR-0025's
     * recoverability, extended to the handover link). 204 when there is none — the UI turns that into a
     * "create one" offer.
     */
    override suspend fun getActiveAdminInvitation(
        request: GetActiveAdminInvitation.Request,
    ): GetActiveAdminInvitation.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()

        val invitation = invitationService.activeAdminInviteLink(callerId = userId, teamId = teamId)
            ?: return GetActiveAdminInvitation.Response204(Unit)
        return GetActiveAdminInvitation.Response200(
            Invitation(token = invitation.token.value, expiresAt = invitation.expiresAt.toString()),
        )
    }

    /** Revoke-and-reissue the ADMIN handover link (the shareable USER link is untouched). */
    override suspend fun rotateAdminInvitation(
        request: RotateAdminInvitation.Request,
    ): RotateAdminInvitation.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()

        val invitation = invitationService.rotateAdminInviteLink(callerId = userId, teamId = teamId)
        return RotateAdminInvitation.Response201(
            Invitation(token = invitation.token.value, expiresAt = invitation.expiresAt.toString()),
        )
    }

    /** Revoke the ADMIN handover link without a replacement (the shareable USER link keeps working). */
    override suspend fun expireAdminInvitations(
        request: ExpireAdminInvitations.Request,
    ): ExpireAdminInvitations.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()

        invitationService.expireAdminInviteLinks(callerId = userId, teamId = teamId)
        return ExpireAdminInvitations.Response204(Unit)
    }

    override suspend fun acceptInvitation(request: AcceptInvitation.Request): AcceptInvitation.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = invitationService.acceptInvitation(request.path.token, userId)
            ?: return AcceptInvitation.Response404(Unit)
        return AcceptInvitation.Response200(AcceptedInvitation(teamId = teamId.produce()))
    }

    override suspend fun expireInvitations(request: ExpireInvitations.Request): ExpireInvitations.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()

        invitationService.expireActiveInvitations(callerId = userId, teamId = teamId)
        return ExpireInvitations.Response204(Unit)
    }

    override suspend fun rotateInvitation(request: RotateInvitation.Request): RotateInvitation.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()

        val invitation = invitationService.rotateInviteLink(callerId = userId, teamId = teamId)
        return RotateInvitation.Response201(
            Invitation(
                token = invitation.token.value,
                expiresAt = invitation.expiresAt.toString(),
            ),
        )
    }
}

// The Wirespec edge for a team's identity — the contract still carries a bare UUID string. internal so
// the other two responses that name a team (create-team's 201, `/auth/me`'s team ref) convert the same
// way; everywhere else the tenant is server-resolved and never spoken aloud.
internal fun TeamId.produce(): String = value.toString()
