package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.infrastructure.bunq.FakeBunqGatewayAdapter
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import org.hamcrest.Matchers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
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

/** The fake gateway until [failing] is set, then every call throws. */
class SwitchableBunqGateway(private val delegate: BunqGateway) : BunqGateway {
    @Volatile
    var failing = false

    override fun fetchBalance(account: BunqAccountId): Money = guarded { delegate.fetchBalance(account) }

    override fun fetchPayments(account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> =
        guarded { delegate.fetchPayments(account, since, limit) }

    private fun <T> guarded(call: () -> T): T = if (failing) error("injected Bunq failure") else call()
}

@TestConfiguration
class SwitchableBunqGatewayConfig {
    @Bean
    @Primary
    fun switchableBunqGateway(clock: Clock) = SwitchableBunqGateway(FakeBunqGatewayAdapter(clock))
}

/**
 * Covers the money pool read path (ADR-0042) against the fake Bunq gateway. All tests share the
 * single 'public' tenant schema, so every test restores the defaults (enabled, not connected,
 * Bunq reachable) and removes its member after it runs.
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

    private fun setSettings(beerPrice: Int?) {
        jdbcTemplate.update("UPDATE public.money_pool_settings SET beer_price_cents = ? WHERE id = 1", beerPrice)
    }

    private fun connectBunq() {
        jdbcTemplate.update(
            "INSERT INTO public.bunq_connection (id, bunq_account_id, connected_at) VALUES (1, 'test-account', now())",
        )
    }

    private fun removeMember() {
        listOf(MEMBER_USER_ID, ADMIN_USER_ID).forEach { userId ->
            jdbcTemplate.update("DELETE FROM public.team_members WHERE user_id = '$userId'::uuid")
            jdbcTemplate.update("DELETE FROM public.member_profiles WHERE user_id = '$userId'::uuid")
            jdbcTemplate.update("DELETE FROM public.users WHERE id = '$userId'::uuid")
        }
    }

    private fun resetMoneyPool() {
        bunqGateway.failing = false
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
