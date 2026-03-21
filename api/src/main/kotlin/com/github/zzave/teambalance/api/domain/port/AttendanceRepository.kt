package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Attendance
import java.util.UUID

interface AttendanceRepository {
    fun findByEventId(eventId: UUID): List<Attendance>
    fun findByEventIdAndUserId(eventId: UUID, userId: UUID): Attendance?
    fun save(attendance: Attendance): Attendance
    fun saveAll(attendances: List<Attendance>): List<Attendance>
}
