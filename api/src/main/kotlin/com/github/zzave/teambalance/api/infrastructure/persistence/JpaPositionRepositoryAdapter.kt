package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamPositionJpaEntity
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaPositionRepositoryAdapter(
    private val jpaRepository: SpringDataTeamPositionRepository,
    private val teamMemberRepository: SpringDataTeamMemberRepository,
) : PositionRepository {

    override fun listByTeam(teamId: TeamId): List<Position> =
        jpaRepository.findByTeamIdOrderByLabelAsc(teamId.value).map { it.toDomain() }

    override fun create(teamId: TeamId, label: PositionLabel): Position =
        jpaRepository.save(TeamPositionJpaEntity(teamId = teamId.value, label = label.value)).toDomain()

    @Transactional
    override fun rename(id: PositionId, label: PositionLabel): Position {
        val entity = jpaRepository.findById(id.value).orElseThrow {
            IllegalStateException("Position $id disappeared during rename")
        }
        entity.label = label.value
        return jpaRepository.save(entity).toDomain()
    }

    // Clears the FK from any member assigned to this position before deleting it, so the assignment
    // constraint can never block the delete — members simply become unassigned.
    @Transactional
    override fun delete(id: PositionId) {
        teamMemberRepository.clearPositionAssignments(id.value)
        jpaRepository.deleteById(id.value)
    }

    override fun findById(id: PositionId): Position? =
        jpaRepository.findById(id.value).map { it.toDomain() }.orElse(null)

    override fun existsInTeam(teamId: TeamId, positionId: PositionId): Boolean =
        jpaRepository.findByIdAndTeamId(positionId.value, teamId.value) != null

    private fun TeamPositionJpaEntity.toDomain() = Position(id = PositionId(id), label = PositionLabel(label))
}
