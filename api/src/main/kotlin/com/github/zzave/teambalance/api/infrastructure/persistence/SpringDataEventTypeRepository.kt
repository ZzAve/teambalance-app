package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface SpringDataEventTypeRepository : JpaRepository<EventTypeJpaEntity, Long> {
    fun findByUuid(uuid: UUID): EventTypeJpaEntity?

    /** How many type roster defaults name this position — half of the position-delete warning. */
    @Query("SELECT count(*) FROM event_type_position_targets WHERE position_id = :positionId", nativeQuery = true)
    fun countPositionTargets(@Param("positionId") positionId: UUID): Int
}
