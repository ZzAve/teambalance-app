package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @Column(nullable = false, unique = true, updatable = false)
    val uuid: UUID,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_type_id", nullable = false)
    val eventType: EventTypeJpaEntity,
    @Column(nullable = false)
    val title: String,
    val description: String?,
    @Column(name = "start_time", nullable = false)
    val startTime: Instant,
    @Column(name = "end_time", nullable = false)
    val endTime: Instant,
    val location: String?,
    @Column(name = "recurring_group")
    val recurringGroup: UUID?,
    @Column(name = "created_by", nullable = false)
    val createdBy: UUID,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant,
)
