package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "team_members", schema = "public")
class TeamMemberJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "team_id", nullable = false)
    val teamId: UUID = UUID.randomUUID(),
    @Column(name = "user_id", nullable = false)
    val userId: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    val role: String = "USER",
    @Column(name = "team_role")
    val teamRole: String? = null,
    @Column(nullable = false)
    val active: Boolean = true,
)
