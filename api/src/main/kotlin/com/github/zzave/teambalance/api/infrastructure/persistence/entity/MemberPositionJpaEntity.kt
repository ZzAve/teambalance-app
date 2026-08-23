package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

/**
 * Which position a member plays, in the tenant schema (ADR-0025).
 *
 * `userId` is the primary key, which *is* the "one position per member" rule — no unique index to
 * keep in step with it. It names a `public.users` row without a foreign key, because identity is the
 * one genuinely platform-wide thing; that is the residual cross-schema reference after this move,
 * and it points from tenant data at the platform rather than the other way round.
 */
@Entity
@Table(name = "member_positions")
class MemberPositionJpaEntity(
    @Id
    @Column(name = "user_id")
    val userId: UUID = UUID.randomUUID(),
    @Column(name = "position_id", nullable = false)
    var positionId: UUID = UUID.randomUUID(),
)
