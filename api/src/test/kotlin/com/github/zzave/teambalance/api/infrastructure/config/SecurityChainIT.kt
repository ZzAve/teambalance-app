package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.infrastructure.email.FakeEmailGateway
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import jakarta.servlet.http.Cookie
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.http.MediaType
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import java.util.UUID

/**
 * The SecurityFilterChain's three promises (ADR-0012), proven through the same requests the SPA makes:
 * a sign-in never keeps the session ID it arrived with, a mutating request needs the CSRF token the SPA
 * echoes from the `XSRF-TOKEN` cookie, and anything outside the public list is refused before a
 * controller runs.
 */
@AutoConfigureMockMvc
@Import(SecurityChainIT.TestConfig::class)
class SecurityChainIT : TeamBalanceIT() {

    @TestConfiguration
    class TestConfig {
        @Bean
        @Primary
        fun emailGateway(): EmailGateway = FakeEmailGateway()
    }

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var fakeEmailGateway: FakeEmailGateway

    @Autowired
    lateinit var applicationContext: ApplicationContext

    init {
        test("verify replaces the session the caller arrived with, and the old ID stops working") {
            val email = "fixation-${UUID.randomUUID()}@test.com"
            val planted = signIn(email)

            val rotated = signIn(email, presenting = planted)

            rotated.value shouldNotBe planted.value
            perform(get("/api/auth/me").cookie(planted)).status shouldBe 401
            perform(get("/api/auth/me").cookie(rotated)).status shouldBe 200
        }

        test("the magic-link endpoints need no CSRF token, so a browser's first request can sign in") {
            // signIn sends neither the XSRF-TOKEN cookie nor the header.
            signIn("first-visit-${UUID.randomUUID()}@test.com").shouldNotBeNull()
        }

        test("the magic-link exemption covers JSON only: a cross-site form post to verify is refused") {
            val email = "form-post-${UUID.randomUUID()}@test.com"
            perform(
                post("/api/auth/magic-link/request")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"email":"$email"}"""),
            ).status shouldBe 202
            val token = fakeEmailGateway.sentMagicLinks.last { it.first.value == email }.second

            // What an HTML form with enctype="text/plain" sends; a browser needs no CORS preflight for it.
            val formPost = perform(
                post("/api/auth/magic-link/verify")
                    .contentType(MediaType.TEXT_PLAIN)
                    .content("""{"token":"$token","x":"="}"""),
            )

            formPost.status shouldBe 403
            formPost.getCookie(SESSION_COOKIE) shouldBe null
        }

        test("no in-memory user is configured: the session is the only way in") {
            applicationContext.getBeanNamesForType(UserDetailsService::class.java).toList().shouldBeEmpty()
        }

        test("a mutating request without the CSRF token is refused, and the session survives it") {
            val session = signIn("no-token-${UUID.randomUUID()}@test.com")

            perform(post("/api/auth/logout").cookie(session)).status shouldBe 403

            perform(get("/api/auth/me").cookie(session)).status shouldBe 200
        }

        test("a GET issues the XSRF-TOKEN cookie, and echoing its raw value as X-XSRF-TOKEN is accepted") {
            val session = signIn("echo-${UUID.randomUUID()}@test.com")
            val xsrf = perform(get("/api/auth/me").cookie(session)).getCookie(XSRF_COOKIE).shouldNotBeNull()
            // Host-only outside prod: the parent-domain scope is prod's alone (ProdProfileSmokeIT).
            xsrf.domain shouldBe null

            val logout = perform(
                post("/api/auth/logout").cookie(session, xsrf).header(XSRF_HEADER, xsrf.value),
            )

            logout.status shouldBe 204
            perform(get("/api/auth/me").cookie(session)).status shouldBe 401
        }

        test("a token that does not match the cookie is refused") {
            val session = signIn("mismatch-${UUID.randomUUID()}@test.com")
            val xsrf = perform(get("/api/auth/me").cookie(session)).getCookie(XSRF_COOKIE).shouldNotBeNull()

            perform(post("/api/auth/logout").cookie(session, xsrf).header(XSRF_HEADER, "not-the-token"))
                .status shouldBe 403
        }

        test("a protected endpoint answers 401 to a caller without a session, before any controller runs") {
            perform(get("/api/events")).status shouldBe 401
            perform(get("/api/team/season")).status shouldBe 401
        }

        test("the public endpoints answer without a session") {
            perform(get("/api/ping")).status shouldBe 204
            perform(get("/api/auth/me")).status shouldBe 401
            perform(get("/internal/actuator/health")).status shouldBe 200
            // The feed's own refusal (an unknown team) rather than the chain's 401.
            perform(get("/api/calendar/no-such-team/no-such-token.ics")).status shouldBe 404
        }

        test("the default security headers are on") {
            val response = perform(get("/api/ping"))

            response.getHeader("X-Content-Type-Options") shouldBe "nosniff"
            response.getHeader("X-Frame-Options") shouldBe "DENY"
        }
    }

    private fun signIn(email: String, presenting: Cookie? = null): Cookie {
        perform(
            post("/api/auth/magic-link/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"email":"$email"}"""),
        ).status shouldBe 202
        val token = fakeEmailGateway.sentMagicLinks.last { it.first.value == email }.second

        val verify = post("/api/auth/magic-link/verify")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"token":"$token"}""")
        presenting?.let { verify.cookie(it) }
        val verified = perform(verify)
        verified.status shouldBe 200
        return verified.getCookie(SESSION_COOKIE).shouldNotBeNull()
    }

    /** Follows the async dispatch the suspend (Wirespec) handlers start; a filter's refusal never gets that far. */
    private fun perform(builder: MockHttpServletRequestBuilder): MockHttpServletResponse {
        val started = mockMvc.perform(builder).andReturn()
        return if (started.request.isAsyncStarted) {
            mockMvc.perform(asyncDispatch(started)).andReturn().response
        } else {
            started.response
        }
    }

    private companion object {
        const val SESSION_COOKIE = "SESSION"
        const val XSRF_COOKIE = "XSRF-TOKEN"
        const val XSRF_HEADER = "X-XSRF-TOKEN"
    }
}
