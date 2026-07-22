package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamPositionJpaEntity
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class JpaPositionRepositoryAdapter(
    private val jpaRepository: SpringDataTeamPositionRepository,
    private val teamMemberRepository: SpringDataTeamMemberRepository,
) : PositionRepository {

    override fun listByTeam(teamId: UUID): List<Position> =
        jpaRepository.findByTeamIdOrderByLabelAsc(teamId).map { it.toDomain() }

    override fun create(teamId: UUID, label: String): Position =
        jpaRepository.save(TeamPositionJpaEntity(teamId = teamId, label = label)).toDomain()

    @Transactional
    override fun rename(id: UUID, label: String): Position {
        val entity = jpaRepository.findById(id).orElseThrow {
            IllegalStateException("Position $id disappeared during rename")
        }
        entity.label = label
        return jpaRepository.save(entity).toDomain()
    }

    // Clears the FK from any member assigned to this position before deleting it, so the assignment
    // constraint can never block the delete — members simply become unassigned.
    @Transactional
    override fun delete(id: UUID) {
        teamMemberRepository.clearPositionAssignments(id)
        jpaRepository.deleteById(id)
    }

    override fun findById(id: UUID): Position? =
        jpaRepository.findById(id).map { it.toDomain() }.orElse(null)

    override fun existsInTeam(teamId: UUID, positionId: UUID): Boolean =
        jpaRepository.findByIdAndTeamId(positionId, teamId) != null

    private fun TeamPositionJpaEntity.toDomain() = Position(id = id, label = label)
}
