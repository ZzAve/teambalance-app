package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MemberProfileJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataMemberProfileRepository : JpaRepository<MemberProfileJpaEntity, UUID> {
    fun countByPositionId(positionId: UUID): Int
}
