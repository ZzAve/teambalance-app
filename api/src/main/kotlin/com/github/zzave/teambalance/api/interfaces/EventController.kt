package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.application.PositionService
import com.github.zzave.teambalance.api.application.PotentialEvent
import com.github.zzave.teambalance.api.domain.model.EventAttendance
import com.github.zzave.teambalance.api.domain.model.EventDescription
import com.github.zzave.teambalance.api.domain.model.EventReference as DomainEventReference
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventLocation
import com.github.zzave.teambalance.api.domain.model.EventSeriesScope as DomainEventSeriesScope
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.RosterFill
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.model.EventSeriesScope as GeneratedEventSeriesScope
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateEvent
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DeleteEvent
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetEvent
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListEvents
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdateEvent
import com.github.zzave.teambalance.api.interfaces.generated.model.DateTimestampWithTimezone
import com.github.zzave.teambalance.api.interfaces.generated.model.Event
import com.github.zzave.teambalance.api.interfaces.generated.model.EventDetail
import com.github.zzave.teambalance.api.interfaces.generated.model.EventList
import com.github.zzave.teambalance.api.interfaces.generated.model.EventTypeSummary
import com.github.zzave.teambalance.api.interfaces.generated.model.EventReference
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
class EventController(
    private val eventService: EventService,
    private val attendanceService: AttendanceService,
    private val positionService: PositionService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : ListEvents.Handler,
    CreateEvent.Handler,
    GetEvent.Handler,
    UpdateEvent.Handler,
    DeleteEvent.Handler {

    override suspend fun listEvents(request: ListEvents.Request): ListEvents.Response<*> {
        val members = attendanceService.teamMembers(currentTeamGateway.requireCurrentTeamId())
        val viewerId = currentUserGateway.requireCurrentUserId()
        val events = if (request.queries.includepast) eventService.getAllEvents() else eventService.getUpcomingEvents()
        val attendance = attendanceService.attendanceForAll(events.map { it.id }, members)
        // The position vocabulary is fetched once for the whole listing, not per event: it is the
        // same list for every row, and it is both the label source and the row filter for the roster.
        val positions = positionService.listPositions()
        return ListEvents.Response200(
            EventList(events = events.map { it.produce(attendance.getValue(it.id), viewerId, positions) })
        )
    }

    override suspend fun createEvent(request: CreateEvent.Request): CreateEvent.Response<*> {
        val teamId = currentTeamGateway.requireCurrentTeamId()
        val userId = currentUserGateway.requireCurrentUserId()
        val event = eventService.createEvent(
            callerId = userId,
            teamId = teamId,
            potential = request.body.consume(),
        )
        return CreateEvent.Response201(
            event.produce(
                attendanceService.attendanceFor(event.id, attendanceService.teamMembers(teamId)),
                userId,
                positionService.listPositions(),
            ),
        )
    }

    override suspend fun getEvent(request: GetEvent.Request): GetEvent.Response<*> {
        val id = request.path.id.consumeEventId()
        val event = eventService.getEvent(id)
            ?: return GetEvent.Response404(Unit)

        val teamId = currentTeamGateway.requireCurrentTeamId()
        val members = attendanceService.teamMembers(teamId)
        val attendance = attendanceService.attendanceFor(id, members)
        val viewerId = currentUserGateway.requireCurrentUserId()

        return GetEvent.Response200(
            EventDetail(
                id = event.id.produce(),
                eventType = event.eventType.produce(),
                title = event.title.produce(),
                description = event.description?.value,
                startTime = DateTimestampWithTimezone(event.startTime.toString()),
                endTime = DateTimestampWithTimezone(event.endTime.toString()),
                location = event.location?.value,
                references = event.references.externalize(),
                recurringGroup = event.recurringGroup?.toString(),
                attendanceSummary = attendance.summary().produce(attendance.attendingRoleBreakdown()),
                attendances = attendance.entries.map { it.produce() },
                myState = attendance.stateOf(viewerId).produce(),
                rosterOverride = event.rosterOverride?.produce(),
                roster = event.rosterFill(attendance, positionService.listPositions()).produce(),
            )
        )
    }

    // Scoped edit (ADR-0014, Phase 3): a bulk scope touches many rows, so the success type is an
    // EventList of the affected occurrences. The scope query param defaults to THIS when absent.
    override suspend fun updateEvent(request: UpdateEvent.Request): UpdateEvent.Response<*> {
        val teamId = currentTeamGateway.requireCurrentTeamId()
        val userId = currentUserGateway.requireCurrentUserId()
        val id = request.path.id.consumeEventId()
        val req = request.body
        val events = eventService.updateEvent(
            callerId = userId,
            teamId = teamId,
            id = id,
            scope = request.queries.scope.consume(),
            eventTypeId = req.eventTypeId.consumeEventTypeId(),
            title = req.title.consumeEventTitle(),
            description = req.description?.let(::EventDescription),
            startTime = Instant.parse(req.startTime.value),
            endTime = Instant.parse(req.endTime.value),
            location = req.location?.let(::EventLocation),
            references = req.references.internalize(),
            rosterOverride = req.rosterOverride?.consume(),
        ) ?: return UpdateEvent.Response404(Unit)

        val members = attendanceService.teamMembers(teamId)
        val attendance = attendanceService.attendanceForAll(events.map { it.id }, members)
        val positions = positionService.listPositions()
        return UpdateEvent.Response200(
            EventList(events = events.map { it.produce(attendance.getValue(it.id), userId, positions) }),
        )
    }

    override suspend fun deleteEvent(request: DeleteEvent.Request): DeleteEvent.Response<*> {
        val teamId = currentTeamGateway.requireCurrentTeamId()
        val userId = currentUserGateway.requireCurrentUserId()
        val id = request.path.id.consumeEventId()
        return if (eventService.deleteEvent(callerId = userId, teamId = teamId, id = id, scope = request.queries.scope.consume())) {
            DeleteEvent.Response204(Unit)
        } else {
            DeleteEvent.Response404(Unit)
        }
    }
}

// The Wirespec edge for an event's identity. The contract carries an opaque UUID string and is
// unchanged by EventId (ADR-0018) — these two functions are the only place in the inbound adapter
// that wraps or unwraps it, so nothing between here and the JPA edge handles a bare UUID.
// internal so AttendanceController and RecurringEventController convert the same way.
internal fun String.consumeEventId(): EventId = EventId(UUID.fromString(this))

internal fun EventId.produce(): String = value.toString()

// The Wirespec edge for an event's title. The contract carries a plain string and is unchanged by
// EventTitle — these two functions are the only place in the inbound adapter that wraps or unwraps
// it. internal so RecurringEventController converts the same way.
internal fun String.consumeEventTitle(): EventTitle = EventTitle(this)

internal fun EventTitle.produce(): String = value

// EventDescription and EventLocation get no such pair on purpose. Each conversion is a bare
// constructor reference with nothing to centralise (`?.let(::EventDescription)` in, `?.value` out —
// the same way the JPA mapper inlines them), and this file holds 10 top-level functions against
// detekt's stock TooManyFunctions ceiling of 11, so one symmetric pair would push it to 12 (and the
// two pairs both optional free-text fields would want, to 14) for a suppression they do not earn.

// A missing scope query param defaults to THIS (ADR-0014); otherwise it maps 1:1 to the domain enum.
private fun GeneratedEventSeriesScope?.consume(): DomainEventSeriesScope = when (this) {
    null, GeneratedEventSeriesScope.THIS -> DomainEventSeriesScope.THIS
    GeneratedEventSeriesScope.THIS_AND_FOLLOWING -> DomainEventSeriesScope.THIS_AND_FOLLOWING
    GeneratedEventSeriesScope.ALL -> DomainEventSeriesScope.ALL
}

private fun com.github.zzave.teambalance.api.interfaces.generated.model.CreateEventRequest.consume() =
    PotentialEvent(
        eventTypeId = eventTypeId.consumeEventTypeId(),
        title = title.consumeEventTitle(),
        description = description?.let(::EventDescription),
        startTime = Instant.parse(startTime.value),
        endTime = Instant.parse(endTime.value),
        location = location?.let(::EventLocation),
        references = references.internalize(),
        rosterOverride = rosterOverride?.consume(),
    )

// The wire type carries an optional reference list; a null list is simply "no references". Each is
// funnelled through EventReference.of so the http/https-only guard and length caps apply on the way
// in (ADR-0016) — an invalid URL throws IllegalArgumentException, which the handler maps to 400.
// internal (not private) so RecurringEventController can fan the same links out to every occurrence.
internal fun List<EventReference>?.internalize(): List<DomainEventReference> =
    orEmpty().map { DomainEventReference.of(title = it.title, url = it.url) }

private fun List<DomainEventReference>.externalize(): List<EventReference> =
    map { EventReference(title = it.title?.value, url = it.url.value) }

// internal (not private) so RecurringEventController can reuse it for the batch-create response.
// Takes the already-resolved projection so mapping stays free of data access (no per-event N+1).
internal fun com.github.zzave.teambalance.api.domain.model.Event.produce(
    attendance: EventAttendance,
    viewerId: UserId,
    positions: List<Position>,
): Event =
    Event(
        id = id.produce(),
        eventType = eventType.produce(),
        title = title.produce(),
        description = description?.value,
        startTime = DateTimestampWithTimezone(startTime.toString()),
        endTime = DateTimestampWithTimezone(endTime.toString()),
        location = location?.value,
        references = references.externalize(),
        recurringGroup = recurringGroup?.toString(),
        attendanceSummary = attendance.summary().produce(attendance.attendingRoleBreakdown()),
        myState = attendance.stateOf(viewerId).produce(),
        rosterOverride = rosterOverride?.produce(),
        roster = rosterFill(attendance, positions).produce(),
    )

// The roster the card renders: this event's EFFECTIVE requirement (its override, else its type's
// default) joined with who is actually attending. Derived per read — never stored — which is what
// keeps an inheriting event following its type's default as that default changes.
internal fun com.github.zzave.teambalance.api.domain.model.Event.rosterFill(
    attendance: EventAttendance,
    positions: List<Position>,
): RosterFill = RosterFill.of(effectiveRosterRequirement, attendance.attendingByPositionId(), positions)

private fun com.github.zzave.teambalance.api.domain.model.EventType.produce() =
    EventTypeSummary(id = id.produce(), name = name.value, color = color?.value)
