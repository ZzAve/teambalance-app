package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_TEAM
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_TEAM
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.LEAVER
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldNotContain
import io.kotest.matchers.string.shouldStartWith
import org.hamcrest.Matchers.containsString
import org.springframework.http.MediaType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.web.util.UriComponentsBuilder
import tools.jackson.databind.ObjectMapper
import java.net.URI
import java.util.UUID

private const val CALLBACK = "http://localhost:8080/api/bunq/oauth/callback"
private const val ALPHA_SETTINGS = "http://localhost:5173/t/cal-alpha/team/settings"
private const val FRONTEND_ROOT = "http://localhost:5173/"
private const val CONNECTION = "/api/team/money-pool/connection"
private const val ACCOUNT = "$CONNECTION/account"
private const val MONEY_POOL = "/api/team/money-pool"
private const val TEAMKAS = "fake-account-1"
private const val PRIVE = "fake-account-2"

/**
 * Connecting Bunq through the fake approval page (ADR-0042), end to end against two real tenant
 * schemas: the callback must write to the team whose Admin started the flow, whatever the browser's
 * session is routed to.
 */
@AutoConfigureMockMvc
class BunqConnectionControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private val json = ObjectMapper()

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        afterTest {
            listOf(ALPHA_SCHEMA, BETA_SCHEMA).forEach { jdbcTemplate.update("DELETE FROM $it.bunq_connection") }
            jdbcTemplate.update("DELETE FROM public.bunq_oauth_states WHERE team_id IN (?::uuid, ?::uuid)", ALPHA_TEAM, BETA_TEAM)
            jdbcTemplate.update("DELETE FROM public.team_members WHERE team_id = ?::uuid AND user_id = ?::uuid", BETA_TEAM, ALPHA_MEMBER)
            jdbcTemplate.update("UPDATE public.users SET last_active_team_id = NULL WHERE id = ?::uuid", ALPHA_MEMBER)
        }

        test("only an admin can start, read the status, list, pick or disconnect, and nothing changes for a member") {
            connect(newLogin())

            api(post(CONNECTION), LEAVER).andExpect(status().isForbidden)
            api(get(CONNECTION), LEAVER).andExpect(status().isForbidden)
            api(get(ACCOUNT), LEAVER).andExpect(status().isForbidden)
            api(pick(TEAMKAS), LEAVER).andExpect(status().isForbidden)
            api(delete(CONNECTION), LEAVER).andExpect(status().isForbidden)

            stateRows() shouldBe 1
            connectionRows(ALPHA_SCHEMA) shouldBe 1
            pickedAccount(ALPHA_SCHEMA) shouldBe null
        }

        test("an admin connects Bunq, picks an account and the money pool shows its balance") {
            api(get(CONNECTION), ALPHA_MEMBER)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.connectAvailable").value(true))
                .andExpect(jsonPath("$.connected").value(false))
                .andExpect(jsonPath("$.accountPicked").value(false))

            val state = start(ALPHA_MEMBER)
            mockMvc.perform(get("/internal/fake-bunq/authorize").param("state", state).param("redirect_uri", CALLBACK))
                .andExpect(status().isOk)
                .andExpect(content().string(containsString("Approve")))
            val back = approve(state, login = newLogin())
            callback(back).andExpect(status().isFound).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=connected"))

            connectionRows(ALPHA_SCHEMA) shouldBe 1
            connectionRows(BETA_SCHEMA) shouldBe 0
            storedGrant(ALPHA_SCHEMA) shouldNotContain "fake:"
            pickedAccount(ALPHA_SCHEMA) shouldBe null
            api(get(CONNECTION), ALPHA_MEMBER)
                .andExpect(jsonPath("$.connected").value(true))
                .andExpect(jsonPath("$.accountPicked").value(false))
            api(get(MONEY_POOL), ALPHA_MEMBER).andExpect(jsonPath("$.state").value("NotConnected"))
            api(get(ACCOUNT), ALPHA_MEMBER)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.accounts.length()").value(2))
                .andExpect(jsonPath("$.accounts[0].id").value(TEAMKAS))
                .andExpect(jsonPath("$.accounts[0].name").value("Teamkas"))
                .andExpect(jsonPath("$.accounts[1].id").value(PRIVE))
                .andExpect(jsonPath("$.accounts[1].name").value("Privé"))
                .andExpect(jsonPath("$.selectedAccountId").doesNotExist())

            api(pick(TEAMKAS), ALPHA_MEMBER).andExpect(status().isNoContent)

            api(get(MONEY_POOL), ALPHA_MEMBER)
                .andExpect(jsonPath("$.state").value("Connected"))
                .andExpect(jsonPath("$.balance").value(18750))
            api(get(CONNECTION), ALPHA_MEMBER).andExpect(jsonPath("$.accountPicked").value(true))
            api(get(ACCOUNT), ALPHA_MEMBER).andExpect(jsonPath("$.selectedAccountId").value(TEAMKAS))
        }

        test("picking an id outside the grant is a 400 and changes nothing") {
            connect(newLogin())

            api(pick("not-in-the-grant"), ALPHA_MEMBER)
                .andExpect(status().isBadRequest)
                .andExpect(jsonPath("$.code").value("UNKNOWN_BUNQ_ACCOUNT"))

            pickedAccount(ALPHA_SCHEMA) shouldBe null
        }

        test("listing and picking are 404 while the team is not connected") {
            api(get(ACCOUNT), ALPHA_MEMBER).andExpect(status().isNotFound)
            api(pick(TEAMKAS), ALPHA_MEMBER).andExpect(status().isNotFound)
        }

        test("a stored grant that does not decrypt is a 422 BUNQ_REJECTED on both account endpoints") {
            connect(newLogin())
            jdbcTemplate.update("UPDATE $ALPHA_SCHEMA.bunq_connection SET access_token_encrypted = 'not-a-grant'")

            api(get(ACCOUNT), ALPHA_MEMBER)
                .andExpect(status().isUnprocessableEntity)
                .andExpect(jsonPath("$.code").value("BUNQ_REJECTED"))
            api(pick(TEAMKAS), ALPHA_MEMBER)
                .andExpect(status().isUnprocessableEntity)
                .andExpect(jsonPath("$.code").value("BUNQ_REJECTED"))
        }

        test("disconnecting deletes the connection and the money pool reads NotConnected again") {
            connect(newLogin())
            api(pick(TEAMKAS), ALPHA_MEMBER).andExpect(status().isNoContent)

            api(delete(CONNECTION), ALPHA_MEMBER).andExpect(status().isNoContent)

            connectionRows(ALPHA_SCHEMA) shouldBe 0
            api(get(MONEY_POOL), ALPHA_MEMBER).andExpect(jsonPath("$.state").value("NotConnected"))
            api(get(CONNECTION), ALPHA_MEMBER)
                .andExpect(jsonPath("$.connected").value(false))
                .andExpect(jsonPath("$.accountPicked").value(false))
        }

        test("disconnecting while not connected is a no-op") {
            api(delete(CONNECTION), ALPHA_MEMBER).andExpect(status().isNoContent)

            connectionRows(ALPHA_SCHEMA) shouldBe 0
        }

        test("the callback writes to the team that started the flow, even when the session's Active Team is another team") {
            jdbcTemplate.update(
                "INSERT INTO public.team_members (team_id, user_id, role) VALUES (?::uuid, ?::uuid, 'USER')",
                BETA_TEAM, ALPHA_MEMBER,
            )
            activeTeamOf(ALPHA_MEMBER, ALPHA_TEAM)
            val state = start(ALPHA_MEMBER)
            val back = approve(state, login = newLogin())
            activeTeamOf(ALPHA_MEMBER, BETA_TEAM)

            callback(back)
                .andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=connected"))

            connectionRows(ALPHA_SCHEMA) shouldBe 1
            connectionRows(BETA_SCHEMA) shouldBe 0
        }

        test("a state works once: replaying the callback fails and leaves the connection as it was") {
            val back = approve(start(ALPHA_MEMBER), login = newLogin())
            callback(back).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=connected"))
            val before = storedGrant(ALPHA_SCHEMA)

            callback(back).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=error"))

            storedGrant(ALPHA_SCHEMA) shouldBe before
        }

        test("an expired state fails and writes nothing") {
            val state = start(ALPHA_MEMBER)
            val back = approve(state, login = newLogin())
            jdbcTemplate.update(
                "UPDATE public.bunq_oauth_states SET expires_at = now() - interval '1 minute' WHERE team_id = ?::uuid",
                ALPHA_TEAM,
            )

            callback(back).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=error"))

            connectionRows(ALPHA_SCHEMA) shouldBe 0
        }

        test("an unknown or missing state fails to the app's root and writes nothing") {
            val back = approve(start(ALPHA_MEMBER), login = newLogin())

            mockMvc.perform(get(back.replace(Regex("state=[^&]+"), "state=never-issued")))
                .andExpect(status().isFound)
                .andExpect(header().string("Location", FRONTEND_ROOT))
            mockMvc.perform(get("/api/bunq/oauth/callback?code=abc")).andExpect(header().string("Location", FRONTEND_ROOT))

            connectionRows(ALPHA_SCHEMA) shouldBe 0
        }

        test("declining at Bunq is reported as declined and writes nothing") {
            val state = start(ALPHA_MEMBER)

            callback(decline(state)).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=declined"))

            connectionRows(ALPHA_SCHEMA) shouldBe 0
        }

        test("an admin demoted between the start and the callback connects nothing") {
            val back = approve(start(ALPHA_MEMBER), login = newLogin())
            jdbcTemplate.update(
                "UPDATE public.team_members SET role = 'USER' WHERE team_id = ?::uuid AND user_id = ?::uuid",
                ALPHA_TEAM, ALPHA_MEMBER,
            )

            callback(back).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=error"))

            connectionRows(ALPHA_SCHEMA) shouldBe 0
        }

        test("a callback without the admin's session fails, spends the state and writes nothing") {
            val back = approve(start(ALPHA_MEMBER), login = newLogin())

            callback(back, signedInAs = null).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=error"))
            callback(back).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=error"))

            connectionRows(ALPHA_SCHEMA) shouldBe 0
        }

        test("a browser signed in as someone else cannot complete another admin's flow") {
            val back = approve(start(ALPHA_MEMBER), login = newLogin())

            callback(back, signedInAs = BETA_MEMBER).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=error"))

            connectionRows(ALPHA_SCHEMA) shouldBe 0
            connectionRows(BETA_SCHEMA) shouldBe 0
        }

        test("reconnecting replaces the grant and keeps the picked account") {
            connect(newLogin())
            api(pick(TEAMKAS), ALPHA_MEMBER).andExpect(status().isNoContent)
            val first = storedGrant(ALPHA_SCHEMA)

            connect(newLogin())

            (storedGrant(ALPHA_SCHEMA) == first) shouldBe false
            connectionRows(ALPHA_SCHEMA) shouldBe 1
            pickedAccount(ALPHA_SCHEMA) shouldBe TEAMKAS
            api(get(MONEY_POOL), ALPHA_MEMBER).andExpect(jsonPath("$.state").value("Connected"))
        }

        test("the fake approval page only sends the browser back to this app's own callback") {
            val state = start(ALPHA_MEMBER)

            mockMvc.perform(get("/internal/fake-bunq/authorize?state=$state&redirect_uri=https://evil.example/steal"))
                .andExpect(status().isBadRequest)
            mockMvc.perform(
                get("/internal/fake-bunq/decide?state=$state&redirect_uri=https://evil.example/steal&login=x&decision=approve"),
            ).andExpect(status().isBadRequest)
        }
    }

    private fun newLogin() = "it-${UUID.randomUUID()}"

    /** Connects [ALPHA_MEMBER]'s team through the whole flow as [login]. */
    private fun connect(login: String) {
        callback(approve(start(ALPHA_MEMBER), login)).andExpect(header().string("Location", "$ALPHA_SETTINGS?bunq=connected"))
    }

    /** Starts as [userId] and returns the plaintext state, read from the Bunq page URL the API answers with. */
    private fun start(userId: String): String {
        val url = api(post(CONNECTION), userId)
            .andExpect(status().isCreated)
            .andReturn().response.contentAsString
            .let { json.readTree(it).get("url").asString() }
        return UriComponentsBuilder.fromUriString(url).build().queryParams.getFirst("state")!!
    }

    /** The callback URL Bunq would send the browser to after [login] approved. */
    private fun approve(state: String, login: String): String = decide(state, "approve", login)

    private fun decline(state: String): String = decide(state, "decline", "unused")

    private fun decide(state: String, decision: String, login: String): String =
        mockMvc.perform(
            get("/internal/fake-bunq/decide")
                .param("state", state)
                .param("redirect_uri", CALLBACK)
                .param("login", login)
                .param("decision", decision),
        ).andExpect(status().isFound)
            .andReturn().response.getHeader("Location")!!
            .also { it shouldStartWith "$CALLBACK?" }

    private fun callback(url: String, signedInAs: String? = ALPHA_MEMBER): ResultActions {
        val request = get(URI.create(url))
        return mockMvc.perform(signedInAs?.let { request.with(loginAs(it)) } ?: request)
    }

    /** The wirespec handlers are suspend functions, so every answer arrives through an async dispatch. */
    private fun api(builder: MockHttpServletRequestBuilder, userId: String): ResultActions =
        mockMvc.perform(builder.with(loginAs(userId)))
            .andExpect(request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(asyncDispatch(it)) }

    private fun pick(accountId: String): MockHttpServletRequestBuilder =
        put(ACCOUNT).contentType(MediaType.APPLICATION_JSON).content("""{"accountId":"$accountId"}""")

    private fun pickedAccount(schema: String): String? =
        jdbcTemplate.queryForList("SELECT bunq_account_id FROM $schema.bunq_connection", String::class.java).singleOrNull()

    private fun connectionRows(schema: String) =
        jdbcTemplate.queryForObject("SELECT count(*) FROM $schema.bunq_connection", Int::class.java)!!

    private fun activeTeamOf(userId: String, teamId: String) {
        jdbcTemplate.update("UPDATE public.users SET last_active_team_id = ?::uuid WHERE id = ?::uuid", teamId, userId)
    }

    private fun storedGrant(schema: String) =
        jdbcTemplate.queryForObject("SELECT access_token_encrypted FROM $schema.bunq_connection", String::class.java)!!

    private fun stateRows() =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.bunq_oauth_states WHERE team_id IN (?::uuid, ?::uuid)",
            Int::class.java, ALPHA_TEAM, BETA_TEAM,
        )!!
}
