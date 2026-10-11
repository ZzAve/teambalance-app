package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

private const val MEMBER_USER_ID = "b0000000-0000-0000-0000-0000000000b9"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

/**
 * Covers the money pool read path (ADR-0042) against the fake Bunq gateway. All tests share the
 * single 'public' tenant schema, so each one that changes the switch or the connection restores
 * the defaults (enabled, not connected) in a finally.
 */
@AutoConfigureMockMvc
class MoneyPoolControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("GET /api/team/money-pool is NotConnected when the team has no Bunq connection") {
            seedTeamAndMember()
            resetMoneyPool()

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("NotConnected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").doesNotExist())
        }

        test("GET /api/team/money-pool is Off when the switch is off, even with a connection") {
            seedTeamAndMember()
            connectBunq()
            jdbcTemplate.update("UPDATE public.money_pool_settings SET enabled = false WHERE id = 1")
            try {
                getMoneyPool()
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Off"))
            } finally {
                resetMoneyPool()
            }
        }

        test("GET /api/team/money-pool is Connected with balance and payments, exposing no IBAN or description") {
            seedTeamAndMember()
            connectBunq()
            try {
                getMoneyPool()
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Connected"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(18750))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].name").isNotEmpty)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].direction").isNotEmpty)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].iban").doesNotExist())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].description").doesNotExist())
            } finally {
                resetMoneyPool()
            }
        }
    }

    private fun getMoneyPool(): ResultActions =
        mockMvc.perform(MockMvcRequestBuilders.get("/api/team/money-pool").with(loginAs(MEMBER_USER_ID, tenant = "public")))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun connectBunq() {
        jdbcTemplate.update(
            "INSERT INTO public.bunq_connection (id, bunq_account_id, connected_at) VALUES (1, 'test-account', now())",
        )
    }

    private fun resetMoneyPool() {
        jdbcTemplate.update("DELETE FROM public.bunq_connection")
        jdbcTemplate.update("UPDATE public.money_pool_settings SET enabled = true WHERE id = 1")
    }

    private fun seedTeamAndMember() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$MEMBER_USER_ID'::uuid, 'money-member@test.com', 'Money Member')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute(
            "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$MEMBER_USER_ID'::uuid, 'USER', 'Setter')",
        )
    }
}
