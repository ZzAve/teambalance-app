package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class EventTypeController(
    private val eventTypeRepository: EventTypeRepository,
) {
    @GetMapping("/api/event-types")
    fun listEventTypes(): ResponseEntity<Map<String, Any>> {
        val types = eventTypeRepository.findAll().map { type ->
            mapOf(
                "id" to type.id.toString(),
                "name" to type.name,
                "color" to type.color,
            )
        }
        return ResponseEntity.ok(mapOf("eventTypes" to types))
    }
}
