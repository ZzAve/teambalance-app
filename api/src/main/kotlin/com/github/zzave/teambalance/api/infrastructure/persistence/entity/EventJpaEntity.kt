package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "events")
class EventJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_type_id", nullable = false)
    val eventType: EventTypeJpaEntity = EventTypeJpaEntity(),
    @Column(nullable = false)
    val title: String = "",
    val description: String? = null,
    @Column(name = "start_time", nullable = false)
    val startTime: Instant = Instant.now(),
    @Column(name = "end_time")
    val endTime: Instant? = null,
    val location: String? = null,
    @Column(name = "recurring_group")
    val recurringGroup: UUID? = null,
    @Column(name = "created_by", nullable = false)
    val createdBy: UUID = UUID.randomUUID(),
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant = Instant.now(),
)
