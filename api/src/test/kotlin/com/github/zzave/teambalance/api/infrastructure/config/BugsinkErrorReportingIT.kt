package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import com.github.zzave.teambalance.testroutes.FailingController
import com.github.zzave.teambalance.testroutes.FailingFilter
import com.sun.net.httpserver.HttpServer
import io.kotest.assertions.nondeterministic.eventually
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldNotContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.core.Ordered
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import tools.jackson.databind.JsonNode
import tools.jackson.databind.json.JsonMapper
import java.net.InetSocketAddress
import java.util.concurrent.CopyOnWriteArrayList
import java.util.zip.GZIPInputStream
import kotlin.concurrent.thread
import kotlin.time.Duration.Companion.seconds

/**
 * Boots the `prod` profile with a Bugsink DSN, the way the live container is configured through its
 * environment, and receives the Sentry SDK's envelopes on a local HTTP server in place of Bugsink. It
 * proves that an unhandled exception and an ERROR log line become events with the environment, the
 * release and the OTel trace ID of the request, without user data or request secrets, and that a
 * domain exception mapped to a 4xx does not.
 */
@ActiveProfiles("prod", inheritProfiles = false)
@AutoConfigureMockMvc
@ContextConfiguration(initializers = [BugsinkErrorReportingIT.ReceiverDsn::class])
@TestPropertySource(
    properties = [
        "SENTRY_ENVIRONMENT=prod",
        "TEAMBALANCE_BUILD_SHA=0123abc",
        "teambalance.invitation.token-salt=prod-smoke-salt",
        "teambalance.invitation.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1zbW9rZS1rZXktMzJieXQ=",
        "teambalance.calendar-link.token-salt=prod-smoke-calendar-salt",
        "teambalance.calendar-link.token-encryption-key=cHJvZC1zbW9rZS1jYWxlbmRhci1rZXktMzJieXRlcyE=",
        "teambalance.bunq.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1idW5xLXNtb2tlLWtleTE=",
        "teambalance.email.api-key=prod-smoke-key",
        "teambalance.email.project-id=prod-smoke-project",
    ],
)
class BugsinkErrorReportingIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeSpec { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("an unhandled exception becomes one event with environment, release and the request's trace ID") {
            val traceId = "4bf92f3577b34da6a3ce929d0e0e4736"
            runCatching { getAsync("${FailingController.THROW_PATH}?token=secret-in-query", traceId) }

            eventually(15.seconds) {
                val event = receiver.events().single { it.exceptionType() == "UnhandledTestException" }

                event["environment"].asString() shouldBe "prod"
                event["release"].asString() shouldBe "0123abc"
                event["tags"]["trace_id"].asString() shouldBe traceId
            }
        }

        test("an exception thrown in a servlet filter becomes an event with the request's trace ID") {
            val traceId = "3bf92f3577b34da6a3ce929d0e0e4736"
            runCatching { getAsync(FailingFilter.PATH, traceId) }

            eventually(15.seconds) {
                val event = receiver.events().single { it.exceptionType() == "FilterFaultException" }

                event["tags"]["trace_id"].asString() shouldBe traceId
                // No route matched, so the SDK would name the event after the raw path, which can hold a
                // calendar-feed token.
                event["transaction"].shouldBeNull()
            }
        }

        test("an event carries no user data and no request URL, query, cookies or headers") {
            runCatching { getAsync(FailingController.THROW_PATH, "5bf92f3577b34da6a3ce929d0e0e4736") }

            eventually(15.seconds) {
                val event = receiver.events().last { it.exceptionType() == "UnhandledTestException" }

                event["user"].shouldBeNull()
                event["request"]?.get("url").shouldBeNull()
                event["request"]?.get("query_string").shouldBeNull()
                event["request"]?.get("cookies").shouldBeNull()
                event["request"]?.get("headers").shouldBeNull()
                event.toString() shouldNotContain CalendarLinkFixture.ALPHA_MEMBER
                event.toString() shouldNotContain "secret-in-query"
            }
        }

