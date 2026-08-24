package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.EventTypeService
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListEventTypes
import com.github.zzave.teambalance.api.interfaces.generated.model.EventTypeItem
import com.github.zzave.teambalance.api.interfaces.generated.model.EventTypeList
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class EventTypeController(
    private val eventTypeService: EventTypeService,
) : ListEventTypes.Handler {

    override suspend fun listEventTypes(request: ListEventTypes.Request): ListEventTypes.Response<*> {
        val types = eventTypeService.findAll().map { type ->
            EventTypeItem(
                id = type.id.produce(),
                name = type.name.value,
                color = type.color?.value,
                archived = type.archived,
                rosterDefault = type.rosterDefault.produce(),
            )
        }
        return ListEventTypes.Response200(EventTypeList(eventTypes = types))
    }
}

// The Wirespec edge for an event type's identity — the contract still carries a bare UUID
// string, unchanged by EventTypeId (ADR-0018). internal so EventController and
// RecurringEventController, which read an event type off a request, convert the same way.
internal fun String.consumeEventTypeId(): EventTypeId = EventTypeId(UUID.fromString(this))

internal fun EventTypeId.produce(): String = value.toString()
