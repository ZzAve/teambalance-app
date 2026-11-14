package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.TeamRequestService
import com.github.zzave.teambalance.api.domain.model.TeamRequestEntry
import com.github.zzave.teambalance.api.domain.model.TeamRequestStatus as DomainStatus
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ApproveTeamRequest
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetMyTeamRequest
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListTeamRequests
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RejectTeamRequest
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SubmitTeamRequest
import com.github.zzave.teambalance.api.interfaces.generated.model.TeamRequest
import com.github.zzave.teambalance.api.interfaces.generated.model.TeamRequestList
import com.github.zzave.teambalance.api.interfaces.generated.model.TeamRequestStatus
import org.springframework.web.bind.annotation.RestController
import java.time.Clock
import java.util.UUID

/**
 * Team requests (ADR-0047): any signed-in user submits and reads their own; Platform Admins list and
 * decide. Error responses come from the thrown domain exceptions via [GlobalExceptionHandler]; the
 * admin gate is [TeamRequestService]'s.
 */
@RestController
class TeamRequestController(
    private val teamRequestService: TeamRequestService,
    private val currentUserGateway: CurrentUserGateway,
    private val clock: Clock,
) : SubmitTeamRequest.Handler,
    GetMyTeamRequest.Handler,
    ListTeamRequests.Handler,
    ApproveTeamRequest.Handler,
    RejectTeamRequest.Handler {

    override suspend fun submitTeamRequest(request: SubmitTeamRequest.Request): SubmitTeamRequest.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        val created = teamRequestService.submit(callerId, request.body.teamName, request.body.purpose)
        return SubmitTeamRequest.Response201(created.toDto())
    }

    override suspend fun getMyTeamRequest(request: GetMyTeamRequest.Request): GetMyTeamRequest.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        val latest = teamRequestService.mine(callerId) ?: return GetMyTeamRequest.Response404
        return GetMyTeamRequest.Response200(latest.toDto())
    }

    override suspend fun listTeamRequests(request: ListTeamRequests.Request): ListTeamRequests.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        return ListTeamRequests.Response200(TeamRequestList(teamRequestService.list(callerId).map { it.toDto() }))
    }

    override suspend fun approveTeamRequest(request: ApproveTeamRequest.Request): ApproveTeamRequest.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        return ApproveTeamRequest.Response200(
            teamRequestService.approve(callerId, UUID.fromString(request.path.id)).toDto(),
        )
    }

    override suspend fun rejectTeamRequest(request: RejectTeamRequest.Request): RejectTeamRequest.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        return RejectTeamRequest.Response200(
            teamRequestService.reject(callerId, UUID.fromString(request.path.id), request.body.reason).toDto(),
        )
    }

    private fun TeamRequestEntry.toDto() = TeamRequest(
        id = id.toString(),
        teamName = teamName.value,
        purpose = purpose.value,
        status = when (status) {
            DomainStatus.PENDING -> TeamRequestStatus.PENDING
            DomainStatus.APPROVED -> TeamRequestStatus.APPROVED
            DomainStatus.REJECTED -> TeamRequestStatus.REJECTED
        },
        requesterEmail = requesterEmail.value,
        requestedAt = requestedAt.toString(),
        decidedAt = decidedAt?.toString(),
        rejectReason = rejectReason?.value,
        creationCode = usableCode(clock.instant())?.value,
    )
}
