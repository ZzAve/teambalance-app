package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import com.sun.net.httpserver.HttpServer
import io.kotest.assertions.nondeterministic.eventually
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest
import io.opentelemetry.proto.metrics.v1.HistogramDataPoint
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import java.net.InetSocketAddress
import java.util.concurrent.CopyOnWriteArrayList
import kotlin.concurrent.thread
import kotlin.time.Duration.Companion.seconds

/**
 * Boots the `prod` profile with the metrics push switched on, the way the live container is configured
 * through its environment, and receives the OTLP pushes on a local HTTP server in place of Scaleway
 * Cockpit. It proves the endpoint metrics arrive as one histogram per route template and status, with
 * the latency buckets from application.yml and the Cockpit token header from application-prod.yml.
 *
 * Two routes, because they are mapped in two ways: the calendar feed by a hand-written
 * `@GetMapping`, the calendar-link delete by the Wirespec-generated controller interface.
 */
@ActiveProfiles("prod", inheritProfiles = false)
@AutoConfigureMockMvc
@ContextConfiguration(initializers = [OtlpMetricsExportIT.ReceiverUrl::class])
@TestPropertySource(
    properties = [
        "management.otlp.metrics.export.enabled=true",
        "management.otlp.metrics.export.step=1s",
        "SCALEWAY_COCKPIT_METRICS_TOKEN=test-push-token",
        "teambalance.invitation.token-salt=prod-smoke-salt",
        "teambalance.invitation.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1zbW9rZS1rZXktMzJieXQ=",
        "teambalance.calendar-link.token-salt=prod-smoke-calendar-salt",
        "teambalance.calendar-link.token-encryption-key=cHJvZC1zbW9rZS1jYWxlbmRhci1rZXktMzJieXRlcyE=",
        "teambalance.bunq.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1idW5xLXNtb2tlLWtleTE=",
        "teambalance.email.api-key=prod-smoke-key",
        "teambalance.email.project-id=prod-smoke-project",
    ],
)
class OtlpMetricsExportIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeSpec { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("a request is pushed as an http.server.requests histogram with its route template, status and latency buckets") {
            mockMvc.perform(MockMvcRequestBuilders.get("/api/calendar/no-such-team/no-such-token.ics"))

            eventually(15.seconds) {
                val point = receiver.serverRequestPoints()
                    .single { it.attribute("uri") == "/api/calendar/{teamSlug}/{token}.ics" }

                point.attribute("method") shouldBe "GET"
                point.attribute("status") shouldBe "404"
                point.attribute("outcome") shouldBe "CLIENT_ERROR"
                point.explicitBoundsList.shouldContainExactly(50.0, 100.0, 250.0, 500.0, 1000.0, 2500.0)
            }
        }

        test("a Wirespec-generated route is tagged with its template, not the requested path") {
            // The generated handlers are suspend functions: the request is async, and its observation ends
            // on the async dispatch, as it does in Tomcat.
            val started = mockMvc.perform(
                MockMvcRequestBuilders.delete("/api/calendar-links/00000000-0000-0000-0000-000000000000")
                    .with(loginAs(CalendarLinkFixture.ALPHA_MEMBER)),
            ).andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))

            eventually(15.seconds) {
                receiver.serverRequestPoints().map { it.attribute("uri") }.toSet() shouldContain "/api/calendar-links/{id}"
            }
        }

        test("every push carries the Cockpit token header") {
            eventually(15.seconds) { receiver.tokens.firstOrNull() shouldNotBe null }
            receiver.tokens.toSet() shouldBe setOf("test-push-token")
        }
    }

    class ReceiverUrl : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(ctx: ConfigurableApplicationContext) {
            ctx.environment.systemProperties["management.otlp.metrics.export.url"] = receiver.url
        }
    }

    /** Stands in for the Cockpit OTLP endpoint: records every pushed payload and its token header. */
    class OtlpReceiver {
        private val payloads = CopyOnWriteArrayList<ExportMetricsServiceRequest>()
        val tokens = CopyOnWriteArrayList<String?>()

        private val server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0).apply {
            createContext(PATH) { exchange ->
                tokens += exchange.requestHeaders.getFirst("X-Token")
                payloads += ExportMetricsServiceRequest.parseFrom(exchange.requestBody.readAllBytes())
                exchange.sendResponseHeaders(200, -1)
                exchange.close()
            }
        }

        init {
            // The dispatcher thread takes its daemon flag from the thread that starts it. Started from a
            // daemon thread, it cannot keep a JVM alive: `processTestAot` also runs this initializer.
            thread(isDaemon = true) { server.start() }.join()
        }

        val url = "http://127.0.0.1:${server.address.port}$PATH"

        /** The points of the latest push only: each push repeats every point with its cumulative values. */
        fun serverRequestPoints(): List<HistogramDataPoint> = payloads.takeLast(1)
            .flatMap { it.resourceMetricsList }
            .flatMap { it.scopeMetricsList }
            .flatMap { it.metricsList }
            .filter { it.name == "http.server.requests" }
            .flatMap { it.histogram.dataPointsList }
    }

    companion object {
        private const val PATH = "/otlp/v1/metrics"
        val receiver = OtlpReceiver()
    }
}

private fun HistogramDataPoint.attribute(key: String): String? =
    attributesList.firstOrNull { it.key == key }?.value?.stringValue
