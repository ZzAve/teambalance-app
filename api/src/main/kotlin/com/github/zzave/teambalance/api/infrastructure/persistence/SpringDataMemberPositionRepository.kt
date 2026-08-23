package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MemberPositionJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataMemberPositionRepository : JpaRepository<MemberPositionJpaEntity, UUID> {
    fun findByUserIdIn(userIds: Collection<UUID>): List<MemberPositionJpaEntity>
    fun countByPositionId(positionId: UUID): Int
}
