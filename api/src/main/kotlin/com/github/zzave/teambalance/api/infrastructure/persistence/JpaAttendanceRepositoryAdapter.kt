package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.model.Attendance
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

    override fun findByEventId(eventId: UUID): List<Attendance> =
        jpaRepository.findByEventUuid(eventId).map { it.internalize() }

    override fun findByEventIdAndUserId(eventId: UUID, userId: UUID): Attendance? =
        jpaRepository.findByEventUuidAndUserId(eventId, userId)?.internalize()

    override fun save(attendance: Attendance): Attendance {
        val eventEntity = eventJpaRepository.findByUuid(attendance.eventId)
            ?: throw EventNotFoundException(attendance.eventId)
        // Carry the DB identity over when the row already exists: a fresh entity (id=0) makes
        // Hibernate INSERT — violating the uuid unique constraint — instead of updating in place.
        val existingDbId = jpaRepository.findByUuid(attendance.id)?.id ?: 0
        return jpaRepository.save(attendance.externalize(eventEntity, existingDbId)).internalize()
    }

    override fun saveAll(attendances: List<Attendance>): List<Attendance> {
        if (attendances.isEmpty()) return emptyList()
        val eventEntity = eventJpaRepository.findByUuid(attendances.first().eventId)
            ?: throw EventNotFoundException(attendances.first().eventId)
        return jpaRepository.saveAll(attendances.map { it.externalize(eventEntity) }).map { it.internalize() }
    }
}
