package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.BunqOAuthStateJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.time.Instant
import java.util.UUID

interface SpringDataBunqOAuthStateRepository : JpaRepository<BunqOAuthStateJpaEntity, UUID> {
    fun findByStateHash(stateHash: String): BunqOAuthStateJpaEntity?

    // Conditional single-use consume: stamps used_at only while still unused, so exactly one callback
    // per state wins. Returns the number of rows changed (0 or 1).
    @Modifying(clearAutomatically = true)
    @Query("UPDATE BunqOAuthStateJpaEntity s SET s.usedAt = :now WHERE s.id = :id AND s.usedAt IS NULL")
    fun consume(id: UUID, now: Instant): Int

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM BunqOAuthStateJpaEntity s WHERE s.expiresAt < :cutoff")
    fun deleteExpiredBefore(cutoff: Instant)
}
