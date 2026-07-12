package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.UserContext
import com.github.zzave.teambalance.api.infrastructure.persistence.SpringDataTeamMemberRepository
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import java.util.UUID

class SessionTenantContextFilterTest : TeamBalanceIT() {

    @Autowired
    lateinit var springDataTeamMemberRepository: SpringDataTeamMemberRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        afterTest {
            TenantContext.clear()
            UserContext.clear()
        }

        test("session user with a team_members row resolves to their tenant schema") {
            tenantSchemaManager.provisionPlatformSchema()
            val userId = UUID.randomUUID()
            val teamId = UUID.randomUUID()
            val schemaName = "team_${teamId.toString().replace("-", "")}"

            jdbcTemplate.update(
                "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
                userId, "member-$userId@test.com", "Test Member",
            )
            jdbcTemplate.update(
                "INSERT INTO public.teams (id, name, slug, sport, schema_name) VALUES (?, ?, ?, ?, ?)",
                teamId, "Test Team", "test-team-$teamId", "Volleyball", schemaName,
            )
            jdbcTemplate.update(
                "INSERT INTO public.team_members (team_id, user_id, role, team_role) VALUES (?, ?, 'USER', 'Setter')",
                teamId, userId,
            )

            // SessionUserContextFilter (order +2) would have set UserContext before this filter runs.
            UserContext.set(userId)
            val (schema, wasSet) = runFilter()

            wasSet shouldBe true
            schema shouldBe schemaName
            TenantContext.isSet() shouldBe false
        }

        test("session user with no team_members row falls through with no silent fallback") {
            tenantSchemaManager.provisionPlatformSchema()
            val userId = UUID.randomUUID()

            jdbcTemplate.update(
                "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
                userId, "teamless-$userId@test.com", "Teamless User",
            )

            UserContext.set(userId)
            val (schema, wasSet) = runFilter()

            wasSet shouldBe false
            schema shouldBe "public"
            TenantContext.isSet() shouldBe false
        }
    }

    private fun runFilter(): Pair<String?, Boolean> {
        val filter = SessionTenantContextFilter(springDataTeamMemberRepository)
        var schema: String? = null
        var wasSet = false
        filter.doFilter(MockHttpServletRequest(), MockHttpServletResponse()) { _, _ ->
            schema = TenantContext.get()
            wasSet = TenantContext.isSet()
        }
        return schema to wasSet
    }
}
