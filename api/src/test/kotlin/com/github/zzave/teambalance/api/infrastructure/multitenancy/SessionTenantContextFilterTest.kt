package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.identity.SessionKeys
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import java.util.UUID

class SessionTenantContextFilterTest : TeamBalanceIT() {

    @Autowired
    lateinit var teamMemberRepository: TeamMemberRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        afterTest { TenantContext.clear() }

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

            val filter = SessionTenantContextFilter(teamMemberRepository)
            val request = MockHttpServletRequest()
            request.getSession(true)!!.setAttribute(SessionKeys.USER_ID, userId.toString())
            val response = MockHttpServletResponse()

            var resolvedDuringChain: String? = null
            var wasSetDuringChain = false
            filter.doFilter(request, response) { _, _ ->
                resolvedDuringChain = TenantContext.get()
                wasSetDuringChain = TenantContext.isSet()
            }

            wasSetDuringChain shouldBe true
            resolvedDuringChain shouldBe schemaName
            TenantContext.isSet() shouldBe false
        }

        test("session user with no team_members row falls through with no silent fallback") {
            tenantSchemaManager.provisionPlatformSchema()
            val userId = UUID.randomUUID()

            jdbcTemplate.update(
                "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
                userId, "teamless-$userId@test.com", "Teamless User",
            )

            val filter = SessionTenantContextFilter(teamMemberRepository)
            val request = MockHttpServletRequest()
            request.getSession(true)!!.setAttribute(SessionKeys.USER_ID, userId.toString())
            val response = MockHttpServletResponse()

            var resolvedDuringChain: String? = null
            var wasSetDuringChain = false
            filter.doFilter(request, response) { _, _ ->
                resolvedDuringChain = TenantContext.get()
                wasSetDuringChain = TenantContext.isSet()
            }

            wasSetDuringChain shouldBe false
            resolvedDuringChain shouldBe "public"
            TenantContext.isSet() shouldBe false
        }
    }
}
