package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

/**
 * A position, in the tenant schema (ADR-0026). Deliberately unqualified: no `schema = "public"`, so
 * it routes through the tenant connection like every other team-owned entity — which is the whole
 * point of the move. There is no team id column either; the schema is the team.
 */
@Entity
@Table(name = "positions")
class PositionJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    var label: String = "",
    /**
     * [com.github.zzave.teambalance.api.domain.model.PositionKind] as its name. Stored as text rather
     * than an ordinal so the column reads for itself in a psql session and adding a kind later cannot
     * silently renumber the existing rows.
     */
    @Column(nullable = false)
    var kind: String = "PLAYING",
)
