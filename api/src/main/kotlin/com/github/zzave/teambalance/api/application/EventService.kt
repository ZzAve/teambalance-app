package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.EventOutsideSeasonException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Clock
import java.time.Duration
import java.time.Instant
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
                createdBy = createdBy,
                createdAt = clock.instant(),
            ),
        )
    }

    fun updateEvent(
        id: UUID,
        eventTypeId: UUID,
        title: String,
        description: String?,
        startTime: Instant,
        endTime: Instant,
        location: String?,
    ): Event? {
        val existing = eventRepository.findById(id) ?: return null
        val eventType = eventTypeRepository.findById(eventTypeId)
            ?: throw EventTypeNotFoundException(eventTypeId)

        // ADR-0014: validate the season only when the start is being moved. An unchanged start is
        // grandfathered, so an event already outside the window (e.g. after it was shrunk) stays editable.
        if (existing.startTime != startTime) requireWithinSeason(startTime)

        return eventRepository.save(
            existing.copy(
                eventType = eventType,
                title = title,
                description = description,
                startTime = startTime,
                endTime = endTime,
                location = location,
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
