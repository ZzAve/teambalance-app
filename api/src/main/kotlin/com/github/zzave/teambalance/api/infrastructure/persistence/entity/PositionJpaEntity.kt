package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

/**
 * A position, in the tenant schema (ADR-0025). Deliberately unqualified: no `schema = "public"`, so
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
)
