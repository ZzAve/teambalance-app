package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_TEAM
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

private const val OPERATOR_ID = "b8320000-0000-0000-0000-0000000000f1"
private const val OPERATOR_EMAIL = "cal-link-operator@test.com"

/**
 * Calendar links are closed under **Act-as** (ADR-0032, ADR-0024).
 *
 * Worth its own spec because the failure mode is quiet: a Platform Admin inside a team holds a
 * **Virtual Member** that satisfies `AuthorizationService.requireMember` exactly as a real membership
 * does, so *without* the refusal these endpoints would simply work — and the operator would mint a
 * year-long standing credential in somebody else's team, or delete one a member relies on, with only
 * the generic Act-as Record to show for it. The check has to come before the membership one, and this
 * is what says so.
 *
 * Its own context because act-as needs the platform-admin allowlist, which is empty (fail-closed) in
 * the shared test profile.
 */
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.platform-admins=$OPERATOR_EMAIL"])
class CalendarLinkActAsIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest {
            CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter)
            // Structurally teamless (ADR-0024 §3) — act-as refuses entry otherwise.
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$OPERATOR_ID'::uuid, '$OPERATOR_EMAIL', 'Cal Operator') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.update("DELETE FROM public.act_as_sessions WHERE created_by = ?::uuid", OPERATOR_ID)
        }

        test("listing is refused while acting as the team") {
            enterActAs()

            dispatch(get(OPERATOR_ID)).andExpect(status().isForbidden)
                .andExpect(jsonPath("$.code").value("ACT_AS_NOT_PERMITTED"))
        }

        test("creating is refused while acting as the team") {
            enterActAs()

            dispatch(post(OPERATOR_ID)).andExpect(status().isForbidden)
                .andExpect(jsonPath("$.code").value("ACT_AS_NOT_PERMITTED"))
        }

        test("deleting is refused while acting as the team") {
            enterActAs()

            dispatch(
                MockMvcRequestBuilders.delete("/api/calendar-links/00000000-0000-0000-0000-000000000000")
                    .header("X-User-Id", OPERATOR_ID),
            ).andExpect(status().isForbidden).andExpect(jsonPath("$.code").value("ACT_AS_NOT_PERMITTED"))
        }

        // The refusal is about the grant, not about the endpoint: an ordinary member in the same team
        // is unaffected, which is what makes it a scoped rule rather than a switched-off feature.
        test("an ordinary member of the same team is unaffected") {
            enterActAs()

            dispatch(post(ALPHA_MEMBER)).andExpect(status().isCreated)
        }
    }

    private fun dispatch(builder: MockHttpServletRequestBuilder): ResultActions =
        mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun get(userId: String) =
        MockMvcRequestBuilders.get("/api/calendar-links").header("X-User-Id", userId)

    private fun post(userId: String) =
        MockMvcRequestBuilders.post("/api/calendar-links")
            .header("X-User-Id", userId)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}")

    private fun enterActAs() = dispatch(
        MockMvcRequestBuilders.post("/api/admin/act-as")
            .header("X-User-Id", OPERATOR_ID)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"teamId":"$ALPHA_TEAM"}"""),
    ).andExpect(status().isOk)
}
