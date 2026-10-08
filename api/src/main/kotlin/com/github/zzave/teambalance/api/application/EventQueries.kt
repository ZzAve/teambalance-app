package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventAttendance
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository

/**
 * An [event] with what its read model needs: who is attending ([attendance]) and the team's
 * [positions], which label and filter its Event Roster.
 */
data class AttendedEvent(
    val event: Event,
    val attendance: EventAttendance,
    val positions: List<Position>,
)

/**
 * The read side of events: joins events with their attendance and the position vocabulary.
 *
 * Attendance is derived from *current team membership*, not from the rows that existed when the event
 * was made: a member who joined later shows as NOT_RESPONDED (no seeded row needed) and a member who
 * left drops out even with a stale row (#103, #114). [EventAttendance] concentrates that rule.
 *
 * A call reads the Roster, the response rows, the Substitutes and the positions once each, however
 * many events it is given, so a listing does not fan out into a per-event N+1.
 */
class EventQueries(
    private val attendanceRepository: AttendanceRepository,
    private val substituteRepository: SubstituteRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val positionRepository: PositionRepository,
) {
    fun attended(scope: TeamScope, events: List<Event>): List<AttendedEvent> {
        val ids = events.map { it.id }
        val members = teamMemberRepository.findByTeamId(scope.teamId)
        val responsesByEvent = attendanceRepository.findByEventIds(ids).groupBy { it.eventId }
        val substitutesByEvent = substituteRepository.findAttendanceByEventIds(ids)
        val positions = positionRepository.list()
        return events.map {
            AttendedEvent(
                event = it,
                attendance = EventAttendance.resolve(
                    members,
                    responsesByEvent[it.id].orEmpty(),
                    substitutesByEvent[it.id].orEmpty(),
                ),
                positions = positions,
            )
        }
    }

    fun attended(scope: TeamScope, event: Event): AttendedEvent = attended(scope, listOf(event)).single()
}
