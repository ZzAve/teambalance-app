package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_TEAM
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.LEAVER
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/** The default deployment: connecting Bunq is hidden and unreachable, not merely not offered. */
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.bunq.connect-enabled=false"])
class BunqConnectDisabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("starting a connection is a 404 for an admin, and nothing is stored") {
            api(post("/api/team/money-pool/connection"), ALPHA_MEMBER).andExpect(status().isNotFound)

            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.bunq_oauth_states WHERE team_id = ?::uuid",
                Int::class.java,
                ALPHA_TEAM,
            ) shouldBe 0
        }

        test("starting a connection is a 404 for a member too") {
            api(post("/api/team/money-pool/connection"), LEAVER).andExpect(status().isNotFound)
        }

        test("the admin's status says connecting is not available") {
            api(get("/api/team/money-pool/connection"), ALPHA_MEMBER)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.connectAvailable").value(false))
        }
    }

    private fun api(builder: MockHttpServletRequestBuilder, userId: String): ResultActions =
        mockMvc.perform(builder.with(loginAs(userId)))
            .andExpect(request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(asyncDispatch(it)) }
}
