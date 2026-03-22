package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
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
    private val clock: Clock,
) {
    companion object {
        val GRACE_PERIOD: Duration = Duration.ofHours(6)
    }

    fun getUpcomingEvents(): List<Event> {
        val since = Instant.now(clock).minus(GRACE_PERIOD)
        return eventRepository.findUpcoming(since)
    }

    fun getAllEvents(): List<Event> =
        eventRepository.findAll()

    fun getEvent(id: UUID): Event? =
        eventRepository.findById(id)

    fun createEvent(potential: PotentialEvent, createdBy: UUID, teamId: UUID): Event {
        val eventType = eventTypeRepository.findById(potential.eventTypeId)
            ?: throw IllegalArgumentException("EventType not found: ${potential.eventTypeId}")

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
                createdAt = Instant.now(clock),
            ),
        )

        val members = teamMemberRepository.findByTeamId(teamId)
        val attendances = members.map { member ->
            Attendance(
                id = UUID.randomUUID(),
                eventId = event.id,
                userId = member.userId,
                state = AttendanceState.NOT_RESPONDED,
                updatedAt = Instant.now(clock),
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
        endTime: Instant?,
        location: String?,
    ): Event? {
        val existing = eventRepository.findById(id) ?: return null
        val eventType = eventTypeRepository.findById(eventTypeId)
            ?: throw IllegalArgumentException("EventType not found: $eventTypeId")

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
}
