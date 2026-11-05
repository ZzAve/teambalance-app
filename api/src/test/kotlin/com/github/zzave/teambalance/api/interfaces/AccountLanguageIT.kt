package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

// Ids dedicated to this spec: the Testcontainers DB is shared across specs with no per-test rollback.
private const val CHOOSER_ID = "d0000000-0000-0000-0000-0000000000c1"
private const val NEVER_CHOSE_ID = "d0000000-0000-0000-0000-0000000000c2"

@AutoConfigureMockMvc
class AccountLanguageIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private fun seed() {
        tenantSchemaAdapter.provisionPlatformSchema()
        listOf(CHOOSER_ID, NEVER_CHOSE_ID).forEachIndexed { i, id ->
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) VALUES ('$id'::uuid, 'language-$i@test.com', 'Language $i') " +
                    "ON CONFLICT (id) DO NOTHING",
            )
        }
        jdbcTemplate.execute(
            "UPDATE public.users SET language = NULL WHERE id IN ('$CHOOSER_ID'::uuid, '$NEVER_CHOSE_ID'::uuid)",
        )
    }

    // The Wirespec endpoints are suspend functions, so MockMvc answers a handled request in two steps.
    // A request refused before the handler (no session, unreadable body) is answered in one.
    private fun putLanguage(userId: String?, body: String): ResultActions {
        val builder = MockMvcRequestBuilders.put("/api/account/language").contentType("application/json").content(body)
        // A caller without a session still sends a valid CSRF token, so the refusal is about the session.
        val first = mockMvc.perform(builder.with(if (userId == null) csrf() else loginAs(userId)))
        val result = first.andReturn()
        return if (result.request.isAsyncStarted) mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result)) else first
    }

    // Signs in through a real magic link, so /api/auth/me is answered for the session that link starts.
    private fun meAs(userId: String): ResultActions {
        val email = jdbcTemplate.queryForObject("SELECT email FROM public.users WHERE id = ?::uuid", String::class.java, userId)
        val token = "language-it-${UUID.randomUUID()}"
        jdbcTemplate.update(
            "INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, created_at) " +
                "VALUES (?, ?, ?, ?, now())",
            UUID.randomUUID(),
            MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(it) },
            email,
            Timestamp.from(Instant.now().plus(1, ChronoUnit.HOURS)),
        )
        val verify = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify").contentType("application/json")
                .content("""{"token":"$token"}"""),
        ).andExpect(request().asyncStarted()).andReturn()
        val cookie = mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(verify))
            .andExpect(status().isOk).andReturn().response.getCookie("SESSION")!!
        val started = mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/me").cookie(cookie))
            .andExpect(request().asyncStarted()).andReturn()
        return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
    }

    private fun storedLanguage(userId: String): String? =
        jdbcTemplate.queryForObject("SELECT language FROM public.users WHERE id = ?::uuid", String::class.java, userId)

    init {
        test("a user who never chose a language has none on /api/auth/me") {
            seed()
            meAs(NEVER_CHOSE_ID).andExpect(status().isOk).andExpect(jsonPath("$.language").isEmpty)
        }

        test("a chosen language is stored on the user and returned by /api/auth/me") {
            seed()
            putLanguage(CHOOSER_ID, """{"language":"NL"}""").andExpect(status().isNoContent)

            storedLanguage(CHOOSER_ID) shouldBe "nl"
            meAs(CHOOSER_ID).andExpect(status().isOk).andExpect(jsonPath("$.language").value("NL"))
        }

        test("choosing again replaces the earlier choice") {
            seed()
            putLanguage(CHOOSER_ID, """{"language":"NL"}""").andExpect(status().isNoContent)
            putLanguage(CHOOSER_ID, """{"language":"EN"}""").andExpect(status().isNoContent)

            storedLanguage(CHOOSER_ID) shouldBe "en"
        }

        test("a language outside nl and en is refused with 400 and nothing is stored") {
            seed()
            putLanguage(CHOOSER_ID, """{"language":"DE"}""").andExpect(status().isBadRequest)

            storedLanguage(CHOOSER_ID) shouldBe null
        }

        test("without a session the language cannot be set") {
            seed()
            putLanguage(null, """{"language":"NL"}""").andExpect(status().isUnauthorized)
        }
    }
}
