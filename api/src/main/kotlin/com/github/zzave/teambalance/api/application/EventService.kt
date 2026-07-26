package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.EventOutsideSeasonException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
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
    private val attendanceRepository: AttendanceRepository,
    private val teamMemberRepository: TeamMemberRepository,
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

    fun createEvent(potential: PotentialEvent, createdBy: UUID, teamId: UUID): Event {
        val eventType = eventTypeRepository.findById(potential.eventTypeId)
            ?: throw EventTypeNotFoundException(potential.eventTypeId)

        // ADR-0014: a created event's start must always fall within the configured season.
        requireWithinSeason(potential.startTime)

        val event = eventRepository.save(
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

        val members = teamMemberRepository.findByTeamId(teamId)
        val attendances = members.map { member ->
            Attendance(
                id = UUID.randomUUID(),
                eventId = event.id,
                userId = member.userId,
                state = AttendanceState.NOT_RESPONDED,
                updatedAt = clock.instant(),
                changedBy = createdBy,
            )
        }
        attendanceRepository.saveAll(attendances)

        return event
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
