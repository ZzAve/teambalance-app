package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.DemoPersona
import com.github.zzave.teambalance.api.domain.port.PlatformProvisioningGateway
import com.github.zzave.teambalance.api.infrastructure.demo.DemoGuard
import com.github.zzave.teambalance.api.infrastructure.demo.DemoResetAdapter
import com.github.zzave.teambalance.api.infrastructure.demo.DemoTeamSeeder
import io.kotest.assertions.throwables.shouldThrow
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
import java.lang.reflect.Proxy
import java.sql.Connection
import java.sql.DatabaseMetaData
import java.time.Duration
import javax.sql.DataSource
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

    @Autowired lateinit var dataSource: DataSource

    @Autowired lateinit var platformProvisioning: PlatformProvisioningGateway

    @Autowired lateinit var seeder: DemoTeamSeeder

    @Autowired lateinit var guard: DemoGuard

    init {
        beforeSpec { OwnPostgresInitializer.requireOwnDatabase(jdbcTemplate) }

        test("the full seed is present after boot and again after a reset") {
            assertFullSeed()

            // Damage the seed, then reset: the rebuilt data must be the full seed again.
            jdbcTemplate.update("DELETE FROM ${DemoPersona.SCHEMA}.events")
            jdbcTemplate.update("DELETE FROM ${DemoPersona.SCHEMA}.substitutes")
            resetNow()

            assertFullSeed()
        }

        test("a reset removes an answered attendance and recreates the seed") {
            val sanne = createSession()
            answerGoing(sanne)
            attendanceCount() shouldBe 1

            resetNow()

            attendanceCount() shouldBe 0
            jdbcTemplate.queryForObject("SELECT count(*) FROM ${DemoPersona.SCHEMA}.events", Int::class.java) shouldBe 6
        }

        test("the drop re-checks the host on its own connection: a non-loopback URL drops nothing") {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS public.reset_marker (id int)")
            val remote = DemoResetAdapter(reportingRemoteHost(dataSource), platformProvisioning, seeder, guard)

            shouldThrow<IllegalStateException> { remote.reset() }

            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reset_marker'",
                Int::class.java,
            ) shouldBe 1
        }

        test("a reset recreates the seeded Bunq connection and top-up link: the money pool is Connected again") {
            val resets = gateway.resets.get()
            resetNow()
            gateway.resets.get() shouldBe resets + 1

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

    /** The real pool, but its connections report a remote database URL in their metadata. */
    private fun reportingRemoteHost(real: DataSource): DataSource =
        Proxy.newProxyInstance(javaClass.classLoader, arrayOf(DataSource::class.java)) { _, method, args ->
            val result = method.invoke(real, *(args ?: emptyArray()))
            if (method.name != "getConnection") return@newProxyInstance result
            Proxy.newProxyInstance(javaClass.classLoader, arrayOf(Connection::class.java)) { _, cm, cargs ->
                if (cm.name != "getMetaData") return@newProxyInstance cm.invoke(result, *(cargs ?: emptyArray()))
                val meta = cm.invoke(result) as DatabaseMetaData
                Proxy.newProxyInstance(javaClass.classLoader, arrayOf(DatabaseMetaData::class.java)) { _, mm, margs ->
                    if (mm.name == "getURL") {
                        "jdbc:postgresql://db.scw.cloud:5432/teambalance"
                    } else {
                        mm.invoke(meta, *(margs ?: emptyArray()))
                    }
                }
            }
        } as DataSource

    private fun resetNow() {
        clock.advance(Duration.ofMinutes(61))
        createSession()
    }

    // The guest's own answer on the next event; the seed holds other members' answers and the guest's on past events.
    private fun attendanceCount() = jdbcTemplate.queryForObject(
        "SELECT count(*) FROM ${DemoPersona.SCHEMA}.attendances WHERE user_id = ?::uuid " +
            "AND event_id IN (SELECT id FROM ${DemoPersona.SCHEMA}.events WHERE uuid = ?::uuid)",
        Int::class.java,
        DemoPersona.MEMBER.userId.value.toString(),
        EVENT_ID,
    )

    private fun count(sql: String) = jdbcTemplate.queryForObject(sql, Int::class.java)

    private fun assertFullSeed() {
        val schema = DemoPersona.SCHEMA
        count("SELECT count(*) FROM public.team_members WHERE team_id = '${DemoPersona.TEAM_ID.value}'::uuid AND active") shouldBe 12
        count("SELECT count(*) FROM $schema.positions") shouldBe 5
        count("SELECT count(*) FROM $schema.money_pool_settings WHERE beer_price_cents = 270") shouldBe 1
        // The personas carry full names, the same in the account and in the team profile.
        val personas = "'${DemoPersona.MEMBER.userId.value}', '${DemoPersona.ADMIN.userId.value}'"
        jdbcTemplate.queryForList("SELECT display_name FROM public.users WHERE id IN ($personas) ORDER BY 1", String::class.java) shouldBe
            listOf("Kees de Vries", "Sanne Visser")
        jdbcTemplate.queryForList(
            "SELECT display_name FROM $schema.member_profiles WHERE user_id IN ($personas) ORDER BY 1",
            String::class.java,
        ) shouldBe listOf("Kees de Vries", "Sanne Visser")
        // Every member but the coach plays a position.
        count("SELECT count(*) FROM $schema.member_profiles WHERE position_id IS NOT NULL") shouldBe 11
        count("SELECT count(*) FROM $schema.events WHERE start_time < now()") shouldBe 2
        count("SELECT count(*) FROM $schema.events WHERE start_time > now()") shouldBe 4
        count("SELECT count(DISTINCT event_type_id) FROM $schema.events") shouldBe 3
        count("SELECT count(*) FROM $schema.substitutes") shouldBe 1
        // Past events are fully answered.
        count(
            "SELECT count(*) FROM $schema.events e WHERE e.start_time < now() AND " +
                "(SELECT count(*) FROM $schema.attendances a WHERE a.event_id = e.id) = 12",
        ) shouldBe 2
        // The next event is half-answered, and not by the guest.
        val nextAnswers = count(
            "SELECT count(*) FROM $schema.attendances WHERE event_id = " +
                "(SELECT id FROM $schema.events WHERE start_time > now() ORDER BY start_time LIMIT 1)",
        )
        nextAnswers shouldBe 6
        attendanceCount() shouldBe 0
        perform(get("/api/team/money-pool").cookie(createSession())).contentAsString shouldContain "\"balance\":8700"
    }

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
