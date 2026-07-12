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
                existing.copy(state = state, updatedAt = Instant.now(clock), changedBy = changedBy),
            )
        } else {
            attendanceRepository.save(
                Attendance(
                    id = UUID.randomUUID(),
                    eventId = eventId,
                    userId = userId,
                    state = state,
                    updatedAt = Instant.now(clock),
                    changedBy = changedBy,
                ),
            )
        }
    }

    fun getAttendancesWithMembers(eventId: UUID): List<Pair<Attendance, TeamMember>> {
        val attendances = attendanceRepository.findByEventId(eventId)
        if (attendances.isEmpty()) return emptyList()
        val membersByUserId = teamMemberRepository.findMembersByUserIds(attendances.map { it.userId }.toSet())
        return attendances.map { attendance ->
            val member = membersByUserId[attendance.userId]
                ?: TeamMember(attendance.userId, "Unknown", "USER", null)
            attendance to member
        }
    }

    fun getAttendanceSummary(eventId: UUID): Map<AttendanceState, Int> {
        val attendances = attendanceRepository.findByEventId(eventId)
        return AttendanceState.entries.associateWith { state ->
            attendances.count { it.state == state }
        }
    }

    fun getAttendingRoleBreakdown(eventId: UUID): List<Pair<String, Int>> {
        val attendances = attendanceRepository.findByEventId(eventId)
        val attendingUserIds = attendances
            .filter { it.state == AttendanceState.ATTENDING }
            .map { it.userId }
            .toSet()
        if (attendingUserIds.isEmpty()) return emptyList()
        val membersByUserId = teamMemberRepository.findMembersByUserIds(attendingUserIds)
        return attendingUserIds
            .groupBy { uid -> membersByUserId[uid]?.teamRole ?: "" }
            .entries
            .map { (role, uids) -> role to uids.size }
            .sortedWith(compareByDescending<Pair<String, Int>> { it.second }.thenBy { it.first })
    }

    fun findMember(userId: UUID): TeamMember? =
        teamMemberRepository.findMembersByUserIds(setOf(userId)).values.firstOrNull()

    fun findDisplayName(userId: UUID): String? = teamMemberRepository.findDisplayName(userId)
}
