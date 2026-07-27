package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.EmptyRecurrenceException
import com.github.zzave.teambalance.api.domain.exception.EventOutsideSeasonException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.exception.RecurrenceExceedsCapException
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventReference
import com.github.zzave.teambalance.api.domain.model.OccurrenceSchedule
import com.github.zzave.teambalance.api.domain.model.Recurrence
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
        requireWithinSeason(potential.startTime)

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
        requireAllWithinSeason(dates)

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

    // Rejects the whole batch up front if any generated start falls outside the configured season,
    // so no row is written when even one occurrence is out of window.
    private fun requireAllWithinSeason(dates: List<LocalDate>) {
        val season = seasonRepository.get()
        dates.firstOrNull { !season.allows(it) }?.let { throw EventOutsideSeasonException(it) }
    }

    fun updateEvent(
        id: UUID,
        eventTypeId: UUID,
        title: String,
        description: String?,
        startTime: Instant,
        endTime: Instant,
        location: String?,
        references: List<EventReference> = emptyList(),
    ): Event? {
        val existing = eventRepository.findById(id) ?: return null
        val eventType = eventTypeRepository.findById(eventTypeId)
            ?: throw EventTypeNotFoundException(eventTypeId)

        // ADR-0014: validate the season only when the start is being moved. An unchanged start is
        // grandfathered, so an event already outside the window (e.g. after it was shrunk) stays editable.
        if (existing.startTime != startTime) requireWithinSeason(startTime)

        // Replace-semantics (ADR-0016): the incoming list is the new full set of references.
        return eventRepository.save(
            existing.copy(
                eventType = eventType,
                title = title,
                description = description,
                startTime = startTime,
                endTime = endTime,
                location = location,
                references = references,
            ),
        )
    }

    fun deleteEvent(id: UUID): Boolean {
        if (eventRepository.findById(id) == null) return false
        eventRepository.deleteById(id)
        return true
    }

    // Rejects a start that falls outside the configured season. The instant is resolved to a calendar
    // date in the team's civil zone (the clock's zone) so the comparison matches how humans read the
    // date. An unconfigured season (both bounds null) allows everything.
    private fun requireWithinSeason(startTime: Instant) {
        val startDate = startTime.atZone(clock.zone).toLocalDate()
        if (!seasonRepository.get().allows(startDate)) throw EventOutsideSeasonException(startDate)
    }
}
