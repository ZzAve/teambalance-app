package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.UserContext
import com.github.zzave.teambalance.api.infrastructure.persistence.SpringDataTeamMemberRepository
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.mock.web.MockHttpSession
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

        test("second request on the same session resolves from the cached schema without a DB lookup") {
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

            val session = MockHttpSession()

            // First request resolves from the DB and memoizes the schema in the session.
            UserContext.set(userId)
            val (firstSchema, firstWasSet) = runFilter(session)
            firstWasSet shouldBe true
            firstSchema shouldBe schemaName

            // Remove the backing row so a DB lookup would now resolve to nothing.
            jdbcTemplate.update("DELETE FROM public.team_members WHERE user_id = ?", userId)

            // Second request on the same session still resolves — only possible from the session cache.
            UserContext.set(userId)
            val (secondSchema, secondWasSet) = runFilter(session)
            secondWasSet shouldBe true
            secondSchema shouldBe schemaName
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

    private fun runFilter(session: MockHttpSession? = null): Pair<String?, Boolean> {
        val filter = SessionTenantContextFilter(springDataTeamMemberRepository)
        val request = MockHttpServletRequest().apply { session?.let { setSession(it) } }
        var schema: String? = null
        var wasSet = false
        filter.doFilter(request, MockHttpServletResponse()) { _, _ ->
            schema = TenantContext.get()
            wasSet = TenantContext.isSet()
        }
        return schema to wasSet
    }
}
