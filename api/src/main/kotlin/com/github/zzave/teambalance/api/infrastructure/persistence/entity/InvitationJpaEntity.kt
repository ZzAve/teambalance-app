package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "invitations", schema = "public")
class InvitationJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "team_id", nullable = false)
    val teamId: UUID = UUID.randomUUID(),
    @Column(name = "token", nullable = false, unique = true)
    val tokenHash: String = "",
    @Column(name = "token_encrypted")
    val encryptedToken: String? = null,
    @Column(name = "created_by", nullable = false)
    val createdBy: UUID = UUID.randomUUID(),
    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant = Instant.EPOCH,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.EPOCH,
)
