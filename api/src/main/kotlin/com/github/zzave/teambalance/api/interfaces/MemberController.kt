package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.CurrentTeamProvider
import com.github.zzave.teambalance.api.application.CurrentUserProvider
import com.github.zzave.teambalance.api.application.MemberService
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CompleteOnboarding
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetCurrentMember
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListMembers
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RemoveMember
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdateMember
import com.github.zzave.teambalance.api.interfaces.generated.model.Member
import com.github.zzave.teambalance.api.interfaces.generated.model.MemberList
import com.github.zzave.teambalance.api.interfaces.generated.model.Position
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class MemberController(
    private val memberService: MemberService,
    private val currentUserProvider: CurrentUserProvider,
    private val currentTeamProvider: CurrentTeamProvider,
    private val authorizationService: AuthorizationService,
) : GetCurrentMember.Handler,
    ListMembers.Handler,
    UpdateMember.Handler,
    CompleteOnboarding.Handler,
    RemoveMember.Handler {

    override suspend fun getCurrentMember(request: GetCurrentMember.Request): GetCurrentMember.Response<*> {
        val userId = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()
        return GetCurrentMember.Response200(memberService.getMember(teamId, userId).toDto())
    }

    override suspend fun listMembers(request: ListMembers.Request): ListMembers.Response<*> {
        val caller = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()
        authorizationService.requireAdmin(caller, teamId)
        return ListMembers.Response200(MemberList(memberService.listMembers(teamId).map { it.toDto() }))
    }

    override suspend fun updateMember(request: UpdateMember.Request): UpdateMember.Response<*> {
        val caller = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()
        // Admin-vs-self and role guards are enforced in the service, not here.
        val updated = memberService.updateMember(
            callerId = caller,
            teamId = teamId,
            targetUserId = UUID.fromString(request.path.userId),
            rawName = request.body.displayName,
            role = Role.valueOf(request.body.role),
            positionId = request.body.positionId?.let { UUID.fromString(it) },
        )
        return UpdateMember.Response200(updated.toDto())
    }

    override suspend fun completeOnboarding(request: CompleteOnboarding.Request): CompleteOnboarding.Response<*> {
        val userId = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()
        // Onboarding is self-only and never changes role — the request's role field is ignored.
        val updated = memberService.completeOnboarding(
            userId = userId,
            teamId = teamId,
            rawName = request.body.displayName,
            positionId = request.body.positionId?.let { UUID.fromString(it) },
        )
        return CompleteOnboarding.Response200(updated.toDto())
    }

    override suspend fun removeMember(request: RemoveMember.Request): RemoveMember.Response<*> {
        val caller = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()
        memberService.removeMember(caller, teamId, UUID.fromString(request.path.userId))
        return RemoveMember.Response204(Unit)
    }
}

private fun TeamMember.toDto() = Member(
    userId = userId.toString(),
    displayName = displayName,
    role = role,
    position = positionId?.let { Position(id = it.toString(), label = position ?: "") },
    onboarded = onboarded,
)
