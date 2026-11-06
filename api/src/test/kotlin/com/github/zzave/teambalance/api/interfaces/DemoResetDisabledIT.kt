package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.demo.DemoResetAdapter
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import java.time.Duration

/**
 * Fail-closed (ADR-0043): with the demo switch off, no path drops anything. The session endpoint answers 404 before
 * the reset service is asked, and the adapter itself refuses when called directly.
 */
@AutoConfigureMockMvc
@Import(DemoResetTestBeans::class)
@ContextConfiguration(initializers = [OwnPostgresInitializer::class], inheritInitializers = false)
@TestPropertySource(properties = ["teambalance.demo.enabled=false", "teambalance.demo.reset-after=1h"])
class DemoResetDisabledIT : TeamBalanceIT() {

    @Autowired lateinit var mockMvc: MockMvc

    @Autowired lateinit var jdbcTemplate: JdbcTemplate

    @Autowired lateinit var clock: MovableClock

    @Autowired lateinit var gateway: CountingResetGateway

    @Autowired lateinit var adapter: DemoResetAdapter

    init {
        beforeSpec { OwnPostgresInitializer.requireOwnDatabase(jdbcTemplate) }

        test("with the switch off, an overdue guest login resets nothing") {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS public.reset_marker (id int)")
            clock.advance(Duration.ofHours(5))

            val started = mockMvc.perform(
                post("/api/demo/session").contentType(MediaType.APPLICATION_JSON).content("""{"persona":"MEMBER"}"""),
            ).andReturn()
            val response = mockMvc.perform(asyncDispatch(started)).andReturn().response

            response.status shouldBe 404
            gateway.resets.get() shouldBe 0
            markerExists() shouldBe true
        }

        test("with the switch off, the adapter refuses to drop anything when called directly") {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS public.reset_marker (id int)")

            shouldThrow<IllegalStateException> { adapter.reset() }

            markerExists() shouldBe true
        }
    }

    private fun markerExists() = jdbcTemplate.queryForObject(
        "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reset_marker'",
        Int::class.java,
    ) == 1
}
