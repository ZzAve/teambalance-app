package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.DemoPersona
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import io.kotest.matchers.shouldBe
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

private const val TEST_ADMIN_ID = "d0000000-0000-0000-0000-0000000000a1"
private const val DEMO_LINK = "https://bunq.me/demo"

/**
 * The demo team's money pool (ADR-0043): the seeded connection opens under the grant cipher's team binding and reads the
 * fake Bunq, and an Admin can change the pool's settings except the top-up link. The demo team has no Admin persona yet,
 * so the test adds one.
 */
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.demo.enabled=true",
        "teambalance.email.send=false",
        "teambalance.bunq.environment=fake",
    ],
)
class DemoMoneyPoolIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    init {
        beforeSpec {
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$TEST_ADMIN_ID'::uuid, 'demo-admin@test.com', 'Admin') ON CONFLICT DO NOTHING
                """,
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, onboarded_at)
                VALUES ('${DemoPersona.TEAM_ID.value}'::uuid, '$TEST_ADMIN_ID'::uuid, 'ADMIN', now()) ON CONFLICT DO NOTHING
                """,
            )
        }

        // The database is shared with the other ITs, which count members.
        afterSpec {
            jdbcTemplate.update("DELETE FROM public.team_members WHERE user_id = ?::uuid", TEST_ADMIN_ID)
            jdbcTemplate.update("DELETE FROM public.users WHERE id = ?::uuid", TEST_ADMIN_ID)
        }

        test("the guest reads the seeded connection: the fake Bunq's balance and payments, and a top-up link") {
            perform(MockMvcRequestBuilders.get("/api/team/money-pool"), DemoPersona.MEMBER.userId.value.toString())
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Connected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(18750))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments.length()").value(8))
                .andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(true))
        }

        test("an Admin cannot change or clear the top-up link, and the stored link stays") {
            listOf(
                """{"enabled":true,"beerPrice":null,"bunqMeLink":"https://bunq.me/elsewhere"}""",
                """{"enabled":true,"beerPrice":null,"bunqMeLink":null}""",
            ).forEach { body ->
                perform(putSettings(body), TEST_ADMIN_ID)
                    .andExpect(MockMvcResultMatchers.status().isForbidden)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("DEMO_TOP_UP_LINK_LOCKED"))
            }
            storedLink() shouldBe DEMO_LINK
        }

        test("an Admin can still change the other settings while the link is sent unchanged") {
            perform(putSettings("""{"enabled":true,"beerPrice":270,"bunqMeLink":"bunq.me/demo/"}"""), TEST_ADMIN_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.beerPrice").value(270))

            jdbcTemplate.queryForObject(
                "SELECT beer_price_cents FROM ${DemoPersona.SCHEMA}.money_pool_settings",
                Int::class.java,
            ) shouldBe 270
            storedLink() shouldBe DEMO_LINK
        }
    }

    private fun storedLink() =
        jdbcTemplate.queryForObject("SELECT bunq_me_link FROM ${DemoPersona.SCHEMA}.money_pool_settings", String::class.java)

    private fun putSettings(json: String): MockHttpServletRequestBuilder =
        MockMvcRequestBuilders.put("/api/team/money-pool/settings").contentType(MediaType.APPLICATION_JSON).content(json)

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String): ResultActions =
        mockMvc.perform(builder.with(loginAs(userId, tenant = DemoPersona.SCHEMA)))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
}
