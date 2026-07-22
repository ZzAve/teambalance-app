package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamMemberJpaEntity
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class JpaTeamMemberRepositoryAdapter(
    private val jpaRepository: SpringDataTeamMemberRepository,
) : TeamMemberRepository {
    private val logger = LoggerFactory.getLogger(JpaTeamMemberRepositoryAdapter::class.java)

    override fun findByTeamId(teamId: UUID): List<TeamMember> =
        jpaRepository.findMemberSummariesByTeamId(teamId).map { it.toDomain() }

    override fun findDisplayName(userId: UUID): String? =
        jpaRepository.findDisplayNameByUserId(userId)

    override fun findMembersByUserIds(userIds: Set<UUID>): Map<UUID, TeamMember> {
        if (userIds.isEmpty()) return emptyMap()
        return jpaRepository.findMemberSummariesByUserIds(userIds).associate { row ->
            val uid = UUID.fromString(row.getUserId())
            uid to row.toDomain()
        }
    }

    private fun MemberSummaryProjection.toDomain() = TeamMember(
        userId = UUID.fromString(getUserId()),
        displayName = getDisplayName(),
        role = getPermissionRole(),
        positionId = getPositionId()?.let { UUID.fromString(it) },
        position = getPosition(),
    )

    override fun findRole(teamId: UUID, userId: UUID): Role? =
        jpaRepository.findByTeamIdAndUserIdAndActiveTrue(teamId, userId)
            ?.role
            ?.let { role -> Role.entries.firstOrNull { it.name == role } }

    override fun findTeamId(userId: UUID): UUID? =
        jpaRepository.findTeamIdByUserId(userId)

    @Transactional
    override fun updateRole(teamId: UUID, userId: UUID, role: Role) {
        jpaRepository.updateRole(teamId, userId, role.name)
    }

    @Transactional
    override fun deactivate(teamId: UUID, userId: UUID) {
        jpaRepository.deactivate(teamId, userId)
    }

    @Transactional
    override fun assignPosition(teamId: UUID, userId: UUID, positionId: UUID?) {
        jpaRepository.assignPosition(teamId, userId, positionId)
    }

    override fun countAdmins(teamId: UUID): Int = jpaRepository.countActiveAdmins(teamId)

    @Transactional
    override fun addMember(teamId: UUID, userId: UUID) {
        if (jpaRepository.findByTeamIdAndUserIdAndActiveTrue(teamId, userId) != null) return
        try {
            jpaRepository.save(TeamMemberJpaEntity(teamId = teamId, userId = userId, role = Role.USER.name))
        } catch (e: DataIntegrityViolationException) {
            // Concurrent accept or inactive-member row conflict — already a member, no-op
            logger.info(
                "Failed to add member to team because of a conflic. " +
                        "This signals that the user is already a member, no biggy", e
            )
        }
    }
}
