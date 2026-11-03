package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "bunq_oauth_states", schema = "public")
class BunqOAuthStateJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "state_hash", nullable = false, unique = true)
    val stateHash: String = "",
    @Column(name = "team_id", nullable = false)
    val teamId: UUID = UUID.randomUUID(),
    @Column(name = "admin_user_id", nullable = false)
    val adminUserId: UUID = UUID.randomUUID(),
    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant = Instant.EPOCH,
    @Column(name = "used_at")
    val usedAt: Instant? = null,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.EPOCH,
)
