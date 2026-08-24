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
import jakarta.persistence.MapKeyColumn
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "event_types")
class EventTypeJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @Column(nullable = false, unique = true, updatable = false)
    val uuid: UUID,
    @Column(nullable = false)
    val name: String,
    val color: String?,
    @Column(nullable = false)
    val archived: Boolean = false,
    @Column(name = "track_roster", nullable = false)
    val trackRoster: Boolean = false,
    @Column(name = "total_target")
    val totalTarget: Int? = null,
    // The type's default per-position targets, keyed by public.team_positions(id). EAGER because
    // every read of an event type is a read of its roster default (the listing renders both) and the
    // map is at most a handful of rows — this is the only collection on the entity, so there is no
    // second eager association to multiply against.
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "event_type_position_targets",
        joinColumns = [JoinColumn(name = "event_type_id")],
    )
    @MapKeyColumn(name = "position_id")
    @Column(name = "target_count", nullable = false)
    val positionTargets: Map<UUID, Int> = emptyMap(),
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
