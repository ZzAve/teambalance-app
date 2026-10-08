package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.PositionService
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.port.RequestScopeGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreatePosition
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DeletePosition
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetPositionUsage
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListPositions
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RenamePosition
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetPositionKind
import com.github.zzave.teambalance.api.interfaces.generated.model.PositionList
import com.github.zzave.teambalance.api.interfaces.generated.model.PositionUsage
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import com.github.zzave.teambalance.api.interfaces.generated.model.Position as PositionDto

@RestController
class PositionController(
    private val positionService: PositionService,
    private val requestScope: RequestScopeGateway,
) : ListPositions.Handler,
    CreatePosition.Handler,
    RenamePosition.Handler,
    DeletePosition.Handler,
    SetPositionKind.Handler,
    GetPositionUsage.Handler {

    override suspend fun listPositions(request: ListPositions.Request): ListPositions.Response<*> {
        // Any authenticated member may read the vocabulary. Kept for its effect, not its value: since
        // ADR-0026 the tenant schema scopes the rows, but resolving the scope still refuses a caller
        // with no principal (401) or no Active Team — a clean 403 rather than a query against
        // __no_tenant__ surfacing as a 500.
        requestScope.teamScope()
        return ListPositions.Response200(PositionList(positionService.listPositions().map { it.toDto() }))
    }

    override suspend fun createPosition(request: CreatePosition.Request): CreatePosition.Response<*> {
        val created = positionService.createPosition(requestScope.teamScope(), request.body.label)
        return CreatePosition.Response201(created.toDto())
    }

    override suspend fun renamePosition(request: RenamePosition.Request): RenamePosition.Response<*> {
        val renamed = positionService.renamePosition(
            scope = requestScope.teamScope(),
            id = request.path.id.consumePositionId(),
            rawLabel = request.body.label,
        )
        return RenamePosition.Response200(renamed.toDto())
    }

    // Its own endpoint rather than a wider rename body (#281): a label is typed and saved, a kind is
    // toggled and applies at once, and "rename" that also reclassifies would misname the contract.
    override suspend fun setPositionKind(request: SetPositionKind.Request): SetPositionKind.Response<*> {
        val updated = positionService.setPositionKind(
            scope = requestScope.teamScope(),
            id = request.path.id.consumePositionId(),
            kind = request.body.kind.consume(),
        )
        return SetPositionKind.Response200(updated.toDto())
    }

    // What the delete confirmation reports before it lets the admin proceed (#219). Admin-only,
    // because it is the delete's own dialog that reads it.
    override suspend fun getPositionUsage(request: GetPositionUsage.Request): GetPositionUsage.Response<*> {
        val usage = positionService.positionUsage(
            scope = requestScope.teamScope(),
            id = request.path.id.consumePositionId(),
        )
        return GetPositionUsage.Response200(
            PositionUsage(
                eventTypeCount = usage.eventTypeCount.value.toLong(),
                eventCount = usage.eventCount.value.toLong(),
                memberCount = usage.memberCount.value.toLong(),
            ),
        )
    }

    override suspend fun deletePosition(request: DeletePosition.Request): DeletePosition.Response<*> {
        positionService.deletePosition(requestScope.teamScope(), request.path.id.consumePositionId())
        return DeletePosition.Response204(Unit)
    }
}

private fun Position.toDto() = PositionDto(id = id.produce(), label = label.value, kind = kind.produce())

// The Wirespec edge for a position's identity — the contract still carries a bare UUID string,
// unchanged by PositionId (ADR-0018). internal so MemberController, which reads a position off
// a member request, converts the same way.
internal fun String.consumePositionId(): PositionId = PositionId(UUID.fromString(this))

internal fun PositionId.produce(): String = value.toString()
