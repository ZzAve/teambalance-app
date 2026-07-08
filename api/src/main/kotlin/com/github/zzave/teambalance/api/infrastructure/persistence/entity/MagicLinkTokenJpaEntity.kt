package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "magic_link_tokens", schema = "public")
class MagicLinkTokenJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "token_hash", nullable = false, unique = true)
    val tokenHash: String = "",
    @Column(nullable = false)
    val email: String = "",
    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant = Instant.EPOCH,
    @Column(name = "used_at")
    val usedAt: Instant? = null,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.EPOCH,
)
