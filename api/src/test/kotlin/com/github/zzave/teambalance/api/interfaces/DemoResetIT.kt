package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.DemoPersona
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import jakarta.servlet.http.Cookie
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import java.time.Duration
import java.util.concurrent.Callable
import java.util.concurrent.Executors

private const val EVENT_ID = "d0000000-0000-0000-0000-000000000031"

/**
 * The hourly demo reset (ADR-0043) through the real filter chain, on a Postgres of its own because it drops every
 * schema. Time is a [MovableClock]; [CountingResetGateway] counts the resets that reach the real adapter.
 */
@AutoConfigureMockMvc
@Import(DemoResetTestBeans::class)
@ContextConfiguration(initializers = [OwnPostgresInitializer::class], inheritInitializers = false)
@TestPropertySource(
    properties = [
        "teambalance.demo.enabled=true",
        "teambalance.email.send=false",
        "teambalance.bunq.environment=fake",
        "teambalance.demo.reset-after=1h",
        "teambalance.csrf.cookie-name=DEMO-XSRF-TOKEN",
    ],
)
class DemoResetIT : TeamBalanceIT() {

    @Autowired lateinit var mockMvc: MockMvc

    @Autowired lateinit var jdbcTemplate: JdbcTemplate

    @Autowired lateinit var clock: MovableClock

    @Autowired lateinit var gateway: CountingResetGateway

    init {
        beforeSpec { OwnPostgresInitializer.requireOwnDatabase(jdbcTemplate) }

        test("a reset removes an answered attendance and recreates the seed") {
            val sanne = createSession()
            answerGoing(sanne)
            attendanceCount() shouldBe 1

            resetNow()

            attendanceCount() shouldBe 0
            jdbcTemplate.queryForObject("SELECT count(*) FROM ${DemoPersona.SCHEMA}.events", Int::class.java) shouldBe 1
        }

        test("a reset recreates the seeded Bunq connection and top-up link: the money pool is Connected again") {
            resetNow()

            val pool = perform(get("/api/team/money-pool").cookie(createSession())).contentAsString
            pool shouldContain "\"state\":\"Connected\""
            pool shouldContain "\"canTopUp\":true"
        }

        test("a reset logs out existing sessions, and a session created right after it works") {
            val before = createSession()
            perform(get("/api/auth/me").cookie(before)).status shouldBe 200

            clock.advance(Duration.ofMinutes(61))
            val after = createSession()

            perform(get("/api/auth/me").cookie(before)).status shouldBe 401
            perform(get("/api/auth/me").cookie(after)).status shouldBe 200
            perform(get("/api/events?include-past=false").cookie(after)).status shouldBe 200
        }

        test("less than the reset interval after the last reset nothing is reset") {
            resetNow()
            val sanne = createSession()
            answerGoing(sanne)
            val resets = gateway.resets.get()

            clock.advance(Duration.ofMinutes(59))
            val second = createSession()

            gateway.resets.get() shouldBe resets
            attendanceCount() shouldBe 1
            perform(get("/api/auth/me").cookie(sanne)).status shouldBe 200
            perform(get("/api/auth/me").cookie(second)).status shouldBe 200
        }

        test("concurrent guest logins after the interval trigger a single reset and all get a working session") {
            resetNow()
            val resets = gateway.resets.get()
            clock.advance(Duration.ofMinutes(61))

            val pool = Executors.newFixedThreadPool(6)
            val sessions = pool.invokeAll(List(6) { Callable { createSession() } }).map { it.get() }
            pool.shutdown()

            gateway.resets.get() shouldBe resets + 1
            sessions.size shouldBe 6
            // The last session to start is valid; the reset ran before any of the six sessions was created.
            sessions.forEach { perform(get("/api/auth/me").cookie(it)).status shouldBe 200 }
        }
    }

    private fun resetNow() {
        clock.advance(Duration.ofMinutes(61))
        createSession()
    }

    private fun attendanceCount() = jdbcTemplate.queryForObject(
        "SELECT count(*) FROM ${DemoPersona.SCHEMA}.attendances",
        Int::class.java,
    )

    private fun answerGoing(session: Cookie) {
        val xsrf = perform(get("/api/auth/me").cookie(session)).getCookie("DEMO-XSRF-TOKEN").shouldNotBeNull()
        perform(
            put("/api/events/$EVENT_ID/attendances/${DemoPersona.MEMBER.userId.value}")
                .cookie(session, xsrf)
                .header("X-XSRF-TOKEN", xsrf.value)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"state":"ATTENDING"}"""),
        ).status shouldBe 200
    }

    private fun createSession(): Cookie = perform(
        post("/api/demo/session").contentType(MediaType.APPLICATION_JSON).content("""{"persona":"MEMBER"}"""),
    ).also { it.status shouldBe 204 }.getCookie("SESSION").shouldNotBeNull()

    private fun perform(builder: MockHttpServletRequestBuilder): MockHttpServletResponse {
        val started = mockMvc.perform(builder).andReturn()
        return if (started.request.isAsyncStarted) {
            mockMvc.perform(asyncDispatch(started)).andReturn().response
        } else {
            started.response
        }
    }
}
