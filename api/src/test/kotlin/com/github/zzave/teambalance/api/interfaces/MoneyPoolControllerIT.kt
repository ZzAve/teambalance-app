package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.infrastructure.config.BunqGrantCipherConfiguration
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.hamcrest.Matchers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.UUID

private const val MEMBER_USER_ID = "b0000000-0000-0000-0000-0000000000b9"
private const val ADMIN_USER_ID = "b0000000-0000-0000-0000-0000000000b8"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

/**
 * Covers the money pool read path (ADR-0042) against the fake Bunq gateway. All tests share the
 * single 'public' tenant schema, so every test restores the defaults (enabled, not connected,
 * Bunq reachable, nothing cached) and removes its member after it runs.
 */
@AutoConfigureMockMvc
@Import(SwitchableBunqGatewayConfig::class)
class MoneyPoolControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var clock: Clock

    @Autowired
    lateinit var bunqGateway: SwitchableBunqGateway

    @Autowired
    lateinit var moneyPoolCache: MoneyPoolCacheGateway

    @Autowired
    @Qualifier(BunqGrantCipherConfiguration.BEAN_NAME)
    lateinit var grantCipher: TokenCipher

    init {
        afterTest {
            resetMoneyPool()
            removeMember()
        }

        test("GET /api/team/money-pool is NotConnected when the team has no Bunq connection") {
            seedTeamAndMember()
            resetMoneyPool()

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("NotConnected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments").doesNotExist())
        }

        test("GET /api/team/money-pool is Off when the switch is off, even with a connection") {
            seedTeamAndMember()
            connectBunq()
            jdbcTemplate.update("UPDATE public.money_pool_settings SET enabled = false WHERE id = 1")

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Off"))
        }

        test("GET /api/team/money-pool is Connected with balance and payments, exposing no IBAN or description") {
            seedTeamAndMember()
            connectBunq()
            val today = LocalDate.now(clock)

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Connected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(18750))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments.length()").value(8))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].date").value(today.minusDays(5).toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].name").value("Lisa de Vries"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].amount").value(2000))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].direction").value("In"))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("iban"))))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("description"))))
        }

        test("a second GET within the refresh window is answered from the cache without a Bunq call") {
            seedTeamAndMember()
            connectBunq()
            val before = bunqGateway.reads

            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(18750))
            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(18750))

            (bunqGateway.reads - before) shouldBe 1
        }

        test("a Rejected pool stays Rejected without asking Bunq again, until the cache is cleared") {
            seedTeamAndMember()
            connectBunq()
            bunqGateway.rejecting = true
            val before = bunqGateway.reads
            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Rejected"))
            bunqGateway.rejecting = false

            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Rejected"))
            (bunqGateway.reads - before) shouldBe 1

            forgetCachedPool()
            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Connected"))
        }

        test("GET /api/team/money-pool is Unavailable, without balance or payments, when Bunq fails") {
            seedTeamAndMember()
            connectBunq()
            bunqGateway.failing = true

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Unavailable"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments").doesNotExist())
        }

        test("GET /api/team/money-pool is Rejected, without balance or payments, when Bunq rejects the grant") {
            seedTeamAndMember()
            connectBunq()
            bunqGateway.rejecting = true

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Rejected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments").doesNotExist())
        }

        test("GET /api/team/money-pool is Rejected when the stored grant does not decrypt") {
            seedTeamAndMember()
            connectBunq()
            jdbcTemplate.update("UPDATE public.bunq_connection SET access_token_encrypted = 'not-a-grant' WHERE id = 1")

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Rejected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").doesNotExist())
        }

        test("GET /api/team/money-pool reports the beer price and count when Connected with a price") {
            seedTeamAndMember()
            connectBunq()
            setSettings(beerPrice = 270)

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.beerPrice").value(270))
                .andExpect(MockMvcResultMatchers.jsonPath("$.beerCount").value(69))
        }

        test("GET /api/team/money-pool has no beer fields without a price") {
            seedTeamAndMember()
            connectBunq()

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.beerPrice").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.beerCount").doesNotExist())
        }

        test("PUT /api/team/money-pool/settings by an admin replaces the settings and GET round-trips them") {
            seedTeamAndMember()
            val body = """{ "enabled": true, "beerPrice": 270, "bunqMeLink": "bunq.me/setpointvt/" }"""

            perform(putSettings(body), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.bunqMeLink").value("https://bunq.me/setpointvt"))

            perform(MockMvcRequestBuilders.get("/api/team/money-pool/settings"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.enabled").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.beerPrice").value(270))
                .andExpect(MockMvcResultMatchers.jsonPath("$.bunqMeLink").value("https://bunq.me/setpointvt"))

            perform(putSettings("""{ "enabled": true, "beerPrice": null, "bunqMeLink": null }"""), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
            perform(MockMvcRequestBuilders.get("/api/team/money-pool/settings"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.jsonPath("$.beerPrice").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.bunqMeLink").doesNotExist())
        }

        test("the settings endpoints answer a non-admin member with 403 and change nothing") {
            seedTeamAndMember()

            perform(MockMvcRequestBuilders.get("/api/team/money-pool/settings"), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
            perform(putSettings("""{ "enabled": false, "beerPrice": 270, "bunqMeLink": null }"""), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isForbidden)

            perform(MockMvcRequestBuilders.get("/api/team/money-pool/settings"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.jsonPath("$.enabled").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.beerPrice").doesNotExist())
        }

        test("PUT /api/team/money-pool/settings rejects a foreign link and an out-of-range price with 400") {
            seedTeamAndMember()

            perform(putSettings("""{ "enabled": true, "beerPrice": null, "bunqMeLink": "https://evil.example/x" }"""), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
            perform(putSettings("""{ "enabled": true, "beerPrice": 0, "bunqMeLink": null }"""), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
            perform(putSettings("""{ "enabled": true, "beerPrice": 10001, "bunqMeLink": null }"""), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
        }

        test("a stored link that no longer parses does not break /me or the money pool") {
            seedTeamAndMember()
            connectBunq()
            jdbcTemplate.update("UPDATE public.money_pool_settings SET bunq_me_link = 'https://old.example/legacy' WHERE id = 1")

            perform(MockMvcRequestBuilders.get("/api/auth/me"), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.moneyPoolEnabled").value(true))
            getMoneyPool().andExpect(MockMvcResultMatchers.status().isOk)
        }

        test("the sign-in response leaves moneyPoolEnabled out, because the tenant is not resolved yet") {
            seedTeamAndMember()

            verifyAs(MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.user.activeTeam").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.user.moneyPoolEnabled").doesNotExist())
        }

        test("GET /api/auth/me reports whether the active team switched the money pool on") {
            seedTeamAndMember()

            perform(MockMvcRequestBuilders.get("/api/auth/me"), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.jsonPath("$.moneyPoolEnabled").value(true))

            perform(putSettings("""{ "enabled": false, "beerPrice": null, "bunqMeLink": null }"""), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)

            perform(MockMvcRequestBuilders.get("/api/auth/me"), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.jsonPath("$.moneyPoolEnabled").value(false))
        }

        test("GET /api/auth/me still answers, without moneyPoolEnabled, when the tenant read fails") {
            seedTeamAndMember()
            jdbcTemplate.execute("ALTER TABLE public.money_pool_settings RENAME TO money_pool_settings_unreadable")
            try {
                perform(MockMvcRequestBuilders.get("/api/auth/me"), MEMBER_USER_ID)
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.activeTeam").exists())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.moneyPoolEnabled").doesNotExist())
            } finally {
                jdbcTemplate.execute("ALTER TABLE public.money_pool_settings_unreadable RENAME TO money_pool_settings")
            }
        }

        test("GET /api/auth/me has no moneyPoolEnabled for a user without an active team") {
            seedTeamAndMember()
            val teamless = "b0000000-0000-0000-0000-0000000000b7"
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$teamless'::uuid, 'money-teamless@test.com', 'Teamless')
                ON CONFLICT DO NOTHING
                """,
            )
            try {
                mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/me").with(loginAs(teamless)))
                    .andExpect(MockMvcResultMatchers.request().asyncStarted())
                    .andReturn()
                    .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.activeTeam").doesNotExist())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.moneyPoolEnabled").doesNotExist())
            } finally {
                jdbcTemplate.update("DELETE FROM public.users WHERE id = '$teamless'::uuid")
            }
        }

        test("GET /api/team/money-pool/top-up-link returns the bunq.me link with the amount and the encoded description") {
            seedTeamAndMember()
            setBunqMeLink("https://bunq.me/setpointvt")
            jdbcTemplate.update(
                "UPDATE public.member_profiles SET display_name = 'Zoë Müller' WHERE user_id = '$MEMBER_USER_ID'::uuid",
            )

            // The team row is shared with other ITs, so its encoded name sits in the unasserted middle.
            perform(getTopUpLink(20), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(
                    MockMvcResultMatchers.jsonPath("$.url", Matchers.startsWith("https://bunq.me/setpointvt/20/TeamBalance%20%C2%B7%20")),
                )
                .andExpect(
                    MockMvcResultMatchers.jsonPath(
                        "$.url",
                        Matchers.endsWith("%20%C2%B7%20Zo%C3%AB%20M%C3%BCller%20%C2%B7%20$MEMBER_USER_ID"),
                    ),
                )
        }

        test("GET /api/team/money-pool/top-up-link works without a Bunq connection and while Bunq is down") {
            seedTeamAndMember()
            setBunqMeLink("https://bunq.me/setpointvt")
            connectBunq()
            bunqGateway.failing = true

            perform(getTopUpLink(1), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isOk)
            perform(getTopUpLink(500), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isOk)
        }

        test("GET /api/team/money-pool/top-up-link rejects amounts outside 1 to 500 with 400") {
            seedTeamAndMember()
            setBunqMeLink("https://bunq.me/setpointvt")

            perform(getTopUpLink(0), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isBadRequest)
            perform(getTopUpLink(501), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isBadRequest)
            // 4294967316 is 2^32 + 20: narrowed to an Int before the range check it would pass as 20.
            perform(getTopUpLink(4_294_967_316L), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isBadRequest)
        }

        test("GET /api/team/money-pool/top-up-link without the required amount returns 400") {
            seedTeamAndMember()
            setBunqMeLink("https://bunq.me/setpointvt")

            mockMvc.perform(
                MockMvcRequestBuilders.get("/api/team/money-pool/top-up-link")
                    .with(loginAs(MEMBER_USER_ID, tenant = "public")),
            )
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").value("Param amount cannot be null"))
        }

        test("GET /api/team/money-pool/top-up-link is 404 when the pool is Off, even with a link") {
            seedTeamAndMember()
            setBunqMeLink("https://bunq.me/setpointvt")
            jdbcTemplate.update("UPDATE public.money_pool_settings SET enabled = false WHERE id = 1")

            perform(getTopUpLink(20), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("GET /api/team/money-pool/top-up-link is 404 when no bunq.me link is set") {
            seedTeamAndMember()

            perform(getTopUpLink(20), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("a stored link that is not a bunq.me page gives no top-up link and no canTopUp") {
            seedTeamAndMember()
            setBunqMeLink("https://evil.example/x")

            perform(getTopUpLink(20), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isNotFound)
            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(false))
        }

        test("GET /api/team/money-pool/top-up-link without an authenticated user returns 401") {
            mockMvc.perform(getTopUpLink(20)).andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }

        test("canTopUp is true in every state once the pool is on and a link is set, and false otherwise") {
            seedTeamAndMember()
            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(false))

            setBunqMeLink("https://bunq.me/setpointvt")
            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("NotConnected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(true))

            connectBunq()
            bunqGateway.failing = true
            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Unavailable"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(true))

            bunqGateway.failing = false
            bunqGateway.rejecting = true
            forgetCachedPool()
            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Rejected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(true))

            bunqGateway.rejecting = false
            forgetCachedPool()
            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Connected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(true))

            jdbcTemplate.update("UPDATE public.money_pool_settings SET enabled = false WHERE id = 1")
            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Off"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.canTopUp").value(false))
        }

        test("GET /api/team/money-pool without an authenticated user returns 401") {
            mockMvc.perform(MockMvcRequestBuilders.get("/api/team/money-pool"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
    }

    private fun getMoneyPool(): ResultActions =
        mockMvc.perform(MockMvcRequestBuilders.get("/api/team/money-pool").with(loginAs(MEMBER_USER_ID, tenant = "public")))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String): ResultActions =
        mockMvc.perform(builder.with(loginAs(userId, tenant = "public")))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun verifyAs(userId: String): ResultActions {
        val email = jdbcTemplate.queryForObject("SELECT email FROM public.users WHERE id = ?::uuid", String::class.java, userId)
        val token = "money-it-${UUID.randomUUID()}"
        jdbcTemplate.update(
            "INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, created_at) VALUES (?, ?, ?, ?, now())",
            UUID.randomUUID(),
            MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(it) },
            email,
            Timestamp.from(Instant.now().plus(1, ChronoUnit.HOURS)),
        )
        val started = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify").contentType(MediaType.APPLICATION_JSON)
                .content("""{"token":"$token"}"""),
        ).andExpect(MockMvcResultMatchers.request().asyncStarted()).andReturn()
        return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
    }

    private fun putSettings(json: String): MockHttpServletRequestBuilder =
        MockMvcRequestBuilders.put("/api/team/money-pool/settings").contentType(MediaType.APPLICATION_JSON).content(json)

    // The amount goes in the URL: MockMvc.param() leaves the query string empty, which the wirespec
    // adapter reads (the TS client builds the query string with URLSearchParams).
    private fun getTopUpLink(amount: Long): MockHttpServletRequestBuilder =
        MockMvcRequestBuilders.get("/api/team/money-pool/top-up-link?amount=$amount")

    private fun setBunqMeLink(link: String) {
        jdbcTemplate.update("UPDATE public.money_pool_settings SET bunq_me_link = ? WHERE id = 1", link)
    }

    private fun setSettings(beerPrice: Int?) {
        jdbcTemplate.update("UPDATE public.money_pool_settings SET beer_price_cents = ? WHERE id = 1", beerPrice)
    }

    private fun connectBunq() {
        jdbcTemplate.update(
            "INSERT INTO public.bunq_connection (id, bunq_account_id, access_token_encrypted, connected_by, connected_at) " +
                "VALUES (1, 'test-account', ?, ?::uuid, now())",
            grantCipher.encrypt("fake:test").value,
            ADMIN_USER_ID,
        )
    }

    private fun removeMember() {
        listOf(MEMBER_USER_ID, ADMIN_USER_ID).forEach { userId ->
            jdbcTemplate.update("DELETE FROM public.team_members WHERE user_id = '$userId'::uuid")
            jdbcTemplate.update("DELETE FROM public.member_profiles WHERE user_id = '$userId'::uuid")
            jdbcTemplate.update("DELETE FROM public.users WHERE id = '$userId'::uuid")
        }
    }

    private fun forgetCachedPool() = moneyPoolCache.evict(TeamId(UUID.fromString(TEAM_ID)))

    private fun resetMoneyPool() {
        bunqGateway.failing = false
        bunqGateway.rejecting = false
        forgetCachedPool()
        jdbcTemplate.update("DELETE FROM public.bunq_connection")
        jdbcTemplate.update(
            "UPDATE public.money_pool_settings SET enabled = true, beer_price_cents = NULL, bunq_me_link = NULL WHERE id = 1",
        )
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
        addMember(MEMBER_USER_ID, "money-member@test.com", "USER")
        addMember(ADMIN_USER_ID, "money-admin@test.com", "ADMIN")
    }

    private fun addMember(userId: String, email: String, role: String) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$userId'::uuid, '$email', '$email')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, '$role', 'Setter')")
    }
}
