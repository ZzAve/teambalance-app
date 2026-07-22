package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "team_positions", schema = "public")
class TeamPositionJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "team_id", nullable = false)
    val teamId: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    var label: String = "",
)
