package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

/**
 * A calendar link, in the tenant schema (ADR-0039). Deliberately unqualified: no `schema = "public"`,
 * so it routes through the tenant connection like every other team-owned entity. There is no team id
 * column — the schema is the team, and that is what scopes a token lookup to one team's links.
 */
@Entity
@Table(name = "calendar_links")
class CalendarLinkJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "user_id", nullable = false)
    val userId: UUID = UUID.randomUUID(),
    @Column(name = "token_hash", nullable = false, unique = true)
    val tokenHash: String = "",
    @Column(name = "token_encrypted", nullable = false)
    val tokenEncrypted: String = "",
    @Column(name = "label")
    val label: String? = null,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.EPOCH,
    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant = Instant.EPOCH,
    // Eager, as EventTypeJpaEntity.positionTargets is: every read of a link (the feed, the list) needs
    // its states and the set is at most four rows. The default is mutable because a save with an
    // assigned id is a merge, which fills the collection of a fresh instance in place.
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "calendar_link_attendance_states",
        joinColumns = [JoinColumn(name = "link_id")],
    )
    @Column(name = "state", nullable = false)
    val attendanceStates: Set<String> = mutableSetOf(),
    @Column(name = "show_attendance_prefix", nullable = false)
    val showAttendancePrefix: Boolean = true,
    @Column(name = "calendar_name_suffix")
    val calendarNameSuffix: String? = null,
    // The explicit type allowlist; empty means every type (ADR-0040). Eager for the reason the states
    // are: the feed reads it on every fetch, and it is a handful of rows at most.
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "calendar_link_event_types",
        joinColumns = [JoinColumn(name = "link_id")],
        inverseJoinColumns = [JoinColumn(name = "event_type_id")],
    )
    val eventTypes: Set<EventTypeJpaEntity> = mutableSetOf(),
)
