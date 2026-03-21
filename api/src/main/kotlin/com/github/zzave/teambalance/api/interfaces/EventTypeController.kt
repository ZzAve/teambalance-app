package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.EventTypeService
import com.github.zzave.teambalance.api.interfaces.dto.EventTypeItemDto
import com.github.zzave.teambalance.api.interfaces.dto.EventTypeListDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/event-types")
class EventTypeController(
    private val eventTypeService: EventTypeService,
) {
    @GetMapping
    fun listEventTypes(): ResponseEntity<EventTypeListDto> {
        val types = eventTypeService.findAll().map { type ->
            EventTypeItemDto(
                id = type.id.toString(),
                name = type.name,
                color = type.color,
            )
        }
        return ResponseEntity.ok(EventTypeListDto(eventTypes = types))
    }
}
