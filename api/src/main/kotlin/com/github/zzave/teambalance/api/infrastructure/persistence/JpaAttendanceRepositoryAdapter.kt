package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaAttendanceRepositoryAdapter(
    private val jpaRepository: SpringDataAttendanceRepository,
    private val eventJpaRepository: SpringDataEventRepository,
) : AttendanceRepository {

    override fun findByEventId(eventId: EventId): List<Attendance> =
        jpaRepository.findByEventUuid(eventId.value).map { it.internalize() }

    override fun findByEventIds(eventIds: List<EventId>): List<Attendance> =
        if (eventIds.isEmpty()) emptyList()
        else jpaRepository.findByEventUuidIn(eventIds.map { it.value }).map { it.internalize() }

    override fun findByEventIdAndUserId(eventId: EventId, userId: UUID): Attendance? =
        jpaRepository.findByEventUuidAndUserId(eventId.value, userId)?.internalize()

    override fun save(attendance: Attendance): Attendance {
        val eventEntity = eventJpaRepository.findByUuid(attendance.eventId.value)
            ?: throw EventNotFoundException(attendance.eventId)
        // Carry the DB identity over when the row already exists: a fresh entity (id=0) makes
        // Hibernate INSERT — violating the uuid unique constraint — instead of updating in place.
        val existingDbId = jpaRepository.findByUuid(attendance.id)?.id ?: 0
        return jpaRepository.save(attendance.externalize(eventEntity, existingDbId)).internalize()
    }

    override fun saveAll(attendances: List<Attendance>): List<Attendance> {
        if (attendances.isEmpty()) return emptyList()
        val eventEntity = eventJpaRepository.findByUuid(attendances.first().eventId.value)
            ?: throw EventNotFoundException(attendances.first().eventId)
        return jpaRepository.saveAll(attendances.map { it.externalize(eventEntity) }).map { it.internalize() }
    }
}
