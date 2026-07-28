package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.CurrentTeamProvider
import com.github.zzave.teambalance.api.application.CurrentUserProvider
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.application.PotentialEvent
import com.github.zzave.teambalance.api.domain.model.AttendanceState as DomainAttendanceState
import com.github.zzave.teambalance.api.domain.model.EventAttendance
import com.github.zzave.teambalance.api.domain.model.EventReference as DomainEventReference
import com.github.zzave.teambalance.api.domain.model.EventSeriesScope as DomainEventSeriesScope
import com.github.zzave.teambalance.api.domain.model.MemberAttendance
import com.github.zzave.teambalance.api.domain.model.UNASSIGNED
import com.github.zzave.teambalance.api.interfaces.generated.model.EventSeriesScope as GeneratedEventSeriesScope
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
import com.github.zzave.teambalance.api.interfaces.generated.model.EventReference
import com.github.zzave.teambalance.api.interfaces.generated.model.RoleCount
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
class EventController(
    private val eventService: EventService,
    private val attendanceService: AttendanceService,
    private val currentUserProvider: CurrentUserProvider,
    private val currentTeamProvider: CurrentTeamProvider,
    private val authorizationService: AuthorizationService,
) : ListEvents.Handler,
    CreateEvent.Handler,
    GetEvent.Handler,
    UpdateEvent.Handler,
    DeleteEvent.Handler {

    override suspend fun listEvents(request: ListEvents.Request): ListEvents.Response<*> {
        val members = attendanceService.teamMembers(currentTeamProvider.requireCurrentTeamId())
        val events = if (request.queries.includepast) eventService.getAllEvents() else eventService.getUpcomingEvents()
        val attendance = attendanceService.attendanceForAll(events.map { it.id }, members)
        return ListEvents.Response200(
            EventList(events = events.map { it.produce(attendance.getValue(it.id)) })
        )
    }

    override suspend fun createEvent(request: CreateEvent.Request): CreateEvent.Response<*> {
        val teamId = currentTeamProvider.requireCurrentTeamId()
        val userId = currentUserProvider.requireCurrentUserId()
        authorizationService.requireAdmin(userId, teamId)
        val event = eventService.createEvent(
            potential = request.body.consume(),
            createdBy = userId,
        )
        return CreateEvent.Response201(
            event.produce(attendanceService.attendanceFor(event.id, attendanceService.teamMembers(teamId))),
        )
    }

    override suspend fun getEvent(request: GetEvent.Request): GetEvent.Response<*> {
        val id = UUID.fromString(request.path.id)
        val event = eventService.getEvent(id)
            ?: return GetEvent.Response404(Unit)

        val members = attendanceService.teamMembers(currentTeamProvider.requireCurrentTeamId())
        val attendance = attendanceService.attendanceFor(id, members)

        return GetEvent.Response200(
            EventDetail(
                id = event.id.toString(),
                eventType = event.eventType.produce(),
                title = event.title,
                description = event.description,
                startTime = DateTimestampWithTimezone(event.startTime.toString()),
                endTime = DateTimestampWithTimezone(event.endTime.toString()),
                location = event.location,
                references = event.references.externalize(),
                recurringGroup = event.recurringGroup?.toString(),
                attendanceSummary = attendance.summary().produce(attendance.attendingRoleBreakdown()),
                attendances = attendance.entries.map { it.produce() },
            )
        )
    }

    // Scoped edit (ADR-0014, Phase 3): a bulk scope touches many rows, so the success type is an
    // EventList of the affected occurrences. The scope query param defaults to THIS when absent.
    override suspend fun updateEvent(request: UpdateEvent.Request): UpdateEvent.Response<*> {
        val teamId = currentTeamProvider.requireCurrentTeamId()
        authorizationService.requireAdmin(currentUserProvider.requireCurrentUserId(), teamId)
        val id = UUID.fromString(request.path.id)
        val req = request.body
        val events = eventService.updateEvent(
            id = id,
            scope = request.queries.scope.consume(),
            eventTypeId = UUID.fromString(req.eventTypeId),
            title = req.title,
            description = req.description,
            startTime = Instant.parse(req.startTime.value),
            endTime = Instant.parse(req.endTime.value),
            location = req.location,
            references = req.references.internalize(),
        ) ?: return UpdateEvent.Response404(Unit)

        val members = attendanceService.teamMembers(teamId)
        val attendance = attendanceService.attendanceForAll(events.map { it.id }, members)
        return UpdateEvent.Response200(EventList(events = events.map { it.produce(attendance.getValue(it.id)) }))
    }

    override suspend fun deleteEvent(request: DeleteEvent.Request): DeleteEvent.Response<*> {
        authorizationService.requireAdmin(currentUserProvider.requireCurrentUserId(), currentTeamProvider.requireCurrentTeamId())
        val id = UUID.fromString(request.path.id)
        return if (eventService.deleteEvent(id, request.queries.scope.consume())) {
            DeleteEvent.Response204(Unit)
        } else {
            DeleteEvent.Response404(Unit)
        }
    }
}

