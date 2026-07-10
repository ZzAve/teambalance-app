package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

private class FakeTeamMemberRepository(private val roles: Map<Pair<UUID, UUID>, String>) : TeamMemberRepository {
    override fun findByTeamId(teamId: UUID) = emptyList<com.github.zzave.teambalance.api.domain.model.TeamMember>()
    override fun findDisplayName(userId: UUID): String? = null
    override fun findMembersByUserIds(userIds: Set<UUID>) = emptyMap<UUID, com.github.zzave.teambalance.api.domain.model.TeamMember>()
    override fun findSchemaNameForUser(userId: UUID): String? = null
    override fun findRole(teamId: UUID, userId: UUID): String? = roles[teamId to userId]
}

class AuthorizationServiceTest : FunSpec() {

    init {
        val teamId = UUID.randomUUID()
        val adminId = UUID.randomUUID()
        val memberId = UUID.randomUUID()
        val strangerId = UUID.randomUUID()

        val service = AuthorizationService(
            FakeTeamMemberRepository(
                mapOf(
                    (teamId to adminId) to "ADMIN",
                    (teamId to memberId) to "USER",
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
