package com.github.zzave.teambalance.api.interfaces

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
import com.github.zzave.teambalance.api.interfaces.generated.model.MemberPosition
import org.springframework.web.bind.annotation.RestController

@RestController
class MemberController(
    private val memberService: MemberService,
    private val requestScope: RequestScope,
) : GetCurrentMember.Handler,
    ListMembers.Handler,
    UpdateMember.Handler,
    CompleteOnboarding.Handler,
    RemoveMember.Handler {

    override suspend fun getCurrentMember(request: GetCurrentMember.Request): GetCurrentMember.Response<*> {
        val scope = requestScope.teamScope()
        return GetCurrentMember.Response200(memberService.getMember(scope, scope.userId).toDto())
    }

    override suspend fun listMembers(request: ListMembers.Request): ListMembers.Response<*> {
        return ListMembers.Response200(MemberList(memberService.listMembers(requestScope.teamScope()).map { it.toDto() }))
    }

    override suspend fun updateMember(request: UpdateMember.Request): UpdateMember.Response<*> {
        // Admin-vs-self and role guards are enforced in the service, not here.
        val updated = memberService.updateMember(
            scope = requestScope.teamScope(),
            targetUserId = request.path.userId.consumeUserId(),
            rawName = request.body.displayName,
            role = Role.valueOf(request.body.role),
            positionId = request.body.positionId?.let { it.consumePositionId() },
            shirtNumber = request.body.shirtNumber?.toIntOrMax(),
        )
        return UpdateMember.Response200(updated.toDto())
    }

    override suspend fun completeOnboarding(request: CompleteOnboarding.Request): CompleteOnboarding.Response<*> {
        // Onboarding is self-only and never changes role — the request's role field is ignored. A missing
        // shirt number keeps the current one.
        val updated = memberService.completeOnboarding(
            scope = requestScope.teamScope(),
            rawName = request.body.displayName,
            positionId = request.body.positionId?.let { it.consumePositionId() },
            shirtNumber = request.body.shirtNumber?.toIntOrMax(),
        )
        return CompleteOnboarding.Response200(updated.toDto())
    }

    override suspend fun removeMember(request: RemoveMember.Request): RemoveMember.Response<*> {
        memberService.removeMember(requestScope.teamScope(), request.path.userId.consumeUserId())
        return RemoveMember.Response204(Unit)
    }
}

private fun TeamMember.toDto() = Member(
    userId = userId.produce(),
    displayName = displayName.value,
    role = permission.name,
    position = positionId?.let { MemberPosition(id = it.produce(), label = position?.value ?: "") },
    onboarded = onboarded,
    shirtNumber = shirtNumber?.value?.toLong(),
    photoVersion = photoVersion?.value,
)

// Saturates instead of wrapping, so a number past Int range is rejected as out of range rather than
// silently becoming a valid one.
private fun Long.toIntOrMax(): Int = if (this in Int.MIN_VALUE.toLong()..Int.MAX_VALUE.toLong()) toInt() else Int.MAX_VALUE
