package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
@Transactional
class AttendanceService(
    private val attendanceRepository: AttendanceRepository,
    private val eventRepository: EventRepository,
    private val teamMemberRepository: TeamMemberRepository,
) {
    fun setAttendance(eventId: UUID, userId: UUID, state: AttendanceState): Attendance? {
        if (eventRepository.findById(eventId) == null) return null

        val existing = attendanceRepository.findByEventIdAndUserId(eventId, userId)
        return if (existing != null) {
            attendanceRepository.save(existing.copy(state = state, updatedAt = Instant.now()))
        } else {
            attendanceRepository.save(
                Attendance(
                    id = UUID.randomUUID(),
                    eventId = eventId,
                    userId = userId,
                    state = state,
                    updatedAt = Instant.now(),
                ),
            )
        }
    }

    fun getAttendancesWithNames(eventId: UUID): List<Pair<Attendance, String>> =
        attendanceRepository.findByEventId(eventId).map { attendance ->
            val name = teamMemberRepository.findDisplayName(attendance.userId) ?: "Unknown"
            attendance to name
        }

    fun getAttendanceSummary(eventId: UUID): Map<AttendanceState, Int> {
        val attendances = attendanceRepository.findByEventId(eventId)
        return AttendanceState.entries.associateWith { state ->
            attendances.count { it.state == state }
        }
    }
}
