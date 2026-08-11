package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.identity.UserContext
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.mock.web.MockHttpSession
import java.util.UUID

class SessionTenantContextFilterTest : TeamBalanceIT() {

    @Autowired
    lateinit var teamMemberRepository: TeamMemberRepository

    @Autowired
    lateinit var currentUserGateway: CurrentUserGateway

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        afterTest {
            TenantContext.clear()
            CurrentTeamContext.clear()
            UserContext.clear()
        }

        test("session user with a team_members row resolves schema and team id from the same row") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val userId = UUID.randomUUID()
            val teamId = UUID.randomUUID()
            val schemaName = "team_${teamId.toString().replace("-", "")}"
            seedMember(userId, teamId, schemaName)

            // SessionUserContextFilter (order +2) would have set UserContext before this filter runs.
            UserContext.set(userId)
            val resolved = runFilter()

            resolved.wasSet shouldBe true
            resolved.schema shouldBe schemaName
            resolved.teamId shouldBe teamId
            TenantContext.isSet() shouldBe false
        }

        test("second request on the same session resolves schema and team id from cache without a DB lookup") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val userId = UUID.randomUUID()
            val teamId = UUID.randomUUID()
            val schemaName = "team_${teamId.toString().replace("-", "")}"
            seedMember(userId, teamId, schemaName)

            val session = MockHttpSession()

            // First request resolves from the DB and memoizes schema + team id on the session.
            UserContext.set(userId)
            val first = runFilter(session)
            first.wasSet shouldBe true
            first.schema shouldBe schemaName
            first.teamId shouldBe teamId

            // Remove the backing row so a DB lookup would now resolve to nothing.
            jdbcTemplate.update("DELETE FROM public.team_members WHERE user_id = ?", userId)

            // Second request on the same session still resolves both — only possible from the cache.
            UserContext.set(userId)
            val second = runFilter(session)
            second.wasSet shouldBe true
            second.schema shouldBe schemaName
            second.teamId shouldBe teamId
        }

        test("session user with no team_members row falls through with no silent fallback") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val userId = UUID.randomUUID()

            jdbcTemplate.update(
                "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
                userId, "teamless-$userId@test.com", "Teamless User",
            )

            UserContext.set(userId)
            val resolved = runFilter()

            resolved.wasSet shouldBe false
            resolved.schema shouldBe "public"
            resolved.teamId shouldBe null
            TenantContext.isSet() shouldBe false
        }
    }

    private fun seedMember(userId: UUID, teamId: UUID, schemaName: String) {
        jdbcTemplate.update(
            "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
            userId, "member-$userId@test.com", "Test Member",
        )
        jdbcTemplate.update(
            "INSERT INTO public.teams (id, name, slug, schema_name) VALUES (?, ?, ?, ?)",
            teamId, "Test Team", "test-team-$teamId", schemaName,
        )
        jdbcTemplate.update(
            "INSERT INTO public.team_members (team_id, user_id, role) VALUES (?, ?, 'USER')",
            teamId, userId,
        )
    }

    private data class Resolved(val schema: String?, val teamId: UUID?, val wasSet: Boolean)

    private fun runFilter(session: MockHttpSession? = null): Resolved {
        val filter = SessionTenantContextFilter(teamMemberRepository, currentUserGateway)
        val request = MockHttpServletRequest().apply { session?.let { setSession(it) } }
        var resolved = Resolved(null, null, false)
        filter.doFilter(request, MockHttpServletResponse()) { _, _ ->
            resolved = Resolved(TenantContext.get(), CurrentTeamContext.get(), TenantContext.isSet())
        }
        return resolved
    }
}
