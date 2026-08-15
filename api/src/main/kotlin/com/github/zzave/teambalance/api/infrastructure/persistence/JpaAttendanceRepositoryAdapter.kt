package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

/**
 * The transactional boundary sits on the adapter (ADR-0018): one call to a port method is one
 * transaction. Writes are `@Transactional` so their read-then-write — resolve the event row and its
 * technical id, then persist — commits as a unit.
 *
 * Reads are `@Transactional(readOnly = true)` because `open-in-view` is off: without a surrounding
 * transaction Spring Data's per-query transaction ends before this adapter maps the result, and
 * `internalize()` then walks the LAZY `AttendanceJpaEntity.event` to read its uuid on a detached
 * entity — failing with "Could not initialize proxy [EventJpaEntity] - no session". The session must
 * stay open across query *and* mapping.
 *
 * The transaction opens deep inside the request, after the per-request tenant schema has been bound,
 * so the connection it acquires always routes to the caller's tenant.
 */
@Repository
class JpaAttendanceRepositoryAdapter(
    private val jpaRepository: SpringDataAttendanceRepository,
    private val eventJpaRepository: SpringDataEventRepository,
) : AttendanceRepository {

    @Transactional(readOnly = true)
    override fun findByEventId(eventId: EventId): List<Attendance> =
        jpaRepository.findByEventUuid(eventId.value).map { it.internalize() }

    @Transactional(readOnly = true)
    override fun findByEventIds(eventIds: List<EventId>): List<Attendance> =
        if (eventIds.isEmpty()) emptyList()
        else jpaRepository.findByEventUuidIn(eventIds.map { it.value }).map { it.internalize() }

    @Transactional(readOnly = true)
    override fun findByEventIdAndUserId(eventId: EventId, userId: UserId): Attendance? =
        jpaRepository.findByEventUuidAndUserId(eventId.value, userId.value)?.internalize()

    @Transactional
    override fun save(attendance: Attendance): Attendance {
        val eventEntity = eventJpaRepository.findByUuid(attendance.eventId.value)
            ?: throw EventNotFoundException(attendance.eventId)
        // Carry the DB identity over when the row already exists: a fresh entity (id=0) makes
        // Hibernate INSERT — violating the uuid unique constraint — instead of updating in place.
        val existingDbId = jpaRepository.findByUuid(attendance.id.value)?.id ?: 0
        return jpaRepository.save(attendance.externalize(eventEntity, existingDbId)).internalize()
    }

    @Transactional(readOnly = true)
    override fun findByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<Attendance> =
        if (eventIds.isEmpty()) emptyList()
        else jpaRepository.findByUserIdAndEventUuidIn(userId.value, eventIds.map { it.value })
            .map { it.internalize() }

    // Each row resolves its *own* event: a batch may span events (Bulk Attend, ADR-0020), so binding
    // them all to the first row's event would silently file every response under one event. The
    // events are fetched in one query and indexed, keeping that correctness off the N+1 path.
    @Transactional
    override fun saveAll(attendances: List<Attendance>): List<Attendance> {
        if (attendances.isEmpty()) return emptyList()
        val eventIds = attendances.map { it.eventId.value }.distinct()
        val eventsByUuid = eventJpaRepository.findByUuidIn(eventIds).associateBy { it.uuid }
        return jpaRepository.saveAll(
            attendances.map {
                val eventEntity = eventsByUuid[it.eventId.value] ?: throw EventNotFoundException(it.eventId)
                it.externalize(eventEntity)
            },
        ).map { it.internalize() }
    }

    @Transactional
    override fun deleteByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<EventId> {
        if (eventIds.isEmpty()) return emptyList()
        // Read the rows first so the return value names exactly what was deleted — the caller reports
        // that back, and a repeat simply finds nothing (idempotent Undo).
        val doomed = jpaRepository.findByUserIdAndEventUuidIn(userId.value, eventIds.map { it.value })
        jpaRepository.deleteAll(doomed)
        return doomed.map { EventId(it.event.uuid) }
    }
}
