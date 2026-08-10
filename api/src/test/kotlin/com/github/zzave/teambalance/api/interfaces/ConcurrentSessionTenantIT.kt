package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import io.kotest.assertions.withClue
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.core.env.Environment
import org.springframework.jdbc.core.JdbcTemplate
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID
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
 * Currently RED (the race fires); it turns GREEN once the tenant routing is resolved without a
 * concurrent first-write to the session (e.g. set once at login, or resolved per-request instead of
 * memoized on the servlet session).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ConcurrentSessionTenantIT : TeamBalanceIT() {

    @Autowired lateinit var env: Environment

    @Autowired lateinit var jdbcTemplate: JdbcTemplate

    @Autowired lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        test("a concurrent burst on a freshly-authenticated session never 500s") {
            seedTeamAndAdmin()
            val cookie = login(ADMIN_EMAIL)

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

            val serverErrors = statusCounts.filterKeys { it >= 500 }.values.sumOf { it.get() }
            withClue("status distribution: ${statusCounts.mapValues { it.value.get() }.toSortedMap()}") {
                serverErrors shouldBe 0
            }
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

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
        tenantSchemaManager.provisionPlatformSchema()
        tenantSchemaManager.provisionTenantSchema(SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Concurrency Team', 'concurrency-team', '$SCHEMA') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$ADMIN_USER_ID'::uuid, '$ADMIN_EMAIL', '$ADMIN_EMAIL') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$ADMIN_USER_ID'::uuid, 'ADMIN', 'Setter')")
    }

    private fun sha256(value: String): String =
        MessageDigest.getInstance("SHA-256").digest(value.toByteArray()).joinToString("") { "%02x".format(it) }

    companion object {
        private const val ADMIN_USER_ID = "b0000000-0000-0000-0000-0000000000f1"
        private const val ADMIN_EMAIL = "concurrency-admin@test.com"
        private const val TEAM_ID = "a0000000-0000-0000-0000-0000000000f1"
        private const val SCHEMA = "team_concurrency"
    }
}
