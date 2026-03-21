package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.CurrentUserProvider
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.interfaces.generated.AttendanceEntry
import com.github.zzave.teambalance.api.interfaces.generated.AttendanceSummary
import com.github.zzave.teambalance.api.interfaces.generated.CreateEventEndpoint
import com.github.zzave.teambalance.api.interfaces.generated.DeleteEventEndpoint
import com.github.zzave.teambalance.api.interfaces.generated.Event
import com.github.zzave.teambalance.api.interfaces.generated.EventDetail
import com.github.zzave.teambalance.api.interfaces.generated.EventList
import com.github.zzave.teambalance.api.interfaces.generated.EventTypeSummary
import com.github.zzave.teambalance.api.interfaces.generated.GetEventEndpoint
import com.github.zzave.teambalance.api.interfaces.generated.ListEventsEndpoint
import com.github.zzave.teambalance.api.interfaces.generated.UpdateEventEndpoint
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
class EventController(
    private val eventService: EventService,
    private val attendanceService: AttendanceService,
    private val currentUserProvider: CurrentUserProvider,
) : ListEventsEndpoint.Handler,
    CreateEventEndpoint.Handler,
    GetEventEndpoint.Handler,
    UpdateEventEndpoint.Handler,
    DeleteEventEndpoint.Handler {

    override suspend fun listEvents(request: ListEventsEndpoint.Request): ListEventsEndpoint.Response<*> {
        val events = if (request.queries.includepast) eventService.getAllEvents() else eventService.getUpcomingEvents()
        return ListEventsEndpoint.Response200(
            EventList(events = events.map { it.toWirespec() })
        )
    }

    override suspend fun createEvent(request: CreateEventEndpoint.Request): CreateEventEndpoint.Response<*> {
        val req = request.body
        val teamId = UUID.fromString("a0000000-0000-0000-0000-000000000001") // TODO: resolve from tenant context
        val event = eventService.createEvent(
            eventTypeId = UUID.fromString(req.eventTypeId),
            title = req.title,
            description = req.description,
            startTime = Instant.parse(req.startTime),
            endTime = req.endTime?.let { Instant.parse(it) },
            location = req.location,
            createdBy = currentUserProvider.requireCurrentUserId(),
            teamId = teamId,
        )
        return CreateEventEndpoint.Response201(event.toWirespec())
    }

    override suspend fun getEvent(request: GetEventEndpoint.Request): GetEventEndpoint.Response<*> {
        val id = UUID.fromString(request.path.id)
        val event = eventService.getEvent(id)
            ?: return GetEventEndpoint.Response404(Unit)

        val attendances = attendanceService.getAttendancesWithNames(id)
        val summary = attendanceService.getAttendanceSummary(id)

        return GetEventEndpoint.Response200(
            EventDetail(
                id = event.id.toString(),
                eventType = event.eventType.toSummary(),
                title = event.title,
                description = event.description,
                startTime = event.startTime.toString(),
                endTime = event.endTime?.toString(),
                location = event.location,
                attendanceSummary = summary.toWirespec(),
                attendances = attendances.map { (a, name) ->
                    AttendanceEntry(
                        id = a.id.toString(),
                        userId = a.userId.toString(),
                        displayName = name,
                        state = a.state.name,
                    )
                },
            )
        )
    }

    override suspend fun updateEvent(request: UpdateEventEndpoint.Request): UpdateEventEndpoint.Response<*> {
        val id = UUID.fromString(request.path.id)
        val req = request.body
        val event = eventService.updateEvent(
            id = id,
            eventTypeId = UUID.fromString(req.eventTypeId),
            title = req.title,
            description = req.description,
            startTime = Instant.parse(req.startTime),
            endTime = req.endTime?.let { Instant.parse(it) },
            location = req.location,
        ) ?: return UpdateEventEndpoint.Response404(Unit)

        return UpdateEventEndpoint.Response200(event.toWirespec())
    }

    override suspend fun deleteEvent(request: DeleteEventEndpoint.Request): DeleteEventEndpoint.Response<*> {
        val id = UUID.fromString(request.path.id)
        return if (eventService.deleteEvent(id)) {
            DeleteEventEndpoint.Response204(Unit)
        } else {
            DeleteEventEndpoint.Response404(Unit)
        }
    }

    private fun com.github.zzave.teambalance.api.domain.model.Event.toWirespec(): Event {
        val summary = attendanceService.getAttendanceSummary(id)
        return Event(
            id = id.toString(),
            eventType = eventType.toSummary(),
            title = title,
            description = description,
            startTime = startTime.toString(),
            endTime = endTime?.toString(),
            location = location,
            attendanceSummary = summary.toWirespec(),
        )
    }

    private fun com.github.zzave.teambalance.api.domain.model.EventType.toSummary() =
        EventTypeSummary(id = id.toString(), name = name, color = color)

    private fun Map<AttendanceState, Int>.toWirespec() =
        AttendanceSummary(
            attending = (this[AttendanceState.ATTENDING] ?: 0).toLong(),
            maybe = (this[AttendanceState.MAYBE] ?: 0).toLong(),
            absent = (this[AttendanceState.ABSENT] ?: 0).toLong(),
            notResponded = (this[AttendanceState.NOT_RESPONDED] ?: 0).toLong(),
        )
}
