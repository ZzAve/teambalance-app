package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CurrentTeamProvider
import com.github.zzave.teambalance.api.application.CurrentUserProvider
import com.github.zzave.teambalance.api.application.MemberService
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetCurrentMember
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdateMember
import com.github.zzave.teambalance.api.interfaces.generated.model.Member
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class MemberController(
    private val memberService: MemberService,
    private val currentUserProvider: CurrentUserProvider,
    private val currentTeamProvider: CurrentTeamProvider,
) : GetCurrentMember.Handler,
    UpdateMember.Handler {

    override suspend fun getCurrentMember(request: GetCurrentMember.Request): GetCurrentMember.Response<*> {
        val userId = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()
        return GetCurrentMember.Response200(memberService.getMember(teamId, userId).toDto())
    }

    override suspend fun updateMember(request: UpdateMember.Request): UpdateMember.Response<*> {
        val caller = currentUserProvider.requireCurrentUserId()
        val teamId = currentTeamProvider.requireCurrentTeamId()
        // Self-only: a caller may rename themselves, never another member.
        if (UUID.fromString(request.path.userId) != caller) return UpdateMember.Response403(Unit)
        return UpdateMember.Response200(
            memberService.updateOwnDisplayName(teamId, caller, request.body.displayName).toDto(),
        )
    }
}

private fun TeamMember.toDto() = Member(userId = userId.toString(), displayName = displayName, role = role)
