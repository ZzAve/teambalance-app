package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.MoneyPoolReader
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.Receipt
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.jpegBytes
import com.github.zzave.teambalance.api.domain.model.webpBytes
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import com.github.zzave.teambalance.api.infrastructure.bunq.BunqReadCacheProperties
import com.github.zzave.teambalance.api.infrastructure.bunq.CaffeineMoneyPoolCacheAdapter
import com.github.zzave.teambalance.api.infrastructure.config.BunqGrantCipherConfiguration
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.hamcrest.Matchers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.Locale
import java.util.UUID

private const val MEMBER_USER_ID = "b0000000-0000-0000-0000-0000000000b9"
private const val ADMIN_USER_ID = "b0000000-0000-0000-0000-0000000000b8"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

// Ids of the fake Bunq adapter's Teamkas payments: Lisa de Vries pays in, Sporthal De Kuil is an expense.
private const val LISA_PAYMENT_ID = "1005"
private const val SPORTHAL_PAYMENT_ID = "1006"
// The user id the fake Bunq's first payment names in its top-up description.
private const val DESCRIBED_USER_ID = "b0000000-0000-0000-0000-000000000002"

/**
 * Covers the money pool read path (ADR-0042) against the fake Bunq gateway. All tests share the
 * single 'public' tenant schema, so every test restores the defaults (enabled, not connected,
 * Bunq reachable, nothing cached) and removes its member after it runs.
 */
