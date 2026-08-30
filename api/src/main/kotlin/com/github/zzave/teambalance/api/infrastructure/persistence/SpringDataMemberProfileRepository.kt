package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MemberProfileJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

// The per-team half of a member: what they are called here and what they play here (ADR-0025).
// Reads that also need the platform half — role, active — go through SpringDataTeamMemberRepository,
// which joins this table in from the routed schema rather than the other way round.
interface SpringDataMemberProfileRepository : JpaRepository<MemberProfileJpaEntity, UUID>
