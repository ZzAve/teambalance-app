package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.util.UUID

class JpaTeamMemberRepositoryAdapterTest : TeamBalanceIT() {

    @Autowired
    lateinit var teamMemberRepository: TeamMemberRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        test("findRole returns the mapped Role for an active member") {
            val (teamId, userId) = seedMember(role = "ADMIN", active = true)
            teamMemberRepository.findRole(teamId, userId) shouldBe Role.ADMIN
        }

        // The security boundary: a deactivated admin must NOT count as an admin. The active=true
        // filter lives in the JPA query, so this can only be proven against a real database.
        test("findRole returns null for a deactivated admin (active = false)") {
            val (teamId, userId) = seedMember(role = "ADMIN", active = false)
            teamMemberRepository.findRole(teamId, userId) shouldBe null
        }

        test("updateRole persists a new role for the member") {
            val (teamId, userId) = seedMember(role = "USER", active = true)
            teamMemberRepository.updateRole(teamId, userId, Role.ADMIN)
            teamMemberRepository.findRole(teamId, userId) shouldBe Role.ADMIN
        }

        test("deactivate flips active to false so the member drops from findRole and findByTeamId") {
            val (teamId, userId) = seedMember(role = "ADMIN", active = true)
            teamMemberRepository.deactivate(teamId, userId)
            teamMemberRepository.findRole(teamId, userId) shouldBe null
            teamMemberRepository.findByTeamId(teamId).any { it.userId == userId } shouldBe false
        }

        test("countAdmins counts only active ADMIN members of the team") {
            val (teamId, _) = seedMember(role = "ADMIN", active = true)
            seedMemberOnTeam(teamId, role = "USER", active = true)
            seedMemberOnTeam(teamId, role = "ADMIN", active = false)
            teamMemberRepository.countAdmins(teamId) shouldBe 1
        }
    }

    private fun seedMember(role: String, active: Boolean): Pair<UUID, UUID> {
        tenantSchemaManager.provisionPlatformSchema()
        val teamId = UUID.randomUUID()
        val schemaName = "team_${teamId.toString().replace("-", "")}"
        jdbcTemplate.update(
            "INSERT INTO public.teams (id, name, slug, sport, schema_name) VALUES (?, ?, ?, ?, ?)",
            teamId, "Test Team", "test-team-$teamId", "Volleyball", schemaName,
        )
        val userId = seedMemberOnTeam(teamId, role, active)
        return teamId to userId
    }

    private fun seedMemberOnTeam(teamId: UUID, role: String, active: Boolean): UUID {
        val userId = UUID.randomUUID()
        jdbcTemplate.update(
            "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
            userId, "member-$userId@test.com", "Test Member",
        )
        jdbcTemplate.update(
            "INSERT INTO public.team_members (team_id, user_id, role, active) VALUES (?, ?, ?, ?)",
            teamId, userId, role, active,
        )
        return userId
    }
}
