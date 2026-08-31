package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.InvitationJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.time.Instant
import java.util.UUID

interface SpringDataInvitationRepository : JpaRepository<InvitationJpaEntity, UUID> {
    fun findByTokenHash(tokenHash: String): InvitationJpaEntity?

    fun findFirstByTeamIdAndRoleAndExpiresAtAfter(teamId: UUID, role: String, now: Instant): InvitationJpaEntity?

    fun findFirstByTeamIdAndRoleAndConsumedAtIsNullAndExpiresAtAfter(
        teamId: UUID,
        role: String,
        now: Instant,
    ): InvitationJpaEntity?

    @Modifying(clearAutomatically = true)
    @Query(
        "UPDATE InvitationJpaEntity i SET i.expiresAt = :now " +
            "WHERE i.teamId = :teamId AND i.expiresAt > :now",
    )
    fun expireActive(teamId: UUID, now: Instant)

    // Conditional single-use consume: stamps consumed_at only while still unspent, so exactly one
    // accept of an ADMIN handover link can win. Returns the number of rows changed (0 or 1).
    @Modifying(clearAutomatically = true)
    @Query(
        "UPDATE InvitationJpaEntity i SET i.consumedAt = :now " +
            "WHERE i.id = :id AND i.consumedAt IS NULL",
    )
    fun consume(id: UUID, now: Instant): Int
}
