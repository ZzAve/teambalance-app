package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.EventTypeService
import com.github.zzave.teambalance.api.interfaces.generated.EventTypeItem
import com.github.zzave.teambalance.api.interfaces.generated.EventTypeList
import com.github.zzave.teambalance.api.interfaces.generated.ListEventTypesEndpoint
import org.springframework.web.bind.annotation.RestController

@RestController
class EventTypeController(
    private val eventTypeService: EventTypeService,
) : ListEventTypesEndpoint.Handler {

    override suspend fun listEventTypes(request: ListEventTypesEndpoint.Request): ListEventTypesEndpoint.Response<*> {
        val types = eventTypeService.findAll().map { type ->
            EventTypeItem(
                id = type.id.toString(),
                name = type.name,
                color = type.color,
            )
        }
        return ListEventTypesEndpoint.Response200(EventTypeList(eventTypes = types))
    }
}
