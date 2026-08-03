package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.EventAttendance
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import java.time.Clock
import java.util.UUID

class AttendanceService(
    private val attendanceRepository: AttendanceRepository,
    private val eventRepository: EventRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val authorizationService: AuthorizationService,
    private val clock: Clock,
) {
    /**
     * Records [userId]'s attendance for [eventId], attributed to [changedBy] (the authenticated
     * caller). Editing is trust-based within a team (ADR-0003), so the gate is membership, not
     * admin: the target [userId] must be an active member of [teamId] — the caller's server-resolved
     * tenant. This closes the write path that previously trusted only schema routing and never
     * checked the path [userId] against the caller's team. Returns null when the event is unknown.
     */
    fun setAttendance(
        teamId: UUID,
        eventId: EventId,
        userId: UUID,
        state: AttendanceState,
        changedBy: UUID,
    ): Attendance? {
        authorizationService.requireMember(userId, teamId)
        if (eventRepository.findById(eventId) == null) return null

        val existing = attendanceRepository.findByEventIdAndUserId(eventId, userId)
        return if (existing != null) {
            attendanceRepository.save(
                existing.copy(state = state, updatedAt = clock.instant(), changedBy = changedBy),
            )
        } else {
            attendanceRepository.save(
                Attendance(
                    id = UUID.randomUUID(),
                    eventId = eventId,
                    userId = userId,
                    state = state,
                    updatedAt = clock.instant(),
                    changedBy = changedBy,
                ),
            )
        }
    }

    /** Current active roster of a team — fetch once per request and pass into the projections below. */
    fun teamMembers(teamId: UUID): List<TeamMember> = teamMemberRepository.findByTeamId(teamId)

    // The attendance picture is derived from *current team membership*, not from the rows that existed
    // when the event was made: a member who joined later shows as NOT_RESPONDED (no seeded row needed)
    // and a member who left drops out even with a stale row (#103, #114). EventAttendance concentrates
    // that rule; `members` is passed in so a listing resolves the roster once.

    /** The resolved attendance picture for one event — its response rows fetched once. */
    fun attendanceFor(eventId: EventId, members: List<TeamMember>): EventAttendance =
        EventAttendance.resolve(members, attendanceRepository.findByEventId(eventId))

    /**
     * The resolved picture for many events, keyed by event id, from a single response-row query —
     * kills the per-event N+1 when producing a listing.
     */
    fun attendanceForAll(eventIds: List<EventId>, members: List<TeamMember>): Map<EventId, EventAttendance> {
        val responsesByEvent = attendanceRepository.findByEventIds(eventIds).groupBy { it.eventId }
        return eventIds.associateWith { EventAttendance.resolve(members, responsesByEvent[it] ?: emptyList()) }
    }

    fun findMember(userId: UUID): TeamMember? =
        teamMemberRepository.findMembersByUserIds(setOf(userId)).values.firstOrNull()

    fun findDisplayName(userId: UUID): String? = teamMemberRepository.findDisplayName(userId)
}
