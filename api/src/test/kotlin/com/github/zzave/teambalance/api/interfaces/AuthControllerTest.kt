package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.port.EmailSender
import com.github.zzave.teambalance.api.infrastructure.email.FakeEmailSender
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpSession
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
import java.util.UUID

@AutoConfigureMockMvc
@Import(AuthControllerTest.TestConfig::class)
class AuthControllerTest : TeamBalanceIT() {

    @TestConfiguration
    class TestConfig {
        @Bean
        @Primary
        fun emailSender(): EmailSender = FakeEmailSender()
    }

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    @Autowired
    lateinit var fakeEmailSender: FakeEmailSender

    init {
        test("request -> verify -> me -> logout -> me(401) full magic-link loop") {
            tenantSchemaManager.provisionPlatformSchema()
            val email = "loop-${UUID.randomUUID()}@test.com"

            requestMagicLink(email)
            val token = fakeEmailSender.sentMagicLinks.last { it.first == email }.second
            val session = verify(token, expectOk = true)

            val (_, me) = performAsync(MockMvcRequestBuilders.get("/api/auth/me").session(session))
            me.andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(email))

            val (_, logout) = performAsync(MockMvcRequestBuilders.post("/api/auth/logout").session(session))
            logout.andExpect(MockMvcResultMatchers.status().isNoContent)

            val (_, meAfterLogout) = performAsync(MockMvcRequestBuilders.get("/api/auth/me").session(session))
            meAfterLogout.andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }

        test("verify rejects an already-used token and an expired token") {
            tenantSchemaManager.provisionPlatformSchema()
            val email = "reject-${UUID.randomUUID()}@test.com"

            requestMagicLink(email)
            val token = fakeEmailSender.sentMagicLinks.last { it.first == email }.second
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
    }

    private fun requestMagicLink(email: String) {
        val (_, dispatched) = performAsync(
            MockMvcRequestBuilders.post("/api/auth/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"email":"$email"}"""),
        )
        dispatched.andExpect(MockMvcResultMatchers.status().isAccepted)
    }

    private fun verify(token: String, expectOk: Boolean): MockHttpSession {
        val (started, dispatched) = performAsync(
            MockMvcRequestBuilders.post("/api/auth/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"token":"$token"}"""),
        )
        if (expectOk) {
            dispatched.andExpect(MockMvcResultMatchers.status().isOk)
        } else {
            dispatched.andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
        return started.request.session as MockHttpSession
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
