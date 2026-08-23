package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.util.UUID

/**
 * The platform-level reads behind the Team switcher and the authorized switch (#143, ADR-0023).
 * Both replaced an `ORDER BY tm.team_id LIMIT 1` that answered "the user's team" by picking one in
 * UUID order — so what matters here is that a user with several Teams gets *all* of them, and that
 * a slug resolves without saying anything about who may have it.
 */
class JdbcTeamRepositoryAdapterTest : TeamBalanceIT() {

    @Autowired
    lateinit var teamRepository: TeamRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("findTeamsOf returns every active membership, not one of them") {
            val userId = seedUser()
            val first = seedTeam("Zulu Squad")
            val second = seedTeam("Alpha Squad")
            seedMembership(userId, first)
            seedMembership(userId, second)

            teamRepository.findTeamsOf(userId).map { it.name.value } shouldBe listOf("Alpha Squad", "Zulu Squad")
        }

        test("findTeamsOf drops a deactivated membership") {
            val userId = seedUser()
            val stays = seedTeam("Stays")
            val left = seedTeam("Left")
            seedMembership(userId, stays)
            seedMembership(userId, left, active = false)

            teamRepository.findTeamsOf(userId).map { it.name.value } shouldBe listOf("Stays")
        }

        test("findTeamsOf is empty for a teamless user") {
            teamRepository.findTeamsOf(seedUser()).shouldBeEmpty()
        }

        // Team names are deliberately not unique (the slug is the unique address), so the order has
        // to be TOTAL or the switcher list reshuffles between requests. Which of the two comes first
        // is not the point and is not asserted — that it is the same one every time is.
        test("findTeamsOf orders stably when two teams share a name") {
            val userId = seedUser()
            seedMembership(userId, seedTeam("Heren 3"))
            seedMembership(userId, seedTeam("Heren 3"))

            val first = teamRepository.findTeamsOf(userId).map { it.id.value }
            first shouldHaveSize 2
            repeat(3) { teamRepository.findTeamsOf(userId).map { it.id.value } shouldBe first }
        }

        // The slug is a Team's public address, so resolving one says nothing about membership —
        // authorization is a separate step, and keeping them separate is what lets "not yours" and
        // "no such team" answer identically at the edge.
        test("findBySlug resolves a team regardless of who is asking") {
            val teamId = seedTeam("Someone Else's Team", slug = "someone-elses-team")

            teamRepository.findBySlug(Slug("someone-elses-team")).shouldNotBeNull().id.value shouldBe teamId
        }

        test("findBySlug is null for an unknown slug") {
            teamRepository.findBySlug(Slug("no-such-team-${UUID.randomUUID()}")).shouldBeNull()
        }
    }

    private fun seedUser(): UUID {
        tenantSchemaAdapter.provisionPlatformSchema()
        val userId = UUID.randomUUID()
        jdbcTemplate.update(
            "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
            userId, "teams-$userId@test.com", "Test Member",
        )
        return userId
    }

    private fun seedTeam(name: String, slug: String? = null): UUID {
        tenantSchemaAdapter.provisionPlatformSchema()
        val teamId = UUID.randomUUID()
        jdbcTemplate.update(
            "INSERT INTO public.teams (id, name, slug, schema_name) VALUES (?, ?, ?, ?)",
            teamId, name, slug ?: "team-$teamId", "team_${teamId.toString().replace("-", "")}",
        )
        return teamId
    }

    private fun seedMembership(userId: UUID, teamId: UUID, active: Boolean = true) {
        jdbcTemplate.update(
            "INSERT INTO public.team_members (team_id, user_id, role, active) VALUES (?, ?, 'USER', ?)",
            teamId, userId, active,
        )
    }
}
