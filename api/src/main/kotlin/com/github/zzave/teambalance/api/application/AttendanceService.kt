package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Clock
import java.time.Instant
import java.util.UUID

/** Bucket label for attendees who have no position assigned. */
const val UNASSIGNED = "Unassigned"

@Service
@Transactional
class AttendanceService(
    private val attendanceRepository: AttendanceRepository,
    private val eventRepository: EventRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val clock: Clock,
) {
    fun setAttendance(eventId: UUID, userId: UUID, state: AttendanceState, changedBy: UUID): Attendance? {
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

    // The roster and summary are derived from *current team membership*, not from the attendance rows
    // that existed when the event was made. So a member who joins after an event was created shows up
    // as NOT_RESPONDED (no pre-created row needed), and a member who left the team drops out entirely —
    // even if they had a stale response row. A member's state is their response row's state, or
    // NOT_RESPONDED when they have no row.
    fun getAttendancesWithMembers(eventId: UUID, teamId: UUID): List<Pair<Attendance, TeamMember>> {
        val responseByUser = attendanceRepository.findByEventId(eventId).associateBy { it.userId }
        return teamMemberRepository.findByTeamId(teamId).map { member ->
            val response = responseByUser[member.userId]
                ?: Attendance(
                    id = member.userId,
                    eventId = eventId,
                    userId = member.userId,
                    state = AttendanceState.NOT_RESPONDED,
                    updatedAt = clock.instant(),
                    changedBy = member.userId,
                )
            response to member
        }
    }

    fun getAttendanceSummary(eventId: UUID, teamId: UUID): Map<AttendanceState, Int> {
        val responseByUser = attendanceRepository.findByEventId(eventId).associateBy { it.userId }
        val members = teamMemberRepository.findByTeamId(teamId)
        return AttendanceState.entries.associateWith { state ->
            members.count { (responseByUser[it.userId]?.state ?: AttendanceState.NOT_RESPONDED) == state }
        }
    }

    fun getAttendingRoleBreakdown(eventId: UUID, teamId: UUID): List<Pair<String, Int>> {
        val attendingUserIds = attendanceRepository.findByEventId(eventId)
            .filter { it.state == AttendanceState.ATTENDING }
            .map { it.userId }
            .toSet()
        return teamMemberRepository.findByTeamId(teamId)
            .filter { it.userId in attendingUserIds }
            .groupBy { it.position ?: UNASSIGNED }
            .map { (position, members) -> position to members.size }
            .sortedWith(compareByDescending<Pair<String, Int>> { it.second }.thenBy { it.first })
    }

    fun findMember(userId: UUID): TeamMember? =
        teamMemberRepository.findMembersByUserIds(setOf(userId)).values.firstOrNull()

    fun findDisplayName(userId: UUID): String? = teamMemberRepository.findDisplayName(userId)
}
