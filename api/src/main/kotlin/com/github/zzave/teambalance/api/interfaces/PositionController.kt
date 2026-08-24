package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.PositionService
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreatePosition
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DeletePosition
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListPositions
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RenamePosition
import com.github.zzave.teambalance.api.interfaces.generated.model.PositionList
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import com.github.zzave.teambalance.api.interfaces.generated.model.Position as PositionDto

@RestController
class PositionController(
    private val positionService: PositionService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : ListPositions.Handler,
    CreatePosition.Handler,
    RenamePosition.Handler,
    DeletePosition.Handler {

    override suspend fun listPositions(request: ListPositions.Request): ListPositions.Response<*> {
        // Any authenticated member may read the vocabulary; requireCurrentUserId fails closed with 401.
        currentUserGateway.requireCurrentUserId()
        // Kept for its effect, not its value: since ADR-0026 the tenant schema scopes the rows, but
        // this still refuses a caller with no Active Team — a clean 403 rather than a query against
        // __no_tenant__ surfacing as a 500.
        currentTeamGateway.requireCurrentTeamId()
        return ListPositions.Response200(PositionList(positionService.listPositions().map { it.toDto() }))
    }

    override suspend fun createPosition(request: CreatePosition.Request): CreatePosition.Response<*> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        val created = positionService.createPosition(caller, teamId, request.body.label)
        return CreatePosition.Response201(created.toDto())
    }

    override suspend fun renamePosition(request: RenamePosition.Request): RenamePosition.Response<*> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        val renamed = positionService.renamePosition(
            callerId = caller,
            teamId = teamId,
            id = request.path.id.consumePositionId(),
            rawLabel = request.body.label,
        )
        return RenamePosition.Response200(renamed.toDto())
    }

    override suspend fun deletePosition(request: DeletePosition.Request): DeletePosition.Response<*> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        positionService.deletePosition(caller, teamId, request.path.id.consumePositionId())
        return DeletePosition.Response204(Unit)
    }
}

private fun Position.toDto() = PositionDto(id = id.produce(), label = label.value)

// The Wirespec edge for a position's identity — the contract still carries a bare UUID string,
// unchanged by PositionId (ADR-0018). internal so MemberController, which reads a position off
// a member request, converts the same way.
internal fun String.consumePositionId(): PositionId = PositionId(UUID.fromString(this))

internal fun PositionId.produce(): String = value.toString()
