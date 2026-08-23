package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Instant
import java.util.UUID

class JpaTeamMemberRepositoryAdapterTest : TeamBalanceIT() {

    @Autowired
    lateinit var teamMemberRepository: TeamMemberRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

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

        // A freshly-seeded member has onboarded_at NULL (onboarded=false); markOnboarded stamps it so the
        // mapped onboarded flag flips to true. The NULL/NOT-NULL mapping lives in the query, so it can
        // only be proven against a real database.
        test("markOnboarded stamps onboarded_at so the member maps to onboarded=true") {
            val (teamId, userId) = seedMember(role = "USER", active = true)
            teamMemberRepository.findByTeamId(teamId).first { it.userId == userId }.onboarded shouldBe false
            teamMemberRepository.markOnboarded(teamId, userId, Instant.parse("2026-07-22T10:00:00Z"))
            teamMemberRepository.findByTeamId(teamId).first { it.userId == userId }.onboarded shouldBe true
        }

        // The tenant-resolution seam (ADR-0021 §1). Only a real database can prove these: the team id
        // is a parameter and the membership predicate IS the authorization, so the SQL is the check.
        test("findTenantRouting resolves schema and team id together for a member of that team") {
            val (teamId, userId) = seedMember(role = "USER", active = true)
            val routing = teamMemberRepository.findTenantRouting(teamId, userId)
            routing?.teamId shouldBe teamId
            routing?.schemaName?.value shouldBe schemaNameOf(teamId)
        }

        test("findTenantRouting is null for a team the user is not a member of") {
            val (teamId, _) = seedMember(role = "USER", active = true)
            val (_, stranger) = seedMember(role = "USER", active = true)
            teamMemberRepository.findTenantRouting(teamId, stranger) shouldBe null
        }

        test("findTenantRouting is null once the membership is deactivated") {
            val (teamId, userId) = seedMember(role = "USER", active = true)
            teamMemberRepository.deactivate(teamId, userId)
            teamMemberRepository.findTenantRouting(teamId, userId) shouldBe null
        }

        test("findSoleTenantRouting resolves the only team a user belongs to") {
            val (teamId, userId) = seedMember(role = "USER", active = true)
            teamMemberRepository.findSoleTenantRouting(userId)?.teamId shouldBe teamId
        }

        // The deleted `ORDER BY team_id LIMIT 1` answered here with an arbitrary UUID-ordered pick.
        test("findSoleTenantRouting is null once the user belongs to two teams") {
            val (_, userId) = seedMember(role = "USER", active = true)
            val (second, _) = seedMember(role = "USER", active = true)
            teamMemberRepository.addMember(second, userId)

            teamMemberRepository.findSoleTenantRouting(userId) shouldBe null
        }

        test("findSoleTenantRouting is null for a user with no team at all") {
            teamMemberRepository.findSoleTenantRouting(UserId(seedUser())) shouldBe null
        }
    }

    private fun schemaNameOf(teamId: TeamId) = "team_${teamId.value.toString().replace("-", "")}"

    private fun seedMember(role: String, active: Boolean): Pair<TeamId, UserId> {
        tenantSchemaAdapter.provisionPlatformSchema()
        val teamId = TeamId(UUID.randomUUID())
        val schemaName = schemaNameOf(teamId)
        jdbcTemplate.update(
            "INSERT INTO public.teams (id, name, slug, schema_name) VALUES (?, ?, ?, ?)",
            teamId.value, "Test Team", "test-team-$teamId", schemaName,
        )
        val userId = seedMemberOnTeam(teamId, role, active)
        return teamId to userId
    }

    private fun seedUser(): UUID {
        tenantSchemaAdapter.provisionPlatformSchema()
        val userId = UUID.randomUUID()
        jdbcTemplate.update(
            "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
            userId, "member-$userId@test.com", "Test Member",
        )
        return userId
    }

    private fun seedMemberOnTeam(teamId: TeamId, role: String, active: Boolean): UserId {
        val userId = UserId(seedUser())
        jdbcTemplate.update(
            "INSERT INTO public.team_members (team_id, user_id, role, active) VALUES (?, ?, ?, ?)",
            teamId.value, userId.value, role, active,
        )
        return userId
    }
}