        test("an ERROR log line becomes an event with the request's trace ID") {
            val traceId = "6bf92f3577b34da6a3ce929d0e0e4736"
            getAsync(FailingController.LOG_ERROR_PATH, traceId)

            eventually(15.seconds) {
                val event = receiver.events().single { it.message() == "an error log line" }

                event["tags"]["trace_id"].asString() shouldBe traceId
            }
        }

        test("a missing required query parameter (a 400 from the generated parsing) becomes an event") {
            getAsync("/api/events", "7bf92f3577b34da6a3ce929d0e0e4736")

            eventually(15.seconds) {
                receiver.events().single { it["tags"]?.get("trace_id")?.asString() == "7bf92f3577b34da6a3ce929d0e0e4736" }
                    .exceptionType() shouldBe "IllegalStateException"
            }
        }

        test("a domain exception mapped to a 4xx does not become an event") {
            getAsync(FailingController.NOT_FOUND_PATH, "8bf92f3577b34da6a3ce929d0e0e4736")
            // Envelopes go out in order, so once this marker arrives an earlier event would have too.
            getAsync(FailingController.LOG_ERROR_PATH, "9bf92f3577b34da6a3ce929d0e0e4736")

            eventually(15.seconds) {
                receiver.events().single { it["tags"]?.get("trace_id")?.asString() == "9bf92f3577b34da6a3ce929d0e0e4736" }
            }
            receiver.events().filter { it.exceptionType() == "EventNotFoundException" }.shouldBeEmpty()
        }
    }

    private fun getAsync(path: String, traceId: String) {
        val started = mockMvc.perform(
            MockMvcRequestBuilders.get(path)
                .header("traceparent", "00-$traceId-00f067aa0ba902b7-01")
                .with(loginAs(CalendarLinkFixture.ALPHA_MEMBER)),
        ).andReturn()
        if (started.request.isAsyncStarted) mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
    }

    @TestConfiguration
    class FailingRoutes {
        @Bean
        fun failingController() = FailingController()

        @Bean
        fun failingFilter() = FilterRegistrationBean(FailingFilter()).apply { order = Ordered.LOWEST_PRECEDENCE }
    }

    class ReceiverDsn : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(ctx: ConfigurableApplicationContext) {
            // A property of this context only: a JVM system property would also reach the contexts that
            // later tests start, and switch error reporting on there.
            TestPropertyValues.of("SENTRY_DSN=${receiver.dsn}").applyTo(ctx)
        }
    }

    /** Stands in for Bugsink: records the event items of every envelope the Sentry SDK posts. */
    class EnvelopeReceiver {
        private val received = CopyOnWriteArrayList<JsonNode>()
        private val json = JsonMapper.builder().build()

        private val server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0).apply {
            createContext("/api/$PROJECT_ID/envelope/") { exchange ->
                val raw = exchange.requestBody.readAllBytes()
                val gzipped = exchange.requestHeaders.getFirst("Content-Encoding") == "gzip"
                val body = (if (gzipped) GZIPInputStream(raw.inputStream()).readAllBytes() else raw).decodeToString()
                val lines = body.split("\n")
                lines.forEachIndexed { i, line ->
                    val header = runCatching { json.readTree(line) }.getOrNull()
                    if (header?.get("type")?.asString() == "event") received.add(json.readTree(lines[i + 1]))
                }
                exchange.sendResponseHeaders(200, -1)
                exchange.close()
            }
        }

        init {
            // Started from a daemon thread, so the dispatcher cannot keep `processTestAot`'s JVM alive.
            thread(isDaemon = true) { server.start() }.join()
        }

        val dsn = "http://publickey@127.0.0.1:${server.address.port}/$PROJECT_ID"

        fun events(): List<JsonNode> = received.toList()
    }

    companion object {
        private const val PROJECT_ID = 1
        val receiver = EnvelopeReceiver()
    }
}

private fun JsonNode.exceptionType(): String? = get("exception")?.get("values")?.lastOrNull()?.get("type")?.asString()

private fun JsonNode.message(): String? =
    get("message")?.let { it.get("formatted")?.asString() ?: it.get("message")?.asString() }
        ?: get("logentry")?.get("message")?.asString()
