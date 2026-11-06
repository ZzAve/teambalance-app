package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.core.env.Environment
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.web.filter.OncePerRequestFilter
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger

/**
 * Reproduces the production "intermittent 500 on the first authenticated burst" symptom
 * (tenant-scoped endpoints 500, retries succeed).
 *
 * Root cause: after login the session holds only USER_ID; the tenant routing (tenantSchema /
 * tenantTeamId) is memoized onto the session lazily by SessionTenantContextFilter on the first
 * authenticated request(s). When the SPA fires a concurrent burst, several requests cache-miss at
 * once and each `setAttribute` the same not-yet-persisted attributes; Spring Session JDBC then issues
 * a plain INSERT per request in `commitSession()`, so all but the first collide on
 * `spring_session_attributes_pk` → DuplicateKeyException. That escapes in the servlet commit phase,
 * below @RestControllerAdvice, as a raw empty-body 500.
 *
 * This needs a REAL servlet container (RANDOM_PORT) driving the real filter + Spring Session commit:
 * MockMvc runs each request on one thread with no concurrent commit, so it cannot exhibit the race.
 * That is the justification for the only real-server IT in the suite (see docs/testing.md PR gate).
 *
 * Sign-in pins the routing, but a session can still lack it while its user has a team (teamless at
 * sign-in, member later). The INSERT is made an upsert in `SessionConfig`, so concurrent first writes
 * of the same attribute no longer collide.
 *
 * The filter itself no longer writes the memo (#469): a lazy write committing after a team switch put
 * the old team back. Only sign-in and a switch pin it, so a session without one resolves per request.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(ConcurrentSessionTenantIT.RequestHoldConfig::class)
class ConcurrentSessionTenantIT : TeamBalanceIT() {

    @Autowired lateinit var env: Environment

    @Autowired lateinit var requestHold: RequestHold

    @Autowired lateinit var jdbcTemplate: JdbcTemplate

    @Autowired lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("a concurrent burst on a freshly-authenticated session never 500s") {
            seedTeamAndAdmin()
            val cookie = login(ADMIN_EMAIL)

            burstServerErrors(cookie) shouldBe emptyMap()
        }

        // Sign-in pins nothing for a teamless user, so their session has no tenant memo. Once a
        // membership appears out-of-band (an invite claimed in another browser, an admin adding them),
        // every request of the next burst resolves the landing from the database.
        test("a concurrent burst after a teamless session gains a team never 500s") {
            seedTeamAndAdmin()
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$LATE_USER_ID'::uuid, '$LATE_EMAIL', '$LATE_EMAIL') ON CONFLICT DO NOTHING",
            )
            val cookie = login(LATE_EMAIL)
            jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LATE_USER_ID'::uuid, 'USER', 'Setter')")

            burstServerErrors(cookie) shouldBe emptyMap()
        }

        // The upsert makes the last session commit win, so a lazy memo written from a stale
        // resolution can replace the memo of a switch that committed before it (issue #469).
        // Ordering is forced, not timed: request A is parked after its filter chain ran (memo
        // resolved from the old last_active_team, session not yet committed) while request B switches.
        test("a lazy memo write that commits after a team switch does not undo the switch") {
            seedTeamAndAdmin()
            seedTeam(TEAM_Y_ID, TEAM_Y_SLUG, SCHEMA_Y)
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$RACER_USER_ID'::uuid, '$RACER_EMAIL', '$RACER_EMAIL') ON CONFLICT DO NOTHING",
            )
            val cookie = login(RACER_EMAIL)
            jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$RACER_USER_ID'::uuid, 'USER', 'Setter')")
            jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_Y_ID'::uuid, '$RACER_USER_ID'::uuid, 'USER', 'Setter')")
            jdbcTemplate.update(
                "UPDATE public.users SET last_active_team_id = ?::uuid WHERE id = ?::uuid",
                TEAM_ID,
                RACER_USER_ID,
            )

            requestHold.arm()
            val slowRequest = sendAsync("GET", "/api/auth/me", cookie, hold = true)
            check(requestHold.awaitArrival()) { "request A never reached the hold" }

            try {
                send("POST", "/api/teams/$TEAM_Y_SLUG/activate", cookie).statusCode() shouldBe 200
            } finally {
                requestHold.release()
            }
            slowRequest.get(30, TimeUnit.SECONDS).statusCode() shouldBe 200

            activeTeamSlugOnMe(cookie) shouldBe TEAM_Y_SLUG
        }
    }

    /** Fires a burst of tenant-scoped GETs on one session at once; answers the 5xx statuses seen, by count. */
    private fun burstServerErrors(cookie: String): Map<Int, Int> {
        val port = env.getProperty("local.server.port")!!.toInt()
        val client = HttpClient.newHttpClient()
        val endpoints = listOf(
            "/api/events?include-past=false",
            "/api/event-types",
            "/api/team/season",
        )

        val total = 300
        val pool = Executors.newFixedThreadPool(24)
        val gate = CountDownLatch(1)
        val done = CountDownLatch(total)
        val statusCounts = ConcurrentHashMap<Int, AtomicInteger>()

        repeat(total) { i ->
            val path = endpoints[i % endpoints.size]
            pool.submit {
                try {
                    gate.await()
                    val resp = client.send(
                        HttpRequest.newBuilder()
                            .uri(URI.create("http://127.0.0.1:$port$path"))
                            .header("Cookie", cookie)
                            .GET().build(),
                        HttpResponse.BodyHandlers.discarding(),
                    )
                    statusCounts.computeIfAbsent(resp.statusCode()) { AtomicInteger() }.incrementAndGet()
                } finally {
                    done.countDown()
                }
            }
        }
        gate.countDown()
        done.await(60, TimeUnit.SECONDS)
        pool.shutdownNow()

        return statusCounts.filterKeys { it >= 500 }.mapValues { it.value.get() }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun request(method: String, path: String, cookie: String, hold: Boolean = false): HttpRequest {
        val port = env.getProperty("local.server.port")!!.toInt()
        return HttpRequest.newBuilder()
            .uri(URI.create("http://127.0.0.1:$port$path"))
            // The SPA double-submit CSRF scheme: the header echoes the XSRF-TOKEN cookie.
            .header("Cookie", "$cookie; XSRF-TOKEN=$CSRF_TOKEN")
            .header("X-XSRF-TOKEN", CSRF_TOKEN)
            .apply { if (hold) header(RequestHold.HEADER, "1") }
            .method(method, HttpRequest.BodyPublishers.noBody())
            .build()
    }

    private fun send(method: String, path: String, cookie: String) =
        HttpClient.newHttpClient().send(request(method, path, cookie), HttpResponse.BodyHandlers.ofString())

    private fun sendAsync(method: String, path: String, cookie: String, hold: Boolean): CompletableFuture<HttpResponse<String>> =
        HttpClient.newHttpClient().sendAsync(request(method, path, cookie, hold), HttpResponse.BodyHandlers.ofString())

    /** The Active Team as `/api/auth/me` reports it: what the next request on this session is routed to. */
    private fun activeTeamSlugOnMe(cookie: String): String? =
        Regex("\"activeTeam\":\\{[^}]*\"slug\":\"([^\"]+)\"")
            .find(send("GET", "/api/auth/me", cookie).body())?.groupValues?.get(1)

    private fun login(email: String): String {
        val port = env.getProperty("local.server.port")!!.toInt()
        val raw = "concurrency-${UUID.randomUUID()}"
        seedUnusedToken(raw, email)
        val resp = HttpClient.newHttpClient().send(
            HttpRequest.newBuilder()
                .uri(URI.create("http://127.0.0.1:$port/api/auth/magic-link/verify"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("""{"token":"$raw"}"""))
                .build(),
            HttpResponse.BodyHandlers.ofString(),
        )
        check(resp.statusCode() == 200) { "login failed: ${resp.statusCode()} ${resp.body()}" }
        return resp.headers().allValues("set-cookie")
            .firstOrNull { it.startsWith("SESSION=") }
            ?.substringBefore(";")
            ?: error("no SESSION cookie in verify response")
    }

    private fun seedUnusedToken(rawToken: String, email: String) {
        jdbcTemplate.update(
            "INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, used_at, created_at) " +
                "VALUES (?, ?, ?, ?, NULL, now())",
            UUID.randomUUID(),
            sha256(rawToken),
            email,
            Timestamp.from(Instant.now().plusSeconds(900)),
        )
    }

    // Seed into a dedicated tenant schema (not the shared `public` team) so this spec never collides
    // with the other ITs on `teams.schema_name UNIQUE` in the shared Testcontainers database.
    private fun seedTeamAndAdmin() {
        tenantSchemaAdapter.provisionPlatformSchema()
        seedTeam(TEAM_ID, "concurrency-team", SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$ADMIN_USER_ID'::uuid, '$ADMIN_EMAIL', '$ADMIN_EMAIL') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$ADMIN_USER_ID'::uuid, 'ADMIN', 'Setter')")
    }

    private fun seedTeam(id: String, slug: String, schema: String) {
        tenantSchemaAdapter.provisionTenantSchema(schema)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$id'::uuid, '$slug', '$slug', '$schema') ON CONFLICT DO NOTHING",
        )
    }

    private fun sha256(value: String): String =
        MessageDigest.getInstance("SHA-256").digest(value.toByteArray()).joinToString("") { "%02x".format(it) }

    /**
     * Test seam: parks a request that carries [HEADER] once the security chain has run, which is
     * after the tenant routing was resolved from the session or the database and before the session
     * commits. Requests without the header pass straight through.
     */
    class RequestHold : OncePerRequestFilter() {
        @Volatile private var arrived = CountDownLatch(1)

        @Volatile private var released = CountDownLatch(1)

        fun arm() {
            arrived = CountDownLatch(1)
            released = CountDownLatch(1)
        }

        fun awaitArrival(): Boolean = arrived.await(30, TimeUnit.SECONDS)

        fun release() = released.countDown()

        override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
            if (request.getHeader(HEADER) != null) {
                arrived.countDown()
                check(released.await(30, TimeUnit.SECONDS)) { "held request was never released" }
            }
            chain.doFilter(request, response)
        }

        companion object {
            const val HEADER = "X-Test-Hold"
        }
    }

    @TestConfiguration
    class RequestHoldConfig {
        @Bean
        fun requestHold() = RequestHold()
    }

    companion object {
        private const val ADMIN_USER_ID = "b0000000-0000-0000-0000-0000000000f1"
        private const val ADMIN_EMAIL = "concurrency-admin@test.com"
        private const val TEAM_ID = "a0000000-0000-0000-0000-0000000000f1"
        private const val SCHEMA = "team_concurrency"
        private const val LATE_USER_ID = "b0000000-0000-0000-0000-0000000000f2"
        private const val LATE_EMAIL = "concurrency-late@test.com"
        private const val RACER_USER_ID = "b0000000-0000-0000-0000-0000000000f3"
        private const val RACER_EMAIL = "concurrency-racer@test.com"
        private const val TEAM_Y_ID = "a0000000-0000-0000-0000-0000000000f2"
        private const val TEAM_Y_SLUG = "concurrency-team-y"
        private const val SCHEMA_Y = "team_concurrency_y"
        private const val CSRF_TOKEN = "concurrency-csrf-token"
    }
}
