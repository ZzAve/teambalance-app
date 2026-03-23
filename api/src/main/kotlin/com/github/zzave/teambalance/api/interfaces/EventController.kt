package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.CurrentUserProvider
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.application.PotentialEvent
import com.github.zzave.teambalance.api.domain.model.AttendanceState as DomainAttendanceState
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateEvent
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DeleteEvent
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetEvent
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListEvents
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdateEvent
import com.github.zzave.teambalance.api.interfaces.generated.model.AttendanceEntry
import com.github.zzave.teambalance.api.interfaces.generated.model.AttendanceState
import com.github.zzave.teambalance.api.interfaces.generated.model.AttendanceSummary
import com.github.zzave.teambalance.api.interfaces.generated.model.DateTimestampWithTimezone
import com.github.zzave.teambalance.api.interfaces.generated.model.Event
import com.github.zzave.teambalance.api.interfaces.generated.model.EventDetail
import com.github.zzave.teambalance.api.interfaces.generated.model.EventList
import com.github.zzave.teambalance.api.interfaces.generated.model.EventTypeSummary
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
class EventController(
    private val eventService: EventService,
    private val attendanceService: AttendanceService,
    private val currentUserProvider: CurrentUserProvider,
) : ListEvents.Handler,
    CreateEvent.Handler,
    GetEvent.Handler,
    UpdateEvent.Handler,
    DeleteEvent.Handler {

    override suspend fun listEvents(request: ListEvents.Request): ListEvents.Response<*> {
        val events = if (request.queries.includepast) eventService.getAllEvents() else eventService.getUpcomingEvents()
        return ListEvents.Response200(
            EventList(events = events.map { it.produce(attendanceService) })
        )
    }

    override suspend fun createEvent(request: CreateEvent.Request): CreateEvent.Response<*> {
        val teamId = UUID.fromString("a0000000-0000-0000-0000-000000000001") // TODO: resolve from tenant context
        val event = eventService.createEvent(
            potential = request.body.consume(),
            createdBy = currentUserProvider.requireCurrentUserId(),
            teamId = teamId,
        )
        return CreateEvent.Response201(event.produce(attendanceService))
    }

    override suspend fun getEvent(request: GetEvent.Request): GetEvent.Response<*> {
        val id = UUID.fromString(request.path.id)
        val event = eventService.getEvent(id)
            ?: return GetEvent.Response404(Unit)

        val attendances = attendanceService.getAttendancesWithNames(id)
        val summary = attendanceService.getAttendanceSummary(id)

        return GetEvent.Response200(
            EventDetail(
                id = event.id.toString(),
                eventType = event.eventType.produce(),
                title = event.title,
                description = event.description,
                startTime = DateTimestampWithTimezone(event.startTime.toString()),
                endTime = DateTimestampWithTimezone(event.endTime.toString()),
                location = event.location,
                attendanceSummary = summary.produce(),
                attendances = attendances.map { (a, name) ->
                    AttendanceEntry(
                        id = a.id.toString(),
                        userId = a.userId.toString(),
                        displayName = name,
                        state = a.state.produce(),
                    )
                },
            )
        )
    }

    override suspend fun updateEvent(request: UpdateEvent.Request): UpdateEvent.Response<*> {
        val id = UUID.fromString(request.path.id)
        val req = request.body
        val event = eventService.updateEvent(
            id = id,
            eventTypeId = UUID.fromString(req.eventTypeId),
            title = req.title,
            description = req.description,
            startTime = Instant.parse(req.startTime.value),
            endTime = Instant.parse(req.endTime.value),
            location = req.location,
        ) ?: return UpdateEvent.Response404(Unit)

        return UpdateEvent.Response200(event.produce(attendanceService))
    }

    override suspend fun deleteEvent(request: DeleteEvent.Request): DeleteEvent.Response<*> {
        val id = UUID.fromString(request.path.id)
        return if (eventService.deleteEvent(id)) {
            DeleteEvent.Response204(Unit)
        } else {
            DeleteEvent.Response404(Unit)
        }
    }
}

private fun com.github.zzave.teambalance.api.interfaces.generated.model.CreateEventRequest.consume() =
    PotentialEvent(
        eventTypeId = UUID.fromString(eventTypeId),
        title = title,
        description = description,
        startTime = Instant.parse(startTime.value),
        endTime = Instant.parse(endTime.value),
        location = location,
    )

private fun com.github.zzave.teambalance.api.domain.model.Event.produce(attendanceService: AttendanceService): Event {
    val summary = attendanceService.getAttendanceSummary(id)
    return Event(
        id = id.toString(),
        eventType = eventType.produce(),
        title = title,
        description = description,
        startTime = DateTimestampWithTimezone(startTime.toString()),
        endTime = DateTimestampWithTimezone(endTime.toString()),
        location = location,
        attendanceSummary = summary.produce(),
    )
}

private fun com.github.zzave.teambalance.api.domain.model.EventType.produce() =
    EventTypeSummary(id = id.toString(), name = name, color = color)

private fun Map<DomainAttendanceState, Int>.produce() =
    AttendanceSummary(
        attending = (this[DomainAttendanceState.ATTENDING] ?: 0).toLong(),
        maybe = (this[DomainAttendanceState.MAYBE] ?: 0).toLong(),
        absent = (this[DomainAttendanceState.ABSENT] ?: 0).toLong(),
        notResponded = (this[DomainAttendanceState.NOT_RESPONDED] ?: 0).toLong(),
    )

private fun DomainAttendanceState.produce() = AttendanceState.valueOf(name)
