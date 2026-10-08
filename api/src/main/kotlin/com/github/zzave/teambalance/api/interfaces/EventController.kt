package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendedEvent
import com.github.zzave.teambalance.api.application.EventQueries
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.application.PotentialEvent
import com.github.zzave.teambalance.api.domain.model.EventDescription
import com.github.zzave.teambalance.api.domain.model.EventReference as DomainEventReference
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventLocation
import com.github.zzave.teambalance.api.domain.model.EventSeriesScope as DomainEventSeriesScope
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.RosterFill
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.RequestScopeGateway
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
    private val eventQueries: EventQueries,
    private val requestScope: RequestScopeGateway,
) : ListEvents.Handler,
    CreateEvent.Handler,
    GetEvent.Handler,
    UpdateEvent.Handler,
    DeleteEvent.Handler {

    override suspend fun listEvents(request: ListEvents.Request): ListEvents.Response<*> {
        val scope = requestScope.teamScope()
        val events =
            if (request.queries.includepast) eventService.getAllEvents(scope) else eventService.getUpcomingEvents()
        return ListEvents.Response200(
            EventList(events = eventQueries.attended(scope, events).map { it.produce(scope.userId) })
        )
    }

    override suspend fun createEvent(request: CreateEvent.Request): CreateEvent.Response<*> {
        val scope = requestScope.teamScope()
        val event = eventService.createEvent(scope = scope, potential = request.body.consume())
        return CreateEvent.Response201(eventQueries.attended(scope, event).produce(scope.userId))
    }

    override suspend fun getEvent(request: GetEvent.Request): GetEvent.Response<*> {
        val id = request.path.id.consumeEventId()
        val event = eventService.getEvent(id)
            ?: return GetEvent.Response404(Unit)

        val scope = requestScope.teamScope()
        return GetEvent.Response200(eventQueries.attended(scope, event).produce(scope.userId).toDetail())
    }

    // Scoped edit (ADR-0014, Phase 3): a bulk scope touches many rows, so the success type is an
    // EventList of the affected occurrences. The scope query param defaults to THIS when absent.
    override suspend fun updateEvent(request: UpdateEvent.Request): UpdateEvent.Response<*> {
        val scope = requestScope.teamScope()
        val id = request.path.id.consumeEventId()
        val req = request.body
        val events = eventService.updateEvent(
            scope = scope,
            id = id,
            seriesScope = request.queries.scope.consume(),
            eventTypeId = req.eventTypeId.consumeEventTypeId(),
            title = req.title.consumeEventTitle(),
            description = req.description?.let(::EventDescription),
            startTime = Instant.parse(req.startTime.value),
            endTime = Instant.parse(req.endTime.value),
            location = req.location?.let(::EventLocation),
            references = req.references.internalize(),
            rosterOverride = req.rosterOverride?.consume(),
        ) ?: return UpdateEvent.Response404(Unit)

        return UpdateEvent.Response200(
            EventList(events = eventQueries.attended(scope, events).map { it.produce(scope.userId) }),
        )
    }

    override suspend fun deleteEvent(request: DeleteEvent.Request): DeleteEvent.Response<*> {
        val scope = requestScope.teamScope()
        val id = request.path.id.consumeEventId()
        return if (eventService.deleteEvent(scope = scope, id = id, seriesScope = request.queries.scope.consume())) {
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
internal fun AttendedEvent.produce(viewerId: UserId): Event =
    Event(
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
        // Every current member, non-responders included — mapped from the projection already
        // resolved, so the listing gains no query (ADR-0030 §8).
        attendances = attendance.entries.map { it.produce() },
        substitutes = attendance.substitutes.map { it.produce() },
        myState = attendance.stateOf(viewerId).produce(),
        rosterOverride = event.rosterOverride?.produce(),
        // The roster the card renders: this event's EFFECTIVE requirement (its override, else its
        // type's default) joined with who is actually attending. Derived per read — never stored —
        // which keeps an inheriting event following its type's default as that default changes.
        roster = RosterFill.of(
            event.effectiveRosterRequirement,
            attendance.attendingByPositionId(),
            positions,
            attendance.attendingSubstitutes(),
        ).produce(),
    )

// Event and EventDetail carry the same fields (see events.ws); the detail stays a distinct wire type
// because the two are expected to diverge.
private fun Event.toDetail(): EventDetail =
    EventDetail(
        id = id,
        eventType = eventType,
        title = title,
        description = description,
        startTime = startTime,
        endTime = endTime,
        location = location,
        references = references,
        recurringGroup = recurringGroup,
        attendanceSummary = attendanceSummary,
        attendances = attendances,
        substitutes = substitutes,
        myState = myState,
        rosterOverride = rosterOverride,
        roster = roster,
    )

private fun com.github.zzave.teambalance.api.domain.model.EventType.produce() =
    EventTypeSummary(id = id.produce(), name = name.value, color = color?.value)
