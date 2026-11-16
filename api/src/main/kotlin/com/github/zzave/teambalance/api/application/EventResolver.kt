package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventAttendance
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.RosterFill
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository

/** An Event with its **Event Attendance** and its **Event Roster**, resolved from the same reads. */
data class ResolvedEvent(
    val event: Event,
    val attendance: EventAttendance,
    val roster: RosterFill,
)

/**
 * Resolves Events into [ResolvedEvent]s: joins the team's current members, the Events' response rows,
 * their Substitutes and the team's positions, and hands them to [EventAttendance] and [RosterFill],
 * which own the rules.
 *
 * The members and the positions are fetched once per call, and the response rows and Substitutes of
 * a list of Events are fetched in one query each, so a list of Events is resolved in a fixed number of
 * queries, however long it is.
 */
class EventResolver(
    private val attendanceRepository: AttendanceRepository,
    private val substituteRepository: SubstituteRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val positionRepository: PositionRepository,
) {
    fun resolve(teamId: TeamId, event: Event): ResolvedEvent {
        val members = teamMemberRepository.findByTeamId(teamId)
        val attendance = EventAttendance.resolve(
            members,
            attendanceRepository.findByEventId(event.id),
            substituteRepository.findAttendanceByEventIds(listOf(event.id))[event.id].orEmpty(),
        )
        return resolved(event, attendance, positionRepository.list())
    }

    fun resolveAll(teamId: TeamId, events: List<Event>): List<ResolvedEvent> {
        val members = teamMemberRepository.findByTeamId(teamId)
        val eventIds = events.map { it.id }
        val responsesByEvent = attendanceRepository.findByEventIds(eventIds).groupBy { it.eventId }
        val substitutesByEvent = substituteRepository.findAttendanceByEventIds(eventIds)
        val positions = positionRepository.list()
        return events.map { event ->
            val attendance = EventAttendance.resolve(
                members,
                responsesByEvent[event.id].orEmpty(),
                substitutesByEvent[event.id].orEmpty(),
            )
            resolved(event, attendance, positions)
        }
    }

    // The Event Roster is the Event's effective requirement (its override, else its type's default)
    // joined with who is attending. Derived per read, never stored, so an inheriting Event follows
    // its type's default as that default changes.
    private fun resolved(event: Event, attendance: EventAttendance, positions: List<Position>) =
        ResolvedEvent(
            event = event,
            attendance = attendance,
            roster = RosterFill.of(
                event.effectiveRosterRequirement,
                attendance.attendingByPositionId(),
                positions,
                attendance.attendingSubstitutes(),
            ),
        )
}
