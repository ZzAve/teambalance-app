package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.PositionService
import com.github.zzave.teambalance.api.domain.model.Position
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
        val teamId = currentTeamGateway.requireCurrentTeamId()
        return ListPositions.Response200(PositionList(positionService.listPositions(teamId).map { it.toDto() }))
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
            id = UUID.fromString(request.path.id),
            rawLabel = request.body.label,
        )
        return RenamePosition.Response200(renamed.toDto())
    }

    override suspend fun deletePosition(request: DeletePosition.Request): DeletePosition.Response<*> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        positionService.deletePosition(caller, teamId, UUID.fromString(request.path.id))
        return DeletePosition.Response204(Unit)
    }
}

private fun Position.toDto() = PositionDto(id = id.toString(), label = label)
