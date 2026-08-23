package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

/**
 * What a member is called and what they play **in this team** (ADR-0025) — a tenant row.
 *
 * Both fields were platform columns before (`public.users.display_name`,
 * `public.team_members.position_id`), which under ADR-0023's multi-team membership meant a rename in
 * one team silently renamed you in every team. Keyed by `userId`, which is also the one-position-per-
 * member rule: no separate index to keep in step with it.
 *
 * `userId` names a `public.users` row without a foreign key, because identity is the one genuinely
 * platform-wide thing.
 */
@Entity
@Table(name = "member_profiles")
class MemberProfileJpaEntity(
    @Id
    @Column(name = "user_id")
    val userId: UUID = UUID.randomUUID(),
    @Column(name = "display_name", nullable = false)
    var displayName: String = "",
    @Column(name = "position_id")
    var positionId: UUID? = null,
)
