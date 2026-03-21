package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "event_types")
class EventTypeJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    val name: String = "",
    val color: String? = null,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
)
