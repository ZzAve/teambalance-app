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
) : AttendanceRepository {

    override fun findByEventId(eventId: UUID): List<Attendance> =
        jpaRepository.findByEventId(eventId).map { it.toDomain() }

    override fun findByEventIdAndUserId(eventId: UUID, userId: UUID): Attendance? =
        jpaRepository.findByEventIdAndUserId(eventId, userId)?.toDomain()

    override fun save(attendance: Attendance): Attendance =
        jpaRepository.save(attendance.toJpaEntity()).toDomain()

    override fun saveAll(attendances: List<Attendance>): List<Attendance> =
        jpaRepository.saveAll(attendances.map { it.toJpaEntity() }).map { it.toDomain() }
}
