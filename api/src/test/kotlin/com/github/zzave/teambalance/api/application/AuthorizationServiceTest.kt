package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

private class FakeTeamMemberRepository(private val roles: Map<Pair<TeamId, UserId>, Role>) : TeamMemberRepository {
    override fun findByTeamId(teamId: TeamId) = emptyList<TeamMember>()
    override fun findDisplayName(userId: UserId): DisplayName? = null
    override fun findMembersByUserIds(userIds: Set<UserId>) = emptyMap<UserId, TeamMember>()
    override fun findRole(teamId: TeamId, userId: UserId): Role? = roles[teamId to userId]
    override fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting? = null
    override fun findSoleTenantRouting(userId: UserId): TenantRouting? = null
    override fun addMember(teamId: TeamId, userId: UserId) = Unit
    override fun updateRole(teamId: TeamId, userId: UserId, role: Role) = Unit
    override fun deactivate(teamId: TeamId, userId: UserId) = Unit
    override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) = Unit
    override fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: DisplayName,
        role: Role,
        positionId: PositionId?,
        markOnboardedAt: java.time.Instant?,
    ) = Unit
    override fun markOnboarded(teamId: TeamId, userId: UserId, at: java.time.Instant) = Unit
    override fun countAdmins(teamId: TeamId): Int = 0
}

class AuthorizationServiceTest : FunSpec() {

    init {
        val teamId = TeamId(UUID.randomUUID())
        val otherTeamId = TeamId(UUID.randomUUID())
        val adminId = UserId.random()
        val memberId = UserId.random()
        val strangerId = UserId.random()

        val service = AuthorizationService(
            FakeTeamMemberRepository(
                mapOf(
                    (teamId to adminId) to Role.ADMIN,
                    (teamId to memberId) to Role.USER,
                ),
            ),
        )

        test("isAdmin is true for a user with the ADMIN role on that team") {
            service.isAdmin(adminId, teamId) shouldBe true
        }

        test("isAdmin is false for a non-admin member of that team") {
            service.isAdmin(memberId, teamId) shouldBe false
        }

        test("isAdmin is false for a user with no team_members row for that team") {
            service.isAdmin(strangerId, teamId) shouldBe false
        }

        test("isAdmin is false for an admin of a different team (cross-team isolation)") {
            service.isAdmin(adminId, otherTeamId) shouldBe false
        }

        test("requireAdmin passes through silently for an admin") {
            service.requireAdmin(adminId, teamId)
        }

        test("requireAdmin throws NotTeamAdminException for a non-admin") {
            shouldThrow<NotTeamAdminException> {
                service.requireAdmin(memberId, teamId)
            }
        }

        test("isMember is true for any active member of that team, admin or not") {
            service.isMember(adminId, teamId) shouldBe true
            service.isMember(memberId, teamId) shouldBe true
        }

        test("isMember is false for a user with no membership on that team") {
            service.isMember(strangerId, teamId) shouldBe false
        }

        test("isMember is false for a member of a different team (cross-team isolation)") {
            service.isMember(memberId, otherTeamId) shouldBe false
        }

        test("requireMember passes through silently for a plain (non-admin) member") {
            service.requireMember(memberId, teamId)
        }

        test("requireMember throws NoTeamMembershipException for a non-member") {
            shouldThrow<NoTeamMembershipException> {
                service.requireMember(strangerId, teamId)
            }
        }
    }
}
