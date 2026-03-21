package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.AttendanceJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataAttendanceRepository : JpaRepository<AttendanceJpaEntity, UUID> {
    fun findByEventId(eventId: UUID): List<AttendanceJpaEntity>
    fun findByEventIdAndUserId(eventId: UUID, userId: UUID): AttendanceJpaEntity?
}
