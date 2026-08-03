package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.MemberService
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CompleteOnboarding
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetCurrentMember
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListMembers
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RemoveMember
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdateMember
import com.github.zzave.teambalance.api.interfaces.generated.model.Member
import com.github.zzave.teambalance.api.interfaces.generated.model.MemberList
import com.github.zzave.teambalance.api.interfaces.generated.model.Position
import org.springframework.web.bind.annotation.RestController

@RestController
class MemberController(
    private val memberService: MemberService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
    private val authorizationService: AuthorizationService,
) : GetCurrentMember.Handler,
    ListMembers.Handler,
    UpdateMember.Handler,
    CompleteOnboarding.Handler,
    RemoveMember.Handler {

    override suspend fun getCurrentMember(request: GetCurrentMember.Request): GetCurrentMember.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        return GetCurrentMember.Response200(memberService.getMember(teamId, userId).toDto())
    }

    override suspend fun listMembers(request: ListMembers.Request): ListMembers.Response<*> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        authorizationService.requireAdmin(caller, teamId)
        return ListMembers.Response200(MemberList(memberService.listMembers(teamId).map { it.toDto() }))
    }

    override suspend fun updateMember(request: UpdateMember.Request): UpdateMember.Response<*> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        // Admin-vs-self and role guards are enforced in the service, not here.
        val updated = memberService.updateMember(
            callerId = caller,
            teamId = teamId,
            targetUserId = request.path.userId.consumeUserId(),
            rawName = request.body.displayName,
            role = Role.valueOf(request.body.role),
            positionId = request.body.positionId?.let { it.consumePositionId() },
        )
        return UpdateMember.Response200(updated.toDto())
    }

    override suspend fun completeOnboarding(request: CompleteOnboarding.Request): CompleteOnboarding.Response<*> {
        val userId = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        // Onboarding is self-only and never changes role — the request's role field is ignored.
        val updated = memberService.completeOnboarding(
            userId = userId,
            teamId = teamId,
            rawName = request.body.displayName,
            positionId = request.body.positionId?.let { it.consumePositionId() },
        )
        return CompleteOnboarding.Response200(updated.toDto())
    }

    override suspend fun removeMember(request: RemoveMember.Request): RemoveMember.Response<*> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        memberService.removeMember(caller, teamId, request.path.userId.consumeUserId())
        return RemoveMember.Response204(Unit)
    }
}

private fun TeamMember.toDto() = Member(
    userId = userId.produce(),
    displayName = displayName,
    role = role,
    position = positionId?.let { Position(id = it.produce(), label = position ?: "") },
    onboarded = onboarded,
)
