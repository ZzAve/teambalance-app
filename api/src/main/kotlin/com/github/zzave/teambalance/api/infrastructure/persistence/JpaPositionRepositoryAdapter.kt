package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.PositionJpaEntity
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

/**
 * Positions, tenant-schema rows since ADR-0026 — so every query here is
 * scoped by the routed connection rather than by a team id predicate. Assignments live with member
 * edits (JpaTeamMemberRepositoryAdapter), which must write name, role and position in one call.
 */
@Repository
class JpaPositionRepositoryAdapter(
    private val jpaRepository: SpringDataPositionRepository,
) : PositionRepository {

    override fun list(): List<Position> = jpaRepository.findAllByOrderByLabelAsc().map { it.toDomain() }

    override fun create(label: PositionLabel): Position =
        jpaRepository.save(PositionJpaEntity(label = label.value)).toDomain()

    @Transactional
    override fun rename(id: PositionId, label: PositionLabel): Position {
        val entity = jpaRepository.findById(id.value).orElseThrow {
            IllegalStateException("Position $id disappeared during rename")
        }
        entity.label = label.value
        return jpaRepository.save(entity).toDomain()
    }

    /**
     * No prior clearing statement: `member_profiles.position_id` is a real foreign key with
     * ON DELETE SET NULL, so assigned members become unassigned as part of this delete rather than
     * by a separate write that could be skipped or fail in between — and they keep their name,
     * which a cascade would have deleted along with the row. That guarantee is the point of
     * moving positions into the tenant schema — before, the two tables sat in different schemas and
     * no foreign key could span them.
     */
    override fun delete(id: PositionId) = jpaRepository.deleteById(id.value)

    override fun findById(id: PositionId): Position? =
        jpaRepository.findById(id.value).map { it.toDomain() }.orElse(null)

    override fun exists(positionId: PositionId): Boolean = jpaRepository.existsById(positionId.value)

    private fun PositionJpaEntity.toDomain() = Position(id = PositionId(id), label = PositionLabel(label))
}
