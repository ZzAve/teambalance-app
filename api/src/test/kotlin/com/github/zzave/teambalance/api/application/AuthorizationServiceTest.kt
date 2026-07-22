package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

private class FakeTeamMemberRepository(private val roles: Map<Pair<UUID, UUID>, Role>) : TeamMemberRepository {
    override fun findByTeamId(teamId: UUID) = emptyList<TeamMember>()
    override fun findDisplayName(userId: UUID): String? = null
    override fun findMembersByUserIds(userIds: Set<UUID>) = emptyMap<UUID, TeamMember>()
    override fun findRole(teamId: UUID, userId: UUID): Role? = roles[teamId to userId]
    override fun findTeamId(userId: UUID): UUID? = null
    override fun addMember(teamId: UUID, userId: UUID) = Unit
    override fun updateRole(teamId: UUID, userId: UUID, role: Role) = Unit
    override fun deactivate(teamId: UUID, userId: UUID) = Unit
    override fun assignPosition(teamId: UUID, userId: UUID, positionId: UUID?) = Unit
    override fun markOnboarded(teamId: UUID, userId: UUID, at: java.time.Instant) = Unit
    override fun countAdmins(teamId: UUID): Int = 0
}

class AuthorizationServiceTest : FunSpec() {

    init {
        val teamId = UUID.randomUUID()
        val otherTeamId = UUID.randomUUID()
        val adminId = UUID.randomUUID()
        val memberId = UUID.randomUUID()
        val strangerId = UUID.randomUUID()

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
    }
}
