package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.UserId

interface AttendanceRepository {
    fun findByEventId(eventId: EventId): List<Attendance>

    /** Response rows for many events in one query — lets a listing avoid a per-event fetch. */
    fun findByEventIds(eventIds: List<EventId>): List<Attendance>
    fun findByEventIdAndUserId(eventId: EventId, userId: UserId): Attendance?
    fun save(attendance: Attendance): Attendance
    fun saveAll(attendances: List<Attendance>): List<Attendance>
}
