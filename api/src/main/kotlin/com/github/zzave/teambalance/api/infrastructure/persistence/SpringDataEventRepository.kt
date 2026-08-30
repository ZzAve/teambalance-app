package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.util.UUID

interface SpringDataEventRepository : JpaRepository<EventJpaEntity, Long> {
    fun findByUuid(uuid: UUID): EventJpaEntity?
    fun findByUuidIn(uuids: List<UUID>): List<EventJpaEntity>
    fun findByStartTimeGreaterThanOrderByStartTimeAsc(since: Instant): List<EventJpaEntity>
    fun findAllByOrderByStartTimeDesc(): List<EventJpaEntity>
    fun findByRecurringGroupOrderByStartTimeAsc(recurringGroup: UUID): List<EventJpaEntity>

    fun countByEventTypeId(eventTypeId: Long): Int

    /** How many event roster overrides name this position — half of the position-delete warning. */
    @Query("SELECT count(*) FROM event_position_targets WHERE position_id = :positionId", nativeQuery = true)
    fun countPositionTargets(@Param("positionId") positionId: UUID): Int

    /**
     * Moves every event of one type onto another, the migration an archive offers before hiding a
     * type (#219). Bulk, because it must be one statement inside the archive's transaction rather
     * than a row-at-a-time loop that could half-succeed. `clearAutomatically` so the archive's own
     * read of these rows, in the same transaction, is not served a stale persistence context.
     */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE events SET event_type_id = :toTypeId WHERE event_type_id = :fromTypeId", nativeQuery = true)
    fun reassignEventType(@Param("fromTypeId") fromTypeId: Long, @Param("toTypeId") toTypeId: Long): Int
}
