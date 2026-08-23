package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TenantRouting
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
    private val userJpaRepository: SpringDataUserRepository,
) : TeamMemberRepository {
    private val logger = LoggerFactory.getLogger(JpaTeamMemberRepositoryAdapter::class.java)

    override fun findByTeamId(teamId: TeamId): List<TeamMember> =
        jpaRepository.findMemberSummariesByTeamId(teamId.value).map { it.toDomain() }

    override fun findDisplayName(userId: UserId): DisplayName? =
        jpaRepository.findDisplayNameByUserId(userId.value)?.let(::DisplayName)

    override fun findMembersByUserIds(userIds: Set<UserId>): Map<UserId, TeamMember> {
        if (userIds.isEmpty()) return emptyMap()
        return jpaRepository.findMemberSummariesByUserIds(userIds.map { it.value }.toSet()).associate { row ->
            val uid = UserId(UUID.fromString(row.getUserId()))
            uid to row.toDomain()
        }
    }

    private fun MemberSummaryProjection.toDomain() = TeamMember(
        userId = UserId(UUID.fromString(getUserId())),
        displayName = DisplayName(getDisplayName()),
        permission = Role.valueOf(getPermissionRole()),
        positionId = getPositionId()?.let { PositionId(UUID.fromString(it)) },
        position = getPosition()?.let(::PositionLabel),
        onboarded = getOnboarded(),
    )

    override fun findRole(teamId: TeamId, userId: UserId): Role? =
        jpaRepository.findByTeamIdAndUserIdAndActiveTrue(teamId.value, userId.value)
            ?.role
            ?.let { role -> Role.entries.firstOrNull { it.name == role } }

    override fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting? =
        jpaRepository.findTeamRouting(teamId.value, userId.value)?.toDomain()

    // Null on 0 rows AND on 2: "several teams" is not a routing, it is a question for the user.
    override fun findSoleTenantRouting(userId: UserId): TenantRouting? =
        jpaRepository.findTeamRoutings(userId.value).singleOrNull()?.toDomain()

    private fun TeamRoutingProjection.toDomain() =
        TenantRouting(teamId = TeamId(teamId), schemaName = SchemaName(schemaName))

    @Transactional
    override fun updateRole(teamId: TeamId, userId: UserId, role: Role) {
        jpaRepository.updateRole(teamId.value, userId.value, role.name)
    }

    @Transactional
    override fun deactivate(teamId: TeamId, userId: UserId) {
        jpaRepository.deactivate(teamId.value, userId.value)
    }

    @Transactional
    override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) {
        jpaRepository.assignPosition(teamId.value, userId.value, positionId?.value)
    }

    @Transactional
    override fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: DisplayName,
        role: Role,
        positionId: PositionId?,
        markOnboardedAt: Instant?,
    ) {
        userJpaRepository.updateDisplayName(userId.value, displayName.value)
        jpaRepository.updateRole(teamId.value, userId.value, role.name)
        jpaRepository.assignPosition(teamId.value, userId.value, positionId?.value)
        if (markOnboardedAt != null) {
            jpaRepository.markOnboarded(teamId.value, userId.value, markOnboardedAt.atOffset(ZoneOffset.UTC))
        }
    }

    @Transactional
    override fun markOnboarded(teamId: TeamId, userId: UserId, at: Instant) {
        jpaRepository.markOnboarded(teamId.value, userId.value, at.atOffset(ZoneOffset.UTC))
    }

    override fun countAdmins(teamId: TeamId): Int = jpaRepository.countActiveAdmins(teamId.value)

    @Transactional
    override fun addMember(teamId: TeamId, userId: UserId) {
        if (jpaRepository.findByTeamIdAndUserIdAndActiveTrue(teamId.value, userId.value) != null) return
        // (team_id, user_id) is UNIQUE, so an insert cannot re-join a member whose row is inactive.
        if (jpaRepository.reactivateAsUser(teamId.value, userId.value) > 0) return
        try {
            jpaRepository.save(
                TeamMemberJpaEntity(teamId = teamId.value, userId = userId.value, role = Role.USER.name),
            )
        } catch (e: DataIntegrityViolationException) {
            // Lost a race with a concurrent accept — the other one made them a member, which is the
            // outcome this call wanted anyway.
            logger.info("Concurrent accept for team {} / user {} — already a member", teamId, userId, e)
        }
    }
}
