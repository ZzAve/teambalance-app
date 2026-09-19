package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.CalendarLinkJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

/**
 * Calendar links of the current tenant. No team-scoped finders: the connection's schema already scopes
 * every row, so a `…AndTeamId` variant would be asking a question the schema has answered.
 */
interface SpringDataCalendarLinkRepository : JpaRepository<CalendarLinkJpaEntity, UUID> {
    fun findByUserIdOrderByCreatedAtDesc(userId: UUID): List<CalendarLinkJpaEntity>

    fun findByTokenHash(tokenHash: String): CalendarLinkJpaEntity?

    /** Owner in the predicate, count out: the caller learns whether *their* link was the one removed. */
    fun deleteByIdAndUserId(id: UUID, userId: UUID): Long
}
