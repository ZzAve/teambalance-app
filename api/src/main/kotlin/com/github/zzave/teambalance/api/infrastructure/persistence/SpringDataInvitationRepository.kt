package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.InvitationJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataInvitationRepository : JpaRepository<InvitationJpaEntity, UUID> {
    fun findFirstByTeamIdOrderByCreatedAtDesc(teamId: UUID): InvitationJpaEntity?
}
