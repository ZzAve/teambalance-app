package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
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

private const val OPERATOR_ID = "b8320000-0000-0000-0000-0000000000f2"
private const val OPERATOR_EMAIL = "money-operator@test.com"

/**
 * A Platform Admin acting as a team holds the Virtual Member, a synthesized ADMIN (ADR-0024 §2), so
 * the admin-only money pool settings are open to them like to a real Admin.
 */
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.platform-admins=$OPERATOR_EMAIL"])
class MoneyPoolActAsIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        afterTest {
            jdbcTemplate.update("DELETE FROM public.act_as_sessions WHERE created_by = ?::uuid", OPERATOR_ID)
            jdbcTemplate.update("DELETE FROM public.users WHERE id = ?::uuid", OPERATOR_ID)
            jdbcTemplate.update("UPDATE ${CalendarLinkFixture.ALPHA_SCHEMA}.money_pool_settings SET beer_price_cents = NULL WHERE id = 1")
        }

        beforeTest {
            CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter)
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$OPERATOR_ID'::uuid, '$OPERATOR_EMAIL', 'Money Operator') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.update("DELETE FROM public.act_as_sessions WHERE created_by = ?::uuid", OPERATOR_ID)
        }

        test("a Platform Admin acting as the team reads and replaces the money pool settings") {
            enterActAs()

            dispatch(MockMvcRequestBuilders.get("/api/team/money-pool/settings").with(loginAs(OPERATOR_ID)))
                .andExpect(status().isOk)

            dispatch(
                MockMvcRequestBuilders.put("/api/team/money-pool/settings")
                    .with(loginAs(OPERATOR_ID))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{ "enabled": true, "beerPrice": 300, "bunqMeLink": null }"""),
            ).andExpect(status().isOk).andExpect(jsonPath("$.beerPrice").value(300))
        }
    }

    private fun dispatch(builder: MockHttpServletRequestBuilder): ResultActions =
        mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun enterActAs() = dispatch(
        MockMvcRequestBuilders.post("/api/admin/act-as")
            .with(loginAs(OPERATOR_ID))
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"teamId":"$ALPHA_TEAM"}"""),
    ).andExpect(status().isOk)
}
