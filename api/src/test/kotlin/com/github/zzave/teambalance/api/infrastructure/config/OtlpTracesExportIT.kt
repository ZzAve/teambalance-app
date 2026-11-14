package com.github.zzave.teambalance.api.infrastructure.config

import ch.qos.logback.classic.Logger
import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.read.ListAppender
import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import com.github.zzave.teambalance.testroutes.SuspendLoggingController
import com.sun.net.httpserver.HttpServer
import io.kotest.assertions.nondeterministic.eventually
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest
import io.opentelemetry.proto.trace.v1.Span
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
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
import java.net.InetSocketAddress
import java.util.HexFormat
import java.util.concurrent.CopyOnWriteArrayList
import kotlin.concurrent.thread
import kotlin.time.Duration.Companion.seconds

/**
 * Boots the `prod` profile with the trace export switched on, the way the live container is configured
 * through its environment, and receives the OTLP pushes on a local HTTP server in place of Scaleway
 * Cockpit's Tempo. It proves each request arrives as a server span with its route template and status,
 * with the Cockpit token header from application-prod.yml, that a log line written inside a
 * `suspend` handler carries the trace ID of that span, and that the health probe makes no spans.
 */
@ActiveProfiles("prod", inheritProfiles = false)
@AutoConfigureMockMvc
@ContextConfiguration(initializers = [OtlpTracesExportIT.ReceiverUrl::class])
@TestPropertySource(
    properties = [
        "management.opentelemetry.tracing.export.schedule-delay=100ms",
        "SCALEWAY_COCKPIT_TRACES_TOKEN=test-push-token",
        "teambalance.invitation.token-salt=prod-smoke-salt",
        "teambalance.invitation.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1zbW9rZS1rZXktMzJieXQ=",
        "teambalance.calendar-link.token-salt=prod-smoke-calendar-salt",
        "teambalance.calendar-link.token-encryption-key=cHJvZC1zbW9rZS1jYWxlbmRhci1rZXktMzJieXRlcyE=",
        "teambalance.bunq.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1idW5xLXNtb2tlLWtleTE=",
        "teambalance.email.api-key=prod-smoke-key",
        "teambalance.email.project-id=prod-smoke-project",
    ],
)
class OtlpTracesExportIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeSpec { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("every request is pushed as a server span with its route template and status") {
            mockMvc.perform(MockMvcRequestBuilders.get("/api/calendar/no-such-team/no-such-token.ics"))

            eventually(15.seconds) {
                val span = receiver.serverSpans().single { it.attribute("uri") == "/api/calendar/{teamSlug}/{token}.ics" }

                span.attribute("method") shouldBe "GET"
                span.attribute("status") shouldBe "404"
            }
        }

        test("a Wirespec-generated suspend route is pushed as a server span with its template") {
            val started = mockMvc.perform(
                MockMvcRequestBuilders.delete("/api/calendar-links/00000000-0000-0000-0000-000000000000")
                    .with(loginAs(CalendarLinkFixture.ALPHA_MEMBER)),
            ).andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))

            eventually(15.seconds) {
                receiver.serverSpans().map { it.attribute("uri") } shouldContain "/api/calendar-links/{id}"
            }
        }

        test("a log line written inside a suspend handler carries the trace ID of the request's span") {
            val logged = ListAppender<ILoggingEvent>().apply { start() }
            (SuspendLoggingController.log as Logger).addAppender(logged)

            val started = mockMvc.perform(
                MockMvcRequestBuilders.get(SuspendLoggingController.PATH).with(loginAs(CalendarLinkFixture.ALPHA_MEMBER)),
            ).andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))

            val traceId = logged.list.single().mdcPropertyMap["traceId"]
            traceId shouldNotBe null
            eventually(15.seconds) {
                receiver.serverSpans().single { it.attribute("uri") == SuspendLoggingController.PATH }
                    .traceIdHex() shouldBe traceId
            }
        }

        test("the health probe makes no spans, so it does not fill Tempo every 10 seconds") {
            val before = receiver.spans().size

            mockMvc.perform(MockMvcRequestBuilders.get("/internal/actuator/health"))
            mockMvc.perform(MockMvcRequestBuilders.get("/api/calendar/after-the-probe/token.ics"))

            eventually(15.seconds) {
                val pushed = receiver.spans().drop(before)
                val markerTrace = pushed.single { it.attribute("uri") == "/api/calendar/{teamSlug}/{token}.ics" }.traceId

                pushed.filter { it.traceId != markerTrace } shouldBe emptyList()
            }
        }

        test("every push carries the Cockpit token header") {
            eventually(15.seconds) { receiver.tokens.firstOrNull() shouldNotBe null }
            receiver.tokens.toSet() shouldBe setOf("test-push-token")
        }
    }

    @TestConfiguration
    class SuspendLoggingRoute {
        @Bean
        fun suspendLoggingController() = SuspendLoggingController()
    }

    class ReceiverUrl : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(ctx: ConfigurableApplicationContext) {
            ctx.environment.systemProperties["management.opentelemetry.tracing.export.otlp.endpoint"] = receiver.url
        }
    }

    /** Stands in for the Cockpit OTLP endpoint: records every pushed payload and its token header. */
    class OtlpReceiver {
        private val payloads = CopyOnWriteArrayList<ExportTraceServiceRequest>()
        val tokens = CopyOnWriteArrayList<String?>()

        private val server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0).apply {
            createContext(PATH) { exchange ->
                tokens += exchange.requestHeaders.getFirst("X-Token")
                payloads += ExportTraceServiceRequest.parseFrom(exchange.requestBody.readAllBytes())
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

        fun spans(): List<Span> = payloads
            .flatMap { it.resourceSpansList }
            .flatMap { it.scopeSpansList }
            .flatMap { it.spansList }

        fun serverSpans(): List<Span> = spans().filter { it.kind == Span.SpanKind.SPAN_KIND_SERVER }
    }

    companion object {
        private const val PATH = "/otlp/v1/traces"
        val receiver = OtlpReceiver()
    }
}

private fun Span.attribute(key: String): String? =
    attributesList.firstOrNull { it.key == key }?.value?.stringValue

private fun Span.traceIdHex(): String = HexFormat.of().formatHex(traceId.toByteArray())
