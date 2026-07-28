package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.EmptyRecurrenceException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.exception.RecurrenceExceedsCapException
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventEdit
import com.github.zzave.teambalance.api.domain.model.EventReference
import com.github.zzave.teambalance.api.domain.model.EventSeriesScope
import com.github.zzave.teambalance.api.domain.model.OccurrenceSchedule
import com.github.zzave.teambalance.api.domain.model.Recurrence
import com.github.zzave.teambalance.api.domain.model.SeasonPolicy
import com.github.zzave.teambalance.api.domain.model.SeriesModification
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.util.UUID

@Service
@Transactional
class EventService(
    private val eventRepository: EventRepository,
    private val eventTypeRepository: EventTypeRepository,
    private val seasonRepository: SeasonRepository,
    private val clock: Clock,
) {
    companion object {
        val GRACE_PERIOD: Duration = Duration.ofHours(6)

        // A single occurrence can't run longer than a day — guards against a bogus/huge duration.
        const val MAX_DURATION_MINUTES: Long = 24 * 60
    }

    fun getUpcomingEvents(): List<Event> {
        val since = clock.instant().minus(GRACE_PERIOD)
        return eventRepository.findUpcoming(since)
    }

    fun getAllEvents(): List<Event> =
        eventRepository.findAll()

    fun getEvent(id: UUID): Event? =
        eventRepository.findById(id)

    // No attendance rows are seeded here: the summary and roster are derived from current team
    // membership at read time (see AttendanceService), so a member's absence of a row simply reads
    // as NOT_RESPONDED. A response then upserts their row (AttendanceService.setAttendance).
    fun createEvent(potential: PotentialEvent, createdBy: UUID): Event {
        val eventType = eventTypeRepository.findById(potential.eventTypeId)
            ?: throw EventTypeNotFoundException(potential.eventTypeId)

        // ADR-0014: a created event's start must always fall within the configured season.
        seasonPolicy().requireCreatable(potential.startTime)

        return eventRepository.save(
            Event(
                id = UUID.randomUUID(),
                eventType = eventType,
                title = potential.title,
                description = potential.description,
                startTime = potential.startTime,
                endTime = potential.endTime,
                location = potential.location,
                references = potential.references,
                recurringGroup = potential.recurringGroup,
                createdBy = createdBy,
                createdAt = clock.instant(),
            ),
        )
    }

    /**
     * Materializes a recurring series (ADR-0014): one call generates N concrete [Event] rows sharing
     * a freshly-minted `recurringGroup`, each an ordinary, independently-editable event. As with a
     * single create, no attendance rows are seeded — the per-member NOT_RESPONDED roster is derived
     * from current team membership at read time (see AttendanceService).
     *
     * Each occurrence's start is resolved from its calendar date + [timeOfDay] in the team's civil
     * zone (the clock's zone), so a training keeps its wall-clock time across a DST change; the end
     * is that start plus [durationMinutes]. Every generated start must fall within the configured
     * season, and the batch is capped at [Recurrence.MAX_OCCURRENCES].
     *
     * Runs in a single transaction (the whole batch commits or nothing does).
     */
    fun createRecurringEvents(
        eventTypeId: UUID,
        title: String,
        description: String?,
        location: String?,
        timeOfDay: LocalTime,
        durationMinutes: Long,
        references: List<EventReference>,
        recurrence: Recurrence,
        createdBy: UUID,
    ): RecurringEventSeries {
        require(durationMinutes in 1..MAX_DURATION_MINUTES) {
            "durationMinutes must be between 1 and $MAX_DURATION_MINUTES"
        }
        val eventType = eventTypeRepository.findById(eventTypeId)
            ?: throw EventTypeNotFoundException(eventTypeId)

        val dates = generateBoundedDates(recurrence)
        seasonPolicy().requireAllCreatable(dates)

        val recurringGroup = UUID.randomUUID()

        val events = dates.map { date ->
            val startTime = OccurrenceSchedule.startInstant(date, timeOfDay, clock.zone)
            eventRepository.save(
                Event(
                    id = UUID.randomUUID(),
                    eventType = eventType,
                    title = title,
                    description = description,
                    startTime = startTime,
                    endTime = OccurrenceSchedule.endInstant(startTime, durationMinutes),
                    location = location,
                    references = references,
                    recurringGroup = recurringGroup,
                    createdBy = createdBy,
                    createdAt = clock.instant(),
                ),
            )
        }

        return RecurringEventSeries(recurringGroup = recurringGroup, events = events)
    }

    // The generated occurrence dates, guarded against an empty result and the batch cap.
    private fun generateBoundedDates(recurrence: Recurrence): List<LocalDate> {
        val dates = recurrence.occurrences()
        if (dates.isEmpty()) throw EmptyRecurrenceException()
        if (dates.size > Recurrence.MAX_OCCURRENCES) {
            throw RecurrenceExceedsCapException(Recurrence.MAX_OCCURRENCES)
        }
        return dates
    }

    /**
     * Applies a scoped edit over a recurring series (ADR-0014, Decision 4). A group-less event is a
     * one-occurrence series, so any scope simply edits that row; otherwise the whole group is loaded
     * and [SeriesModification] computes the split/reassignment matrix (detach + new-group-after for
     * THIS, before-kept + new-group-for-tail for FOLLOWING, whole-group for ALL). Bulk scopes
     * propagate every field except each occurrence's own calendar date.
     *
     * Season validation still fires, and grandfathers unchanged starts: only occurrences whose start
     * actually moves are checked, so an occurrence already outside a shrunk window stays editable
     * (e.g. an ALL edit that changes only the title touches no start and is never rejected).
     *
     * Returns the affected ("edited") occurrences ordered by start, or null when [id] is unknown.
     * Runs in one transaction — the whole reassignment commits or nothing does.
     */
    fun updateEvent(
        id: UUID,
        scope: EventSeriesScope,
        eventTypeId: UUID,
        title: String,
        description: String?,
        startTime: Instant,
        endTime: Instant,
        location: String?,
        references: List<EventReference> = emptyList(),
    ): List<Event>? {
        val target = eventRepository.findById(id) ?: return null
        val eventType = eventTypeRepository.findById(eventTypeId)
            ?: throw EventTypeNotFoundException(eventTypeId)

        val series = seriesOf(target)
        // Replace-semantics (ADR-0016): the incoming list is the new full set of references.
        val plan = SeriesModification.planEdit(
            series = series,
            targetId = id,
            scope = scope,
            edit = EventEdit(
                eventType = eventType,
                title = title,
                description = description,
                location = location,
                references = references,
                startTime = startTime,
                endTime = endTime,
            ),
            newTailGroup = UUID.randomUUID(),
            zone = clock.zone,
        )

        val originalStarts = series.associate { it.id to it.startTime }
        seasonPolicy().requireEditable(plan, originalStarts)

        plan.toPersist.forEach { eventRepository.save(it) }
        return plan.edited.sortedBy { it.startTime }
    }

    /**
     * Deletes the occurrences in [scope] over the target's series (ADR-0014, Decision 4). A delete
     * **never splits** — survivors keep their group untouched. Returns false when [id] is unknown.
     * Runs in one transaction.
     */
    fun deleteEvent(id: UUID, scope: EventSeriesScope): Boolean {
        val target = eventRepository.findById(id) ?: return false
        val toDelete = SeriesModification.planDelete(seriesOf(target), id, scope)
        toDelete.forEach { eventRepository.deleteById(it) }
        return true
    }

    // A group-less event is a one-occurrence series (its own row); otherwise the whole group,
    // start-time ordered — the "before/after" axis every scoped operation splits on.
    private fun seriesOf(event: Event): List<Event> =
        event.recurringGroup?.let { eventRepository.findByRecurringGroup(it) } ?: listOf(event)

    // The season rule for the current tenant, resolved for this write: which starts must fall within
    // the window (and the grandfathering of unchanged ones) is SeasonPolicy's job — Season.allows is
    // the predicate underneath, resolved against the team's civil zone (the clock's zone).
    private fun seasonPolicy(): SeasonPolicy = SeasonPolicy(seasonRepository.get(), clock.zone)
}
