package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.persistence.SqlFault
import com.github.zzave.teambalance.api.infrastructure.persistence.SqlFaultInjector
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.USERS
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Instant
import java.util.concurrent.CompletableFuture
import java.util.UUID

/**
 * Verifying a magic link consumes the token and resolves (creating if absent) the user for its
 * email — two writes across two aggregates (`magic_link_tokens` and `users`). If they are not one
 * transaction, a failure to create the user still burns the single-use token, and the person is left
 * with a dead link and no account. `AuthService` names no transaction, so that guarantee rests on
 * `MagicLinkTokenRepository.consumeAndResolveUser` being a single, `@Transactional` adapter call.
 *
 * The user creation is made to fail; the token must still be unused afterwards. Verified to be
 * load-bearing by deleting `@Transactional` from `JooqMagicLinkTokenRepositoryAdapter.consumeAndResolveUser`, which leaves the token consumed
 * with no user created — exactly the state the guarantee forbids.
 */
@AutoConfigureMockMvc
class MagicLinkSignInBoundaryIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var sqlFaultInjector: SqlFaultInjector

    init {
        test("a verify whose user creation fails leaves the magic-link token unused and creates no user") {
            val email = "atomic-signin-fault-${UUID.randomUUID()}@test.com"
            val rawToken = "fault-${UUID.randomUUID()}"
            seedUnusedToken(rawToken, email)

            sqlFaultInjector.failWhile(userCreationFailure) {
                verify(rawToken).andExpect(MockMvcResultMatchers.status().isBadRequest)
            }

            tokenUsedAt(rawToken) shouldBe null
            userExists(email) shouldBe false
        }

        test("a magic link can be verified only once") {
            val rawToken = "once-${UUID.randomUUID()}"
            seedUnusedToken(rawToken, "signin-once-${UUID.randomUUID()}@test.com")

            verify(rawToken).andExpect(MockMvcResultMatchers.status().isOk)
            verify(rawToken).andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }

        test("two links for the same new email verified at once sign in as one user") {
            val email = "signin-race-${UUID.randomUUID()}@test.com"
            val rawTokens = List(2) { "race-${UUID.randomUUID()}" }.onEach { seedUnusedToken(it, email) }

            val statuses = rawTokens
                .map { token -> CompletableFuture.supplyAsync { verify(token).andReturn().response.status } }
                .map { it.get() }

            statuses shouldBe listOf(200, 200)
            userCount(email) shouldBe 1
        }

        test("a healthy verify consumes the token and creates the user") {
            val email = "atomic-signin-ok-${UUID.randomUUID()}@test.com"
            val rawToken = "ok-${UUID.randomUUID()}"
            seedUnusedToken(rawToken, email)

            verify(rawToken).andExpect(MockMvcResultMatchers.status().isOk)

            tokenUsedAt(rawToken) shouldNotBe null
            userExists(email) shouldBe true
        }
    }

    // The consume is an UPDATE, so the only insert into users is the user creation that follows it.
    private val userCreationFailure = SqlFault.onInsertInto(USERS) {
        IllegalArgumentException("injected persistence failure creating the user")
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun verify(rawToken: String): ResultActions =
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"token":"$rawToken"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun seedUnusedToken(rawToken: String, email: String) {
        jdbcTemplate.update(
            """
            INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, used_at, created_at)
            VALUES (?, ?, ?, ?, NULL, now())
            """,
            UUID.randomUUID(),
            sha256(rawToken),
            email,
            Timestamp.from(Instant.now().plusSeconds(900)),
        )
    }

    private fun tokenUsedAt(rawToken: String): Timestamp? =
        jdbcTemplate.queryForObject(
            "SELECT used_at FROM public.magic_link_tokens WHERE token_hash = ?",
            Timestamp::class.java,
            sha256(rawToken),
        )

    private fun userExists(email: String): Boolean = userCount(email) > 0

    private fun userCount(email: String): Int =
        jdbcTemplate.queryForObject("SELECT count(*) FROM public.users WHERE email = ?", Int::class.java, email)!!

    private fun sha256(value: String): String =
        MessageDigest.getInstance("SHA-256").digest(value.toByteArray()).joinToString("") { "%02x".format(it) }
}
