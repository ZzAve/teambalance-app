package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamMemberJpaEntity
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

// Cohesive data-access surface for team_members; the member-management feature grew it past the
// default 11-function limit. Splitting a single adapter/port would be artificial.
@Suppress("TooManyFunctions")
@Repository
class JpaTeamMemberRepositoryAdapter(
    private val jpaRepository: SpringDataTeamMemberRepository,
) : TeamMemberRepository {
    private val logger = LoggerFactory.getLogger(JpaTeamMemberRepositoryAdapter::class.java)

    override fun findByTeamId(teamId: UUID): List<TeamMember> =
        jpaRepository.findMemberSummariesByTeamId(teamId).map { it.toDomain() }

    override fun findDisplayName(userId: UserId): String? =
        jpaRepository.findDisplayNameByUserId(userId.value)

    override fun findMembersByUserIds(userIds: Set<UserId>): Map<UserId, TeamMember> {
        if (userIds.isEmpty()) return emptyMap()
        return jpaRepository.findMemberSummariesByUserIds(userIds.map { it.value }.toSet()).associate { row ->
            val uid = UserId(UUID.fromString(row.getUserId()))
            uid to row.toDomain()
        }
    }

    private fun MemberSummaryProjection.toDomain() = TeamMember(
        userId = UserId(UUID.fromString(getUserId())),
        displayName = getDisplayName(),
        role = getPermissionRole(),
        positionId = getPositionId()?.let { PositionId(UUID.fromString(it)) },
        position = getPosition(),
        onboarded = getOnboarded(),
    )

    override fun findRole(teamId: UUID, userId: UserId): Role? =
        jpaRepository.findByTeamIdAndUserIdAndActiveTrue(teamId, userId.value)
            ?.role
            ?.let { role -> Role.entries.firstOrNull { it.name == role } }

    override fun findTeamId(userId: UserId): UUID? =
        jpaRepository.findTeamIdByUserId(userId.value)

    @Transactional
    override fun updateRole(teamId: UUID, userId: UserId, role: Role) {
        jpaRepository.updateRole(teamId, userId.value, role.name)
    }

    @Transactional
    override fun deactivate(teamId: UUID, userId: UserId) {
        jpaRepository.deactivate(teamId, userId.value)
    }

    @Transactional
    override fun assignPosition(teamId: UUID, userId: UserId, positionId: PositionId?) {
        jpaRepository.assignPosition(teamId, userId.value, positionId?.value)
    }

    @Transactional
    override fun markOnboarded(teamId: UUID, userId: UserId, at: Instant) {
        jpaRepository.markOnboarded(teamId, userId.value, at.atOffset(ZoneOffset.UTC))
    }

    override fun countAdmins(teamId: UUID): Int = jpaRepository.countActiveAdmins(teamId)

    @Transactional
    override fun addMember(teamId: UUID, userId: UserId) {
        if (jpaRepository.findByTeamIdAndUserIdAndActiveTrue(teamId, userId.value) != null) return
        try {
            jpaRepository.save(TeamMemberJpaEntity(teamId = teamId, userId = userId.value, role = Role.USER.name))
        } catch (e: DataIntegrityViolationException) {
            // Concurrent accept or inactive-member row conflict — already a member, no-op
            logger.info(
                "Failed to add member to team because of a conflic. " +
                        "This signals that the user is already a member, no biggy", e
            )
        }
    }
}
