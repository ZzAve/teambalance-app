package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.UserId

interface AttendanceRepository {
    fun findByEventId(eventId: EventId): List<Attendance>

    /** Response rows for many events in one query — lets a listing avoid a per-event fetch. */
    fun findByEventIds(eventIds: List<EventId>): List<Attendance>
    fun findByEventIdAndUserId(eventId: EventId, userId: UserId): Attendance?

    /**
     * One user's response rows across many events, in one query — the existence read behind Bulk
     * Attend's non-destructive guard (ADR-0020). Reading all of them at once is what lets the guard
     * decide "blank or not" for a whole batch without a per-event round-trip.
     */
    fun findByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<Attendance>
    fun save(attendance: Attendance): Attendance
    fun saveAll(attendances: List<Attendance>): List<Attendance>

    /**
     * Deletes one user's rows for [eventIds], returning the event ids actually deleted. Undo's
     * reciprocal of [saveAll]: naturally idempotent, since a repeat simply finds nothing to delete.
     */
    fun deleteByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<EventId>
}
