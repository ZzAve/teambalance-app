package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.SubstituteJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.util.UUID

interface SpringDataSubstituteRepository : JpaRepository<SubstituteJpaEntity, UUID> {

    @Query(
        value = """
            SELECT s.id::text          AS id,
                   s.name              AS name,
                   s.position_id::text AS positionId,
                   p.label             AS position
            FROM   substitutes s
            LEFT   JOIN positions p ON p.id = s.position_id
            ORDER  BY lower(s.name)
        """,
        nativeQuery = true,
    )
    fun findAllWithPosition(): List<SubstituteProjection>

    @Query(
        value = "SELECT count(*) FROM substitute_attendances WHERE substitute_id = :substituteId",
        nativeQuery = true,
    )
    fun countAttendances(@Param("substituteId") substituteId: UUID): Int

    @Modifying
    @Query(
        value = """
            DELETE FROM substitute_attendances sa
            USING  events e
            WHERE  e.id = sa.event_id
            AND    e.uuid = :eventId
            AND    sa.substitute_id = :substituteId
        """,
        nativeQuery = true,
    )
    fun deleteAttendance(@Param("eventId") eventId: UUID, @Param("substituteId") substituteId: UUID): Int

    // One statement both adds and updates, keyed by the (event, substitute) pair. The event's
    // technical id is looked up by its uuid inside the statement, so an unknown event inserts nothing
    // and the returned count is how the adapter tells the caller.
    @Modifying
    @Query(
        value = """
            INSERT INTO substitute_attendances (event_id, substitute_id, state, changed_by, updated_at)
            SELECT e.id, :substituteId, :state, :changedBy, :at
            FROM   events e
            WHERE  e.uuid = :eventId
            ON CONFLICT (event_id, substitute_id)
            DO UPDATE SET state = EXCLUDED.state, changed_by = EXCLUDED.changed_by, updated_at = EXCLUDED.updated_at
        """,
        nativeQuery = true,
    )
    fun upsertAttendance(
        @Param("eventId") eventId: UUID,
        @Param("substituteId") substituteId: UUID,
        @Param("state") state: String,
        @Param("changedBy") changedBy: UUID,
        @Param("at") at: Instant,
    ): Int

    @Query(
        value = """
            SELECT e.uuid::text          AS eventId,
                   s.id::text            AS substituteId,
                   s.name                AS name,
                   s.position_id::text   AS positionId,
                   p.label               AS position,
                   sa.state              AS state,
                   sa.changed_by::text   AS changedBy,
                   sa.updated_at         AS updatedAt
            FROM   substitute_attendances sa
            JOIN   events e ON e.id = sa.event_id
            JOIN   substitutes s ON s.id = sa.substitute_id
            LEFT   JOIN positions p ON p.id = s.position_id
            WHERE  e.uuid IN :eventIds
            ORDER  BY lower(s.name)
        """,
        nativeQuery = true,
    )
    fun findAttendanceByEventIds(@Param("eventIds") eventIds: Collection<UUID>): List<SubstituteAttendanceProjection>
}

interface SubstituteProjection {
    val id: String
    val name: String
    val positionId: String?
    val position: String?
}

interface SubstituteAttendanceProjection {
    val eventId: String
    val substituteId: String
    val name: String
    val positionId: String?
    val position: String?
    val state: String
    val changedBy: String
    val updatedAt: Instant
}
