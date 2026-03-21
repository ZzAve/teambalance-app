package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.time.Instant
import java.util.UUID

interface SpringDataEventRepository : JpaRepository<EventJpaEntity, Long> {
    fun findByUuid(uuid: UUID): EventJpaEntity?
    fun findByStartTimeGreaterThanOrderByStartTimeAsc(since: Instant): List<EventJpaEntity>
    fun findAllByOrderByStartTimeDesc(): List<EventJpaEntity>
}
