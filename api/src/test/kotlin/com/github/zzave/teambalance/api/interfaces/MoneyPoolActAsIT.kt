package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.infrastructure.config.BunqGrantCipherConfiguration
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_TEAM
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_TEAM
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
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
import org.springframework.web.util.UriComponentsBuilder
import tools.jackson.databind.ObjectMapper
import java.net.URI
import java.util.UUID

private const val OPERATOR_ID = "b8320000-0000-0000-0000-0000000000f2"
private const val OPERATOR_EMAIL = "money-operator@test.com"

/**
 * A Platform Admin acting as a team holds the Virtual Member, a synthesized ADMIN (ADR-0024 §2), so
 * the admin-only money pool settings are open to them like to a real Admin.
 */
@AutoConfigureMockMvc
@Import(SwitchableBunqGatewayConfig::class)
@TestPropertySource(properties = ["teambalance.platform-admins=$OPERATOR_EMAIL"])
class MoneyPoolActAsIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var bunqGateway: SwitchableBunqGateway

    @Autowired
    lateinit var moneyPoolCache: MoneyPoolCacheGateway

    @Autowired
    @Qualifier(BunqGrantCipherConfiguration.BEAN_NAME)
    lateinit var grantCipher: TokenCipher

    init {
        afterTest {
            listOf(ALPHA_TEAM, BETA_TEAM).forEach { team -> moneyPoolCache.evict(TeamId(UUID.fromString(team))) }
            jdbcTemplate.update("DELETE FROM ${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection")
            jdbcTemplate.update("DELETE FROM ${CalendarLinkFixture.BETA_SCHEMA}.bunq_connection")
            jdbcTemplate.update("DELETE FROM public.bunq_oauth_states WHERE admin_user_id = ?::uuid", OPERATOR_ID)
            jdbcTemplate.update("DELETE FROM public.act_as_sessions WHERE created_by = ?::uuid", OPERATOR_ID)
            jdbcTemplate.update("DELETE FROM public.users WHERE id = ?::uuid", OPERATOR_ID)
            jdbcTemplate.update(
                "UPDATE ${CalendarLinkFixture.ALPHA_SCHEMA}.money_pool_settings " +
                    "SET beer_price_cents = NULL, bunq_me_link = NULL WHERE id = 1",
            )
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

        test("a Platform Admin acting as the team cannot get a top-up link, which would carry their id as a member") {
            jdbcTemplate.update(
                "UPDATE ${CalendarLinkFixture.ALPHA_SCHEMA}.money_pool_settings SET bunq_me_link = 'https://bunq.me/alpha' WHERE id = 1",
            )
            enterActAs()

            dispatch(MockMvcRequestBuilders.get("/api/team/money-pool/top-up-link?amount=20").with(loginAs(OPERATOR_ID)))
                .andExpect(status().isForbidden)
                .andExpect(jsonPath("$.code").value("ACT_AS_NOT_PERMITTED"))
        }

        test("a Platform Admin acting as the team starts and completes a Bunq connection with their session") {
            enterActAs()

            connectAsOperator()

            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM ${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection", Int::class.java,
            ) shouldBe 1
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM ${CalendarLinkFixture.BETA_SCHEMA}.bunq_connection", Int::class.java,
            ) shouldBe 0
        }

        test("a Platform Admin acting as the team lists the accounts, picks one and disconnects") {
            enterActAs()
            connectAsOperator()

            dispatch(MockMvcRequestBuilders.get("/api/team/money-pool/connection/account").with(loginAs(OPERATOR_ID)))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.accounts.length()").value(2))
            dispatch(
                MockMvcRequestBuilders.put("/api/team/money-pool/connection/account")
                    .with(loginAs(OPERATOR_ID))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"accountId":"fake-account-2"}"""),
            ).andExpect(status().isNoContent)
            dispatch(MockMvcRequestBuilders.get("/api/team/money-pool/connection").with(loginAs(OPERATOR_ID)))
                .andExpect(jsonPath("$.accountPicked").value(true))

            dispatch(MockMvcRequestBuilders.delete("/api/team/money-pool/connection").with(loginAs(OPERATOR_ID)))
                .andExpect(status().isNoContent)

            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM ${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection", Int::class.java,
            ) shouldBe 0
        }

        test("the operator acting as a team and its member share one cached pool; another team on the same account has its own") {
            enterActAs()
            connectAsOperator()
            dispatch(
                MockMvcRequestBuilders.put("/api/team/money-pool/connection/account")
                    .with(loginAs(OPERATOR_ID))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"accountId":"fake-account-1"}"""),
            ).andExpect(status().isNoContent)
            connectBetaToTheSameAccount()
            val before = bunqGateway.reads
            fun alphaReadsAs(userId: String) =
                dispatch(MockMvcRequestBuilders.get("/api/team/money-pool").with(loginAs(userId)))
                    .andExpect(jsonPath("$.balance").value(18750))

            repeat(2) { alphaReadsAs(OPERATOR_ID) }
            (bunqGateway.reads - before) shouldBe 1

            alphaReadsAs(ALPHA_MEMBER)
            (bunqGateway.reads - before) shouldBe 1

            dispatch(MockMvcRequestBuilders.get("/api/team/money-pool").with(loginAs(BETA_MEMBER)))
                .andExpect(jsonPath("$.balance").value(18750))
            (bunqGateway.reads - before) shouldBe 2

            alphaReadsAs(OPERATOR_ID)
            (bunqGateway.reads - before) shouldBe 2
        }
    }

    private fun connectBetaToTheSameAccount() {
        jdbcTemplate.update(
            "INSERT INTO ${CalendarLinkFixture.BETA_SCHEMA}.bunq_connection " +
                "(id, bunq_account_id, access_token_encrypted, connected_by, connected_at) " +
                "VALUES (1, 'fake-account-1', ?, ?::uuid, now())",
            grantCipher.encrypt("fake:test").value,
            BETA_MEMBER,
        )
    }

    private fun connectAsOperator() {
        val url = dispatch(MockMvcRequestBuilders.post("/api/team/money-pool/connection").with(loginAs(OPERATOR_ID)))
            .andExpect(status().isCreated)
            .andReturn().response.contentAsString.let { ObjectMapper().readTree(it).get("url").asString() }
        val state = UriComponentsBuilder.fromUriString(url).build().queryParams.getFirst("state")!!
        val back = mockMvc.perform(
            MockMvcRequestBuilders.get("/internal/fake-bunq/decide")
                .param("state", state)
                .param("redirect_uri", "http://localhost:8080/api/bunq/oauth/callback")
                .param("login", "act-as-operator")
                .param("decision", "approve"),
        ).andReturn().response.getHeader("Location")!!

        mockMvc.perform(MockMvcRequestBuilders.get(URI.create(back)).with(loginAs(OPERATOR_ID)))
            .andExpect(
                MockMvcResultMatchers.header()
                    .string("Location", "http://localhost:5173/t/cal-alpha/team/settings?bunq=connected"),
            )
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
