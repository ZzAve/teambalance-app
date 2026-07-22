package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamPositionJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataTeamPositionRepository : JpaRepository<TeamPositionJpaEntity, UUID> {
    fun findByTeamIdOrderByLabelAsc(teamId: UUID): List<TeamPositionJpaEntity>
    fun findByIdAndTeamId(id: UUID, teamId: UUID): TeamPositionJpaEntity?
}