// A missing scope query param defaults to THIS (ADR-0014); otherwise it maps 1:1 to the domain enum.
private fun GeneratedEventSeriesScope?.consume(): DomainEventSeriesScope = when (this) {
    null, GeneratedEventSeriesScope.THIS -> DomainEventSeriesScope.THIS
    GeneratedEventSeriesScope.THIS_AND_FOLLOWING -> DomainEventSeriesScope.THIS_AND_FOLLOWING
    GeneratedEventSeriesScope.ALL -> DomainEventSeriesScope.ALL
}

private fun com.github.zzave.teambalance.api.interfaces.generated.model.CreateEventRequest.consume() =
    PotentialEvent(
        eventTypeId = UUID.fromString(eventTypeId),
        title = title,
        description = description,
        startTime = Instant.parse(startTime.value),
        endTime = Instant.parse(endTime.value),
        location = location,
        references = references.internalize(),
    )

// The wire type carries an optional reference list; a null list is simply "no references". Each is
// funnelled through EventReference.of so the http/https-only guard and length caps apply on the way
// in (ADR-0016) — an invalid URL throws IllegalArgumentException, which the handler maps to 400.
// internal (not private) so RecurringEventController can fan the same links out to every occurrence.
internal fun List<EventReference>?.internalize(): List<DomainEventReference> =
    orEmpty().map { DomainEventReference.of(title = it.title, url = it.url) }

private fun List<DomainEventReference>.externalize(): List<EventReference> =
    map { EventReference(title = it.title, url = it.url) }

// internal (not private) so RecurringEventController can reuse it for the batch-create response.
// Takes the already-resolved projection so mapping stays free of data access (no per-event N+1).
internal fun com.github.zzave.teambalance.api.domain.model.Event.produce(attendance: EventAttendance): Event =
    Event(
        id = id.toString(),
        eventType = eventType.produce(),
        title = title,
        description = description,
        startTime = DateTimestampWithTimezone(startTime.toString()),
        endTime = DateTimestampWithTimezone(endTime.toString()),
        location = location,
        references = references.externalize(),
        recurringGroup = recurringGroup?.toString(),
        attendanceSummary = attendance.summary().produce(attendance.attendingRoleBreakdown()),
    )

private fun MemberAttendance.produce() = AttendanceEntry(
    // A responded member keys off their real row; a not-responded member falls back to their user id.
    id = (responseId ?: member.userId).toString(),
    userId = member.userId.toString(),
    displayName = member.displayName,
    role = member.position ?: UNASSIGNED,
    state = state.produce(),
)

private fun com.github.zzave.teambalance.api.domain.model.EventType.produce() =
    EventTypeSummary(id = id.toString(), name = name, color = color)

private fun Map<DomainAttendanceState, Int>.produce(roleBreakdown: List<Pair<String, Int>>) =
    AttendanceSummary(
        attending = (this[DomainAttendanceState.ATTENDING] ?: 0).toLong(),
        maybe = (this[DomainAttendanceState.MAYBE] ?: 0).toLong(),
        absent = (this[DomainAttendanceState.ABSENT] ?: 0).toLong(),
        notResponded = (this[DomainAttendanceState.NOT_RESPONDED] ?: 0).toLong(),
        roleBreakdown = roleBreakdown.map { (role, count) -> RoleCount(role = role, attending = count.toLong()) },
    )

private fun DomainAttendanceState.produce() = AttendanceState.valueOf(name)
