package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.EventTypeService
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListEventTypes
import com.github.zzave.teambalance.api.interfaces.generated.model.EventTypeItem
import com.github.zzave.teambalance.api.interfaces.generated.model.EventTypeList
import org.springframework.web.bind.annotation.RestController

@RestController
class EventTypeController(
    private val eventTypeService: EventTypeService,
) : ListEventTypes.Handler {

    override suspend fun listEventTypes(request: ListEventTypes.Request): ListEventTypes.Response<*> {
        val types = eventTypeService.findAll().map { type ->
            EventTypeItem(
                id = type.id.toString(),
                name = type.name,
                color = type.color,
            )
        }
        return ListEventTypes.Response200(EventTypeList(eventTypes = types))
    }
}
