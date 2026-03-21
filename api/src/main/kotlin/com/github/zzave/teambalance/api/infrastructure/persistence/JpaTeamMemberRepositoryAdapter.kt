package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaTeamMemberRepositoryAdapter(
    private val jpaRepository: SpringDataTeamMemberRepository,
) : TeamMemberRepository {

    override fun findByTeamId(teamId: UUID): List<TeamMember> =
        jpaRepository.findByTeamIdAndActiveTrue(teamId).map { entity ->
            TeamMember(
                userId = entity.userId,
                displayName = jpaRepository.findDisplayNameByUserId(entity.userId) ?: "Unknown",
                role = entity.role,
                teamRole = entity.teamRole,
            )
        }

    override fun findDisplayName(userId: UUID): String? =
        jpaRepository.findDisplayNameByUserId(userId)
}
