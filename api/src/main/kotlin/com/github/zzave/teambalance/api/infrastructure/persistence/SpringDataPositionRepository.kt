package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.PositionJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

/**
 * Positions of the current tenant. No team-scoped finders: the connection's schema already scopes
 * every row, so a `…AndTeamId` variant would be asking a question the schema has answered.
 */
interface SpringDataPositionRepository : JpaRepository<PositionJpaEntity, UUID> {
    fun findAllByOrderByLabelAsc(): List<PositionJpaEntity>
}
