package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.interfaces.dto.AttendanceEntryDto
import com.github.zzave.teambalance.api.interfaces.dto.AttendanceSummaryDto
import com.github.zzave.teambalance.api.interfaces.dto.EventDetailDto
import com.github.zzave.teambalance.api.interfaces.dto.EventDto
import com.github.zzave.teambalance.api.interfaces.dto.EventListDto
import com.github.zzave.teambalance.api.interfaces.dto.EventTypeSummaryDto
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
@RequestMapping("/api/events")
class EventController(
    private val eventService: EventService,
    private val attendanceService: AttendanceService,
) {
    @GetMapping
    fun listEvents(
        @RequestParam(name = "include-past", defaultValue = "false") includePast: Boolean,
    ): ResponseEntity<EventListDto> {
        val events = if (includePast) eventService.getAllEvents() else eventService.getUpcomingEvents()
        val eventDtos = events.map { it.toDto(attendanceService) }
        return ResponseEntity.ok(EventListDto(events = eventDtos))
    }

    @PostMapping
    fun createEvent(
        @RequestBody request: CreateEventRequest,
        @RequestHeader("X-User-Id") userId: String,
    ): ResponseEntity<EventDto> {
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

    @GetMapping("/{id}")
    fun getEvent(@PathVariable id: UUID): ResponseEntity<EventDetailDto> {
        val event = eventService.getEvent(id) ?: return ResponseEntity.notFound().build()
        val attendances = attendanceService.getAttendancesWithNames(id)
        val summary = attendanceService.getAttendanceSummary(id)

        val dto = event.toDetailDto(attendances, summary)
        return ResponseEntity.ok(dto)
    }

    @PutMapping("/{id}")
    fun updateEvent(
        @PathVariable id: UUID,
        @RequestBody request: UpdateEventRequest,
    ): ResponseEntity<EventDto> {
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

    @DeleteMapping("/{id}")
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

private fun Map<AttendanceState, Int>.toSummaryDto() = AttendanceSummaryDto(
    attending = this[AttendanceState.ATTENDING] ?: 0,
    maybe = this[AttendanceState.MAYBE] ?: 0,
    absent = this[AttendanceState.ABSENT] ?: 0,
    notResponded = this[AttendanceState.NOT_RESPONDED] ?: 0,
)

private fun Event.toDto(attendanceService: AttendanceService): EventDto {
    val summary = attendanceService.getAttendanceSummary(id)
    return EventDto(
        id = id.toString(),
        eventType = EventTypeSummaryDto(id = eventType.id.toString(), name = eventType.name, color = eventType.color),
        title = title,
        description = description,
        startTime = startTime.toString(),
        endTime = endTime?.toString(),
        location = location,
        attendanceSummary = summary.toSummaryDto(),
    )
}

private fun Event.toDetailDto(
    attendances: List<Pair<com.github.zzave.teambalance.api.domain.model.Attendance, String>>,
    summary: Map<AttendanceState, Int>,
): EventDetailDto {
    return EventDetailDto(
        id = id.toString(),
        eventType = EventTypeSummaryDto(id = eventType.id.toString(), name = eventType.name, color = eventType.color),
        title = title,
        description = description,
        startTime = startTime.toString(),
        endTime = endTime?.toString(),
        location = location,
        attendanceSummary = summary.toSummaryDto(),
        attendances = attendances.map { (a, name) ->
            AttendanceEntryDto(
                id = a.id.toString(),
                userId = a.userId.toString(),
                displayName = name,
                state = a.state.name,
            )
        },
    )
}
