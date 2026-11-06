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

private val KEES = DemoPersona.ADMIN.userId.value.toString()
private const val DEMO_LINK = "https://bunq.me/demo"

/**
 * The demo team's money pool (ADR-0043): the seeded connection opens under the grant cipher's team binding and reads the
 * fake Bunq, and an Admin can change the pool's settings except the top-up link.
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
        // The demo schema is shared with the other ITs; the seed has no beer price.
        afterSpec {
            jdbcTemplate.update("UPDATE ${DemoPersona.SCHEMA}.money_pool_settings SET beer_price_cents = NULL WHERE id = 1")
        }

        test("the guest reads the seeded connection: the fake Bunq's balance and payments, and a top-up link") {
            perform(MockMvcRequestBuilders.get("/api/team/money-pool"), DemoPersona.MEMBER.userId.value.toString())
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Connected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(8700))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments.length()").value(8))
                .andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(true))
        }

        test("an Admin cannot change or clear the top-up link, and the stored link stays") {
            listOf(
                """{"enabled":true,"beerPrice":null,"bunqMeLink":"https://bunq.me/elsewhere"}""",
                """{"enabled":true,"beerPrice":null,"bunqMeLink":null}""",
            ).forEach { body ->
                perform(putSettings(body), KEES)
                    .andExpect(MockMvcResultMatchers.status().isForbidden)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("DEMO_TOP_UP_LINK_LOCKED"))
            }
            storedLink() shouldBe DEMO_LINK
        }

        test("an Admin can still change the other settings while the link is sent unchanged") {
            perform(putSettings("""{"enabled":true,"beerPrice":270,"bunqMeLink":"bunq.me/demo/"}"""), KEES)
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
