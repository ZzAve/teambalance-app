package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.Event
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
class EventController(
    private val eventService: EventService,
    private val attendanceService: AttendanceService,
) {
    @GetMapping("/api/events")
    fun listEvents(
        @RequestParam(name = "include-past", defaultValue = "false") includePast: Boolean,
    ): ResponseEntity<Map<String, Any?>> {
        val events = if (includePast) eventService.getAllEvents() else eventService.getUpcomingEvents()
        val eventDtos = events.map { it.toDto(attendanceService) }
        return ResponseEntity.ok(mapOf("events" to eventDtos))
    }

    @PostMapping("/api/events")
    fun createEvent(
        @RequestBody request: CreateEventRequest,
        @RequestHeader("X-User-Id") userId: String,
    ): ResponseEntity<Map<String, Any?>> {
        val teamId = UUID.fromString("a0000000-0000-0000-0000-000000000001")
        val event = eventService.createEvent(
            eventTypeId = UUID.fromString(request.eventTypeId),
            title = request.title,
            description = request.description,
            startTime = Instant.parse(request.startTime),
            endTime = request.endTime?.let { Instant.parse(it) },
            location = request.location,
            createdBy = UUID.fromString(userId),
            teamId = teamId,
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(event.toDto(attendanceService))
    }

    @GetMapping("/api/events/{id}")
    fun getEvent(@PathVariable id: UUID): ResponseEntity<Map<String, Any?>> {
        val event = eventService.getEvent(id) ?: return ResponseEntity.notFound().build()
        val attendances = attendanceService.getAttendancesWithNames(id)
        val summary = attendanceService.getAttendanceSummary(id)

        val dto = event.toDetailDto(attendances, summary)
        return ResponseEntity.ok(dto)
    }

    @PutMapping("/api/events/{id}")
    fun updateEvent(
        @PathVariable id: UUID,
        @RequestBody request: UpdateEventRequest,
    ): ResponseEntity<Map<String, Any?>> {
        val event = eventService.updateEvent(
            id = id,
            eventTypeId = UUID.fromString(request.eventTypeId),
            title = request.title,
            description = request.description,
            startTime = Instant.parse(request.startTime),
            endTime = request.endTime?.let { Instant.parse(it) },
            location = request.location,
        ) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(event.toDto(attendanceService))
    }

    @DeleteMapping("/api/events/{id}")
    fun deleteEvent(@PathVariable id: UUID): ResponseEntity<Unit> {
        return if (eventService.deleteEvent(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    data class CreateEventRequest(
        val eventTypeId: String,
        val title: String,
        val description: String?,
        val startTime: String,
        val endTime: String?,
        val location: String?,
    )

    data class UpdateEventRequest(
        val eventTypeId: String,
        val title: String,
        val description: String?,
        val startTime: String,
        val endTime: String?,
        val location: String?,
    )
}

private fun Event.toDto(attendanceService: AttendanceService): Map<String, Any?> {
    val summary = attendanceService.getAttendanceSummary(id)
    return mapOf(
        "id" to id.toString(),
        "eventType" to mapOf("id" to eventType.id.toString(), "name" to eventType.name, "color" to eventType.color),
        "title" to title,
        "description" to description,
        "startTime" to startTime.toString(),
        "endTime" to endTime?.toString(),
        "location" to location,
        "attendanceSummary" to mapOf(
            "attending" to (summary[AttendanceState.ATTENDING] ?: 0),
            "maybe" to (summary[AttendanceState.MAYBE] ?: 0),
            "absent" to (summary[AttendanceState.ABSENT] ?: 0),
            "notResponded" to (summary[AttendanceState.NOT_RESPONDED] ?: 0),
        ),
    )
}

private fun Event.toDetailDto(
    attendances: List<Pair<com.github.zzave.teambalance.api.domain.model.Attendance, String>>,
    summary: Map<AttendanceState, Int>,
): Map<String, Any?> {
    return mapOf(
        "id" to id.toString(),
        "eventType" to mapOf("id" to eventType.id.toString(), "name" to eventType.name, "color" to eventType.color),
        "title" to title,
        "description" to description,
        "startTime" to startTime.toString(),
        "endTime" to endTime?.toString(),
        "location" to location,
        "attendanceSummary" to mapOf(
            "attending" to (summary[AttendanceState.ATTENDING] ?: 0),
            "maybe" to (summary[AttendanceState.MAYBE] ?: 0),
            "absent" to (summary[AttendanceState.ABSENT] ?: 0),
            "notResponded" to (summary[AttendanceState.NOT_RESPONDED] ?: 0),
        ),
        "attendances" to attendances.map { (a, name) ->
            mapOf(
                "id" to a.id.toString(),
                "userId" to a.userId.toString(),
                "displayName" to name,
                "state" to a.state.name,
            )
        },
    )
}