@AutoConfigureMockMvc
@Suppress("LargeClass")
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
    lateinit var moneyPoolReader: MoneyPoolReader

    @Autowired
    lateinit var tenantScope: TenantScopeGateway

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
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments").isEmpty)
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
                .andExpect(MockMvcResultMatchers.jsonPath("$.refreshing").value(false))
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

        test("payments carry the member they are attributed to; the response holds no IBAN or description") {
            seedTeamAndMember()
            addMember(DESCRIBED_USER_ID, "money-described@test.com", "USER")
            connectBunq()
            // Fake payments: Lisa de Vries (top-up description naming DESCRIBED_USER_ID), Tom Bakker, Jan Jansen (IBAN DE89...).
            insertAlias(MEMBER_USER_ID, name = "tom bakker")
            insertAlias(ADMIN_USER_ID, iban = "DE89370400440532013000")

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].memberId").value(DESCRIBED_USER_ID))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[2].memberId").value(MEMBER_USER_ID))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[3].memberId").value(ADMIN_USER_ID))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[1].memberId").doesNotExist())
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("iban"))))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("description"))))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("NL91ABNA0417164300"))))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("DE89370400440532013000"))))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("TeamBalance"))))
        }

        test("a matched payment shows the member's name; the counterparty name only to an Admin and to that member") {
            seedTeamAndMember()
            addMember(DESCRIBED_USER_ID, "money-described@test.com", "USER")
            connectBunq()
            insertAlias(MEMBER_USER_ID, name = "tom bakker")
            val memberName = jdbcTemplate.queryForObject(
                "SELECT display_name FROM public.member_profiles WHERE user_id = ?::uuid",
                String::class.java,
                MEMBER_USER_ID,
            )

            // A member who is neither Admin nor the alias owner.
            perform(MockMvcRequestBuilders.get("/api/team/money-pool"), DESCRIBED_USER_ID)
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[2].memberId").value(MEMBER_USER_ID))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[2].name").value(memberName))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[2].counterpartyName").doesNotExist())
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("Tom Bakker"))))
            listOf(MEMBER_USER_ID, ADMIN_USER_ID).forEach { viewer ->
                perform(MockMvcRequestBuilders.get("/api/team/money-pool"), viewer)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.payments[2].name").value(memberName))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.payments[2].counterpartyName").value("Tom Bakker"))
            }
            // A payment nobody claims keeps the counterparty name for everyone and has no counterpartyName.
            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[1].name").value("Sporthal De Kuil"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[1].counterpartyName").doesNotExist())
        }

        test("a claimed IBAN is never returned: claim someone else's payment, then list your aliases") {
            seedTeamAndMember()
            connectBunq()

            claim(MEMBER_USER_ID, "1008", MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.ibanMasked").value("DE89 •••• •••• •••• ••30 00"))
            listOf(MEMBER_USER_ID, ADMIN_USER_ID).forEach { viewer ->
                perform(MockMvcRequestBuilders.get("/api/members/$MEMBER_USER_ID/payment-aliases"), viewer)
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.aliases[0].hasIban").value(true))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.aliases[0].ibanMasked").value("DE89 •••• •••• •••• ••30 00"))
                    .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("DE89370400440532013000"))))
            }
        }

        test("a claim is 503 while Bunq is unavailable and 409 MONEY_POOL_NOT_READABLE when the pool is off, not connected or rejected") {
            seedTeamAndMember()
            connectBunq()

            bunqGateway.failing = true
            forgetCachedPool()
            claim(MEMBER_USER_ID, "1007", MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isServiceUnavailable)

            bunqGateway.failing = false
            bunqGateway.rejecting = true
            forgetCachedPool()
            claim(MEMBER_USER_ID, "1007", MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("MONEY_POOL_NOT_READABLE"))

            bunqGateway.rejecting = false
            forgetCachedPool()
            jdbcTemplate.update("UPDATE public.money_pool_settings SET enabled = false WHERE id = 1")
            claim(MEMBER_USER_ID, "1007", MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isConflict)

            jdbcTemplate.update("UPDATE public.money_pool_settings SET enabled = true WHERE id = 1")
            jdbcTemplate.update("DELETE FROM public.bunq_connection")
            claim(MEMBER_USER_ID, "1007", MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isConflict)
            storedAliases(MEMBER_USER_ID) shouldBe emptyList()
        }

        // Fake payments by id: 1007 Tom Bakker IN (IBAN NL02...), 1008 Jan Jansen IN (IBAN DE89...), 1006 Sporthal De Kuil OUT.
        test("a member claims an unmatched payment for themselves: name and IBAN stored, the IBAN never answered") {
            seedTeamAndMember()
            connectBunq()

            claim(MEMBER_USER_ID, "1007", MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Tom Bakker"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.hasIban").value(true))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("NL02ABNA0123456789"))))
            storedAliases(MEMBER_USER_ID) shouldBe listOf("Tom Bakker" to "NL02ABNA0123456789")

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[2].id").value("1007"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[2].memberId").value(MEMBER_USER_ID))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("NL02ABNA0123456789"))))
        }

        test("a claim can store the name only, or the IBAN only") {
            seedTeamAndMember()
            connectBunq()

            claim(MEMBER_USER_ID, "1008", MEMBER_USER_ID, ""","useIban":false""")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.hasIban").value(false))
            claim(MEMBER_USER_ID, "1007", MEMBER_USER_ID, ""","useName":false""")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.hasIban").value(true))

            storedAliases(MEMBER_USER_ID).toSet() shouldBe setOf("Jan Jansen" to null, null to "NL02ABNA0123456789")
        }

        test("a claim that stores neither part is 400") {
            seedTeamAndMember()
            connectBunq()

            claim(MEMBER_USER_ID, "1007", MEMBER_USER_ID, ""","useName":false,"useIban":false""")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
            // 1010 has no IBAN, so an IBAN-only claim has nothing to store.
            claim(MEMBER_USER_ID, "1010", MEMBER_USER_ID, ""","useName":false""")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
            storedAliases(MEMBER_USER_ID) shouldBe emptyList()
        }

        test("an Admin claims a payment for another member; a member cannot claim for someone else") {
            seedTeamAndMember()
            connectBunq()

            claim(MEMBER_USER_ID, "1007", ADMIN_USER_ID).andExpect(MockMvcResultMatchers.status().isForbidden)
            storedAliases(ADMIN_USER_ID) shouldBe emptyList()

            claim(ADMIN_USER_ID, "1007", MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.content().string(Matchers.not(Matchers.containsString("NL02ABNA0123456789"))))
            storedAliases(MEMBER_USER_ID).size shouldBe 1
        }

        test("a claim is 404 for a payment that is not in the pool and for a user who is not a member") {
            seedTeamAndMember()
            connectBunq()

            claim(MEMBER_USER_ID, "p999", MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isNotFound)
            claim(ADMIN_USER_ID, "1007", "b0000000-0000-0000-0000-0000000000ff").andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("a payment out, or one already attributed to a member, is 409 PAYMENT_NOT_CLAIMABLE") {
            seedTeamAndMember()
            connectBunq()

            claim(MEMBER_USER_ID, "1006", MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("PAYMENT_NOT_CLAIMABLE"))

            claim(MEMBER_USER_ID, "1007", MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isCreated)
            claim(ADMIN_USER_ID, "1007", ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("PAYMENT_NOT_CLAIMABLE"))
        }

        test("a second GET within the refresh window is answered from the cache without a Bunq call") {
            seedTeamAndMember()
            connectBunq()
            val before = bunqGateway.reads

            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(18750))
            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(18750))

            (bunqGateway.reads - before) shouldBe 1
        }

        // A cache of its own with a 1 ms refresh interval, over the context's reader and tenant scope: the
        // context's cache refreshes after 120 s of the real clock.
        test("a read after the refresh interval has Bunq asked again in the background, in the schema of the team") {
            seedTeamAndMember()
            connectBunq()
            val team = TeamId(UUID.fromString(TEAM_ID))
            val tenant = TenantRouting(team, SchemaName("public"))
            val account = BunqAccountId("test-account")
            val cache = CaffeineMoneyPoolCacheAdapter(
                clock,
                BunqReadCacheProperties(Duration.ofMillis(1), expire = Duration.ofMinutes(5), retryAfter = Duration.ofSeconds(10)),
                tenantScope,
                moneyPoolReader,
            )
            val before = bunqGateway.reads
            tenantScope.within(tenant) { cache.read(team, account) }
            Thread.sleep(20)

            tenantScope.within(tenant) { cache.read(team, account) }

            val deadline = System.nanoTime() + Duration.ofSeconds(5).toNanos()
            while (bunqGateway.reads - before < 2 && System.nanoTime() < deadline) Thread.sleep(10)
            (bunqGateway.reads - before) shouldBe 2
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
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments").isEmpty)
        }

        test("GET /api/team/money-pool is Rejected, without balance or payments, when Bunq rejects the grant") {
            seedTeamAndMember()
            connectBunq()
            bunqGateway.rejecting = true

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Rejected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments").isEmpty)
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

        // Dev and staging rows made before the AAD existed: the Admin connects again.
        test("GET /api/team/money-pool is Rejected, not an error, when the stored grant was made without an AAD") {
            seedTeamAndMember()
            connectBunq(aad = TokenCipher.NO_AAD)

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Rejected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").doesNotExist())
        }

        test("GET /api/team/money-pool is Rejected when the stored grant was encrypted for another team") {
            seedTeamAndMember()
            connectBunq(aad = TokenCipher.aadOf(TeamId(UUID.fromString("a0000000-0000-0000-0000-0000000000ff")), Purpose.BUNQ_GRANT))

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

        test("a member attaches a receipt to an expense; the pool shows its version and anyone in the team can view it") {
            seedTeamAndMember()
            connectBunq()
            val bytes = webpBytes(64)

            sendReceipt(MockMvcRequestBuilders.put(receiptUrl(SPORTHAL_PAYMENT_ID)), MEMBER_USER_ID, bytes)
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[1].id").value(SPORTHAL_PAYMENT_ID))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[1].receiptVersion").value(Receipt(bytes).version))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].receiptVersion").doesNotExist())
            val response = sendReceipt(MockMvcRequestBuilders.get(receiptUrl(SPORTHAL_PAYMENT_ID)), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CONTENT_TYPE, "image/webp"))
                .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CACHE_CONTROL, "private, max-age=31536000, immutable"))
                .andReturn().response
            response.contentAsByteArray.toList() shouldBe bytes.toList()

            sendReceipt(MockMvcRequestBuilders.delete(receiptUrl(SPORTHAL_PAYMENT_ID)), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNoContent)
            sendReceipt(MockMvcRequestBuilders.get(receiptUrl(SPORTHAL_PAYMENT_ID)), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("a member records an out-of-pocket expense with a receipt; the pool lists it first, and deleting it removes both") {
            seedTeamAndMember()
            connectBunq()

            val id = recordExpense(MEMBER_USER_ID, expenseJson(MEMBER_USER_ID))
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.outOfPocket").value(true))
                .andReturn().response.contentAsString.substringAfter("\"id\":\"").substringBefore("\"")
            val bytes = webpBytes(64)
            sendReceipt(MockMvcRequestBuilders.put(receiptUrl(id)), MEMBER_USER_ID, bytes)
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").value(18_750))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].id").value(id))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].name").value("Balls"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].amount").value(1_250))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].direction").value("Out"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].date").value(LocalDate.now(clock).toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].memberId").value(MEMBER_USER_ID))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].outOfPocket").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].receiptVersion").value(Receipt(bytes).version))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[1].outOfPocket").value(false))

            perform(MockMvcRequestBuilders.delete("/api/team/money-pool/out-of-pocket-expenses/$id"), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNoContent)
            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].outOfPocket").value(false))
            sendReceipt(MockMvcRequestBuilders.get(receiptUrl(id)), MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("an out-of-pocket expense is recorded and deleted by the member who paid or an Admin, and by nobody else") {
            seedTeamAndMember()
            connectBunq()

            recordExpense(MEMBER_USER_ID, expenseJson(ADMIN_USER_ID)).andExpect(MockMvcResultMatchers.status().isForbidden)
            recordExpense(ADMIN_USER_ID, expenseJson(UUID.randomUUID().toString())).andExpect(MockMvcResultMatchers.status().isNotFound)
            val id = recordExpense(ADMIN_USER_ID, expenseJson(ADMIN_USER_ID))
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andReturn().response.contentAsString.substringAfter("\"id\":\"").substringBefore("\"")

            val delete = { MockMvcRequestBuilders.delete("/api/team/money-pool/out-of-pocket-expenses/$id") }
            perform(delete(), MEMBER_USER_ID).andExpect(MockMvcResultMatchers.status().isForbidden)
            perform(MockMvcRequestBuilders.delete("/api/team/money-pool/out-of-pocket-expenses/$SPORTHAL_PAYMENT_ID"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
            perform(delete(), ADMIN_USER_ID).andExpect(MockMvcResultMatchers.status().isNoContent)
            perform(delete(), ADMIN_USER_ID).andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("an out-of-pocket expense with a bad amount, description or date is 400, and 409 while the pool is switched off") {
            seedTeamAndMember()
            connectBunq()

            recordExpense(MEMBER_USER_ID, expenseJson(MEMBER_USER_ID, amount = 0)).andExpect(MockMvcResultMatchers.status().isBadRequest)
            recordExpense(MEMBER_USER_ID, expenseJson(MEMBER_USER_ID, description = " "))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
            recordExpense(MEMBER_USER_ID, expenseJson(MEMBER_USER_ID, date = LocalDate.now(clock).plusDays(1)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
            recordExpense(MEMBER_USER_ID, expenseJson(MEMBER_USER_ID, date = LocalDate.now(clock).minusDays(91)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)

            jdbcTemplate.update("UPDATE public.money_pool_settings SET enabled = false WHERE id = 1")
            recordExpense(MEMBER_USER_ID, expenseJson(MEMBER_USER_ID))
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("MONEY_POOL_NOT_READABLE"))
            jdbcTemplate.queryForObject("SELECT count(*) FROM public.out_of_pocket_expenses", Int::class.java) shouldBe 0
        }

        test("without a Bunq connection, and while Bunq fails, a member records an expense with a receipt and the pool lists it alone") {
            seedTeamAndMember()

            val id = recordedExpenseId(recordExpense(MEMBER_USER_ID, expenseJson(MEMBER_USER_ID)))
            val bytes = webpBytes(64)
            sendReceipt(MockMvcRequestBuilders.put(receiptUrl(id)), MEMBER_USER_ID, bytes)
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("NotConnected"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.balance").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].id").value(id))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].memberId").value(MEMBER_USER_ID))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].receiptVersion").value(Receipt(bytes).version))

            connectBunq()
            bunqGateway.failing = true
            val second = recordedExpenseId(recordExpense(ADMIN_USER_ID, expenseJson(ADMIN_USER_ID, description = "Net")))
            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("Unavailable"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].id").value(second))
            // A Bunq expense cannot take a receipt while its payment cannot be read.
            sendReceipt(MockMvcRequestBuilders.put(receiptUrl(SPORTHAL_PAYMENT_ID)), MEMBER_USER_ID, bytes)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("the member who paid changes an out-of-pocket expense and keeps its receipt; only an Admin changes who paid") {
            seedTeamAndMember()
            connectBunq()
            val id = recordedExpenseId(recordExpense(MEMBER_USER_ID, expenseJson(MEMBER_USER_ID)))
            val bytes = webpBytes(64)
            sendReceipt(MockMvcRequestBuilders.put(receiptUrl(id)), MEMBER_USER_ID, bytes)
                .andExpect(MockMvcResultMatchers.status().isNoContent)
            val yesterday = LocalDate.now(clock).minusDays(1)

            updateExpense(MEMBER_USER_ID, id, expenseJson(MEMBER_USER_ID, amount = 1_999, date = yesterday, description = "Match balls"))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(id))
                .andExpect(MockMvcResultMatchers.jsonPath("$.amount").value(1_999))
            getMoneyPool()
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].id").value(id))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].name").value("Match balls"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].amount").value(1_999))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].date").value(yesterday.toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].receiptVersion").value(Receipt(bytes).version))

            updateExpense(MEMBER_USER_ID, id, expenseJson(ADMIN_USER_ID)).andExpect(MockMvcResultMatchers.status().isForbidden)
            updateExpense(MEMBER_USER_ID, id, expenseJson(MEMBER_USER_ID, amount = 0))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
            updateExpense(ADMIN_USER_ID, SPORTHAL_PAYMENT_ID, expenseJson(ADMIN_USER_ID))
                .andExpect(MockMvcResultMatchers.status().isNotFound)
            updateExpense(ADMIN_USER_ID, id, expenseJson(ADMIN_USER_ID)).andExpect(MockMvcResultMatchers.status().isOk)
            getMoneyPool().andExpect(MockMvcResultMatchers.jsonPath("$.payments[0].memberId").value(ADMIN_USER_ID))
            // It is the Admin's now, so the member who recorded it can no longer change it.
            updateExpense(MEMBER_USER_ID, id, expenseJson(MEMBER_USER_ID)).andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("a receipt is refused for an incoming payment, an unknown payment and a file that is not WebP or JPEG") {
            seedTeamAndMember()
            connectBunq()

            sendReceipt(MockMvcRequestBuilders.put(receiptUrl(LISA_PAYMENT_ID)), MEMBER_USER_ID, webpBytes())
                .andExpect(MockMvcResultMatchers.status().isNotFound)
            sendReceipt(MockMvcRequestBuilders.put(receiptUrl("does-not-exist")), MEMBER_USER_ID, webpBytes())
                .andExpect(MockMvcResultMatchers.status().isNotFound)
            sendReceipt(MockMvcRequestBuilders.put(receiptUrl(SPORTHAL_PAYMENT_ID)), MEMBER_USER_ID, ByteArray(32))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("INVALID_RECEIPT"))
            sendReceipt(MockMvcRequestBuilders.put(receiptUrl(SPORTHAL_PAYMENT_ID)), MEMBER_USER_ID, jpegBytes(Receipt.MAX_BYTES + 1))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("RECEIPT_TOO_LARGE"))
        }
    }

    private fun recordExpense(callerId: String, json: String): ResultActions =
        perform(
            MockMvcRequestBuilders.post("/api/team/money-pool/out-of-pocket-expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json),
            callerId,
        )

    private fun updateExpense(callerId: String, paymentId: String, json: String): ResultActions =
        perform(
            MockMvcRequestBuilders.put("/api/team/money-pool/out-of-pocket-expenses/$paymentId")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json),
            callerId,
        )

    private fun recordedExpenseId(recorded: ResultActions): String =
        recorded.andExpect(MockMvcResultMatchers.status().isCreated)
            .andReturn().response.contentAsString.substringAfter("\"id\":\"").substringBefore("\"")

    private fun expenseJson(userId: String, amount: Long = 1_250, date: LocalDate = LocalDate.now(clock), description: String = "Balls") =
        """{"userId":"$userId","amount":$amount,"date":"$date","description":"$description"}"""

    private fun receiptUrl(paymentId: String) = "/api/team/money-pool/payments/$paymentId/receipt"

    private fun sendReceipt(builder: MockHttpServletRequestBuilder, userId: String, body: ByteArray? = null): ResultActions {
        builder.with(loginAs(userId, tenant = "public"))
        if (body != null) builder.content(body).contentType("image/webp")
        return mockMvc.perform(builder)
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
            MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(Locale.ROOT, it) },
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

    private fun connectBunq(aad: ByteArray = TokenCipher.aadOf(TeamId(UUID.fromString(TEAM_ID)), Purpose.BUNQ_GRANT)) {
        jdbcTemplate.update(
            "INSERT INTO public.bunq_connection (id, bunq_account_id, access_token_encrypted, connected_by, connected_at) " +
                "VALUES (1, 'test-account', ?, ?::uuid, now())",
            grantCipher.encrypt("fake:test", aad).value,
            ADMIN_USER_ID,
        )
    }

    private fun claim(callerId: String, paymentId: String, targetId: String, more: String = ""): ResultActions =
        perform(
            MockMvcRequestBuilders.post("/api/team/money-pool/payments/$paymentId/claim")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"userId":"$targetId"$more}"""),
            callerId,
        )

    private fun storedAliases(userId: String): List<Pair<String?, String?>> =
        jdbcTemplate.query(
            "SELECT name, iban FROM public.member_payment_aliases WHERE user_id = ?::uuid ORDER BY name NULLS LAST",
            { rs, _ -> rs.getString("name") to rs.getString("iban") },
            userId,
        )

    private fun insertAlias(userId: String, name: String? = null, iban: String? = null) {
        jdbcTemplate.update(
            "INSERT INTO public.member_payment_aliases (id, user_id, name, iban) VALUES (?, ?::uuid, ?, ?)",
            UUID.randomUUID(),
            userId,
            name,
            iban,
        )
    }

    private fun removeMember() {
        jdbcTemplate.update("DELETE FROM public.member_payment_aliases")
        listOf(MEMBER_USER_ID, ADMIN_USER_ID, DESCRIBED_USER_ID).forEach { userId ->
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
        jdbcTemplate.update("DELETE FROM public.payment_receipts")
        jdbcTemplate.update("DELETE FROM public.out_of_pocket_expenses")
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
