package com.github.zzave.teambalance.api.interfaces

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.email.FakeEmailGateway
import com.github.zzave.teambalance.api.infrastructure.identity.SessionKeys
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import jakarta.servlet.http.Cookie
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Base64
import java.util.UUID
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf

@AutoConfigureMockMvc
class AuthControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var fakeEmailGateway: FakeEmailGateway

    init {
        test("request -> verify -> me -> logout -> me(401) full magic-link loop") {
            val email = "loop-${UUID.randomUUID()}@test.com"

            requestMagicLink(email)
            val token = fakeEmailGateway.sentMagicLinks.last { it.first.value == email }.second
            val session = verify(token, expectOk = true)!!

            // No name is collected at magic-link signup, so a first-time sign-in derives a placeholder
            // from the email's local part. Pin it end to end: the derived name is what got stored in
            // public.users and what /me reads back.
            val expectedDisplayName = email.substringBefore("@")
            val (_, me) = performAsync(MockMvcRequestBuilders.get("/api/auth/me").cookie(session))
            me.andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(email))
                .andExpect(MockMvcResultMatchers.jsonPath("$.displayName").value(expectedDisplayName))
                .andExpect(MockMvcResultMatchers.jsonPath("$.isPlatformAdmin").value(false))

            jdbcTemplate.queryForObject(
                "SELECT display_name FROM public.users WHERE email = ?",
                String::class.java,
                email,
            ) shouldBe expectedDisplayName

            val (_, logout) = performAsync(MockMvcRequestBuilders.post("/api/auth/logout").cookie(session).with(csrf()))
            logout.andExpect(MockMvcResultMatchers.status().isNoContent)

            val (_, meAfterLogout) = performAsync(MockMvcRequestBuilders.get("/api/auth/me").cookie(session))
            meAfterLogout.andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }

        test("authenticated session is stored in Postgres, not the JVM heap (survives a restart)") {
            val email = "persist-${UUID.randomUUID()}@test.com"

            requestMagicLink(email)
            val token = fakeEmailGateway.sentMagicLinks.last { it.first.value == email }.second
            val session = verify(token, expectOk = true)!!

            // The session cookie carries a Base64-encoded session id → the SESSION_ID column. Its
            // userId lives in a SPRING_SESSION_ATTRIBUTES row in Postgres, not in any JVM-heap
            // HttpSession — which is exactly why it survives a new pod boot / redeploy / scale-from-zero.
            val sessionId = String(Base64.getDecoder().decode(session.value))
            val primaryId = jdbcTemplate.queryForObject(
                "SELECT primary_id FROM public.spring_session WHERE session_id = ?",
                String::class.java,
                sessionId,
            )
            primaryId shouldNotBe null

            val attributeNames = jdbcTemplate.queryForList(
                "SELECT attribute_name FROM public.spring_session_attributes WHERE session_primary_id = ?",
                String::class.java,
                primaryId,
            )
            attributeNames shouldContain SessionKeys.USER_ID
        }

        test("an allowlisted caller is a platform admin on /me") {
            val email = "platform-admin@test.com"

            requestMagicLink(email)
            val token = fakeEmailGateway.sentMagicLinks.last { it.first.value == email }.second
            val session = verify(token, expectOk = true)!!

            val (_, me) = performAsync(MockMvcRequestBuilders.get("/api/auth/me").cookie(session))
            me.andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(email))
                .andExpect(MockMvcResultMatchers.jsonPath("$.isPlatformAdmin").value(true))
        }

        test("verify rejects an already-used token and an expired token") {
            val email = "reject-${UUID.randomUUID()}@test.com"

            requestMagicLink(email)
            val token = fakeEmailGateway.sentMagicLinks.last { it.first.value == email }.second
            verify(token, expectOk = true)
            verify(token, expectOk = false)

            val expiredToken = "expired-${UUID.randomUUID()}"
            jdbcTemplate.update(
                """
                INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, used_at, created_at)
                VALUES (?, ?, ?, ?, NULL, now())
                """,
                UUID.randomUUID(),
                sha256(expiredToken),
                email,
                Timestamp.from(Instant.now().minus(1, ChronoUnit.HOURS)),
            )
            verify(expiredToken, expectOk = false)
        }

        test("magic links requested under differently-cased addresses sign in as one user") {
            val local = "case-${UUID.randomUUID()}"
            val normalised = "$local@example.com"

            requestMagicLink("  ${local.uppercase()}@Example.com ")
            requestMagicLink(normalised)
            val (first, second) = fakeEmailGateway.sentMagicLinks.filter { it.first.value == normalised }.map { it.second }

            val firstSession = verify(first, expectOk = true)!!
            val secondSession = verify(second, expectOk = true)!!

            userIdOnMe(firstSession) shouldBe userIdOnMe(secondSession)
            jdbcTemplate.queryForList(
                "SELECT email FROM public.users WHERE lower(email) = ?",
                String::class.java,
                normalised,
            ) shouldBe listOf(normalised)
        }

        test("a magic-link request for a malformed email is a 400 and sends nothing") {
            val malformed = "no-at-sign-${UUID.randomUUID()}"

            val (_, dispatched) = performAsync(
                MockMvcRequestBuilders.post("/api/auth/magic-link/request")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"email":"$malformed"}"""),
            )

            dispatched.andExpect(MockMvcResultMatchers.status().isBadRequest)
            fakeEmailGateway.sentMagicLinks.none { it.first.value.startsWith(malformed) } shouldBe true
        }
    }

    private fun userIdOnMe(session: Cookie): String {
        val (_, me) = performAsync(MockMvcRequestBuilders.get("/api/auth/me").cookie(session))
        return ObjectMapper().readTree(me.andReturn().response.contentAsString)["id"].asText()
    }

    private fun requestMagicLink(email: String) {
        val (_, dispatched) = performAsync(
            MockMvcRequestBuilders.post("/api/auth/magic-link/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"email":"$email"}"""),
        )
        dispatched.andExpect(MockMvcResultMatchers.status().isAccepted)
    }

    /**
     * Returns the Spring Session cookie on success — session identity is carried by cookie (default
     * name `SESSION`), not by a heap-resident HttpSession. Read generically so the test is agnostic
     * to the cookie name.
     */
    private fun verify(token: String, expectOk: Boolean): Cookie? {
        val (_, dispatched) = performAsync(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"token":"$token"}"""),
        )
        if (expectOk) {
            dispatched.andExpect(MockMvcResultMatchers.status().isOk)
        } else {
            dispatched.andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
        return dispatched.andReturn().response.getCookie("SESSION")
    }

    private fun performAsync(builder: MockHttpServletRequestBuilder): Pair<MvcResult, ResultActions> {
        val started = mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
        return started to mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
    }

    private fun sha256(value: String): String =
        MessageDigest.getInstance("SHA-256").digest(value.toByteArray()).joinToString("") { "%02x".format(it) }
}
