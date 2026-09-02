package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.EventTypeService
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ArchiveEventType
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateEventType
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListEventTypes
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UnarchiveEventType
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdateEventType
import com.github.zzave.teambalance.api.interfaces.generated.model.EventTypeItem
import com.github.zzave.teambalance.api.interfaces.generated.model.EventTypeList
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class EventTypeController(
    private val eventTypeService: EventTypeService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : ListEventTypes.Handler,
    CreateEventType.Handler,
    UpdateEventType.Handler,
    ArchiveEventType.Handler,
    UnarchiveEventType.Handler {

    /**
     * Readable by any authenticated member — the pickers and the roster panel both need it. Archived
     * types are excluded unless asked for; only the admin screen asks, so every other surface gets
     * exactly the types a team can still choose.
     */
    override suspend fun listEventTypes(request: ListEventTypes.Request): ListEventTypes.Response<*> {
        currentUserGateway.requireCurrentUserId()
        val includeArchived = request.queries.includearchived == true
        return ListEventTypes.Response200(
            EventTypeList(eventTypes = eventTypeService.findAll(includeArchived).map { it.produce() }),
        )
    }

    override suspend fun createEventType(request: CreateEventType.Request): CreateEventType.Response<*> {
        val body = request.body
        return CreateEventType.Response201(
            eventTypeService.createEventType(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                name = EventTypeName(body.name.trim()),
                color = body.color?.let(::HexColor),
                rosterDefault = body.rosterDefault.consume(),
            ).produce(),
        )
    }

    override suspend fun updateEventType(request: UpdateEventType.Request): UpdateEventType.Response<*> {
        val body = request.body
        return UpdateEventType.Response200(
            eventTypeService.updateEventType(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                id = request.path.id.consumeEventTypeId(),
                name = EventTypeName(body.name.trim()),
                color = body.color?.let(::HexColor),
                rosterDefault = body.rosterDefault.consume(),
            ).produce(),
        )
    }

    // Soft delete: the type stops appearing in pickers, its events keep it and keep rendering. The
    // optional migration moves those events onto another active type first, in the same transaction.
    override suspend fun archiveEventType(request: ArchiveEventType.Request): ArchiveEventType.Response<*> =
        ArchiveEventType.Response200(
            eventTypeService.archiveEventType(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                id = request.path.id.consumeEventTypeId(),
                migrateEventsTo = request.body.migrateEventsTo?.consumeEventTypeId(),
            ).produce(),
        )

    override suspend fun unarchiveEventType(request: UnarchiveEventType.Request): UnarchiveEventType.Response<*> =
        UnarchiveEventType.Response200(
            eventTypeService.unarchiveEventType(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                id = request.path.id.consumeEventTypeId(),
            ).produce(),
        )
}

private fun EventType.produce() = EventTypeItem(
    id = id.produce(),
    name = name.value,
    color = color?.value,
    archived = archived,
    rosterDefault = rosterDefault.produce(),
)

// The Wirespec edge for an event type's identity — the contract still carries a bare UUID
// string, unchanged by EventTypeId (ADR-0018). internal so EventController and
// RecurringEventController, which read an event type off a request, convert the same way.
internal fun String.consumeEventTypeId(): EventTypeId = EventTypeId(UUID.fromString(this))

internal fun EventTypeId.produce(): String = value.toString()
