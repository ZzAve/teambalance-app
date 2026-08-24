package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapKeyColumn
import jakarta.persistence.OrderColumn
import jakarta.persistence.Table
import org.hibernate.annotations.BatchSize
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
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_references", joinColumns = [JoinColumn(name = "event_id")])
    @OrderColumn(name = "position")
    val references: List<EventReferenceEmbeddable> = emptyList(),
    // This occurrence's roster override, or "inherit the type default" when trackRoster is null.
    // The value object's trackRoster is non-null, so its nullability here IS the override/inherit
    // bit — there is no separate flag column that could disagree with the rest of the row.
    @Column(name = "roster_track_roster")
    val rosterTrackRoster: Boolean? = null,
    @Column(name = "roster_total_target")
    val rosterTotalTarget: Int? = null,
    // Keyed by public.team_positions(id) — a cross-schema reference, hence a plain UUID and no FK.
    // @BatchSize keeps the events listing from paying one extra select per event for a collection
    // that is empty on every inheriting event (the common case): Hibernate loads up to 100 events'
    // targets in a single IN query instead.
    @ElementCollection(fetch = FetchType.EAGER)
    @BatchSize(size = 100)
    @CollectionTable(name = "event_position_targets", joinColumns = [JoinColumn(name = "event_id")])
    @MapKeyColumn(name = "position_id")
    @Column(name = "target_count", nullable = false)
    val rosterPositionTargets: Map<UUID, Int> = emptyMap(),
    @Column(name = "recurring_group")
    val recurringGroup: UUID?,
    @Column(name = "created_by", nullable = false)
    val createdBy: UUID,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant,
)
