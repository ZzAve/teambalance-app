package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

/** A Substitute, in the tenant schema (ADR-0033). Unqualified, so it routes like [PositionJpaEntity]. */
@Entity
@Table(name = "substitutes")
class SubstituteJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    val name: String = "",
    @Column(name = "position_id")
    val positionId: UUID? = null,
    @Column(name = "created_by", nullable = false)
    val createdBy: UUID = UUID.randomUUID(),
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
)
