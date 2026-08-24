package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.InvitationJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.time.Instant
import java.util.UUID

interface SpringDataInvitationRepository : JpaRepository<InvitationJpaEntity, UUID> {
    fun findByTokenHash(tokenHash: String): InvitationJpaEntity?

    fun findFirstByTeamIdAndExpiresAtAfter(teamId: UUID, now: Instant): InvitationJpaEntity?

    @Modifying(clearAutomatically = true)
    @Query(
        "UPDATE InvitationJpaEntity i SET i.expiresAt = :now " +
            "WHERE i.teamId = :teamId AND i.expiresAt > :now",
    )
    fun expireActive(teamId: UUID, now: Instant)
}
