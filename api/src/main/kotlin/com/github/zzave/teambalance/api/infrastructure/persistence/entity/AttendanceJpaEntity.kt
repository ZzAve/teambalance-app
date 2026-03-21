package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "attendances")
class AttendanceJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "event_id", nullable = false)
    val eventId: UUID = UUID.randomUUID(),
    @Column(name = "user_id", nullable = false)
    val userId: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    val state: String = "NOT_RESPONDED",
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant = Instant.now(),
)
