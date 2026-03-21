package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toDomain
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toJpaEntity
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaAttendanceRepositoryAdapter(
    private val jpaRepository: SpringDataAttendanceRepository,
    private val eventJpaRepository: SpringDataEventRepository,
) : AttendanceRepository {

    override fun findByEventId(eventId: UUID): List<Attendance> =
        jpaRepository.findByEventUuid(eventId).map { it.toDomain() }

    override fun findByEventIdAndUserId(eventId: UUID, userId: UUID): Attendance? =
        jpaRepository.findByEventUuidAndUserId(eventId, userId)?.toDomain()

    override fun save(attendance: Attendance): Attendance {
        val eventEntity = eventJpaRepository.findByUuid(attendance.eventId)
            ?: throw IllegalArgumentException("Event not found: ${attendance.eventId}")
        return jpaRepository.save(attendance.toJpaEntity(eventEntity)).toDomain()
    }

    override fun saveAll(attendances: List<Attendance>): List<Attendance> {
        if (attendances.isEmpty()) return emptyList()
        val eventEntity = eventJpaRepository.findByUuid(attendances.first().eventId)
            ?: throw IllegalArgumentException("Event not found: ${attendances.first().eventId}")
        return jpaRepository.saveAll(attendances.map { it.toJpaEntity(eventEntity) }).map { it.toDomain() }
    }
}
