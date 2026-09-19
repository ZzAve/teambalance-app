package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.domain.model.CalendarToken
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SLUG
import io.kotest.matchers.ints.shouldBeGreaterThan
import io.kotest.matchers.string.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Instant

private const val CAPACITY = 60

/**
 * The feed is throttled per **token**, 60 an hour (ADR-0032) — the number `application.yml` ships and
 * the one restored here, because the shared test profile raises every limit to 1000 so unrelated specs
 * do not throttle each other.
 *
 * Per token rather than per IP on purpose, and that is the half worth an assertion: the feed is
 * session-less, so there is no user to key on, and a whole club behind one office NAT would otherwise
 * exhaust a shared bucket and knock each other's calendars offline.
 */
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.rate-limit.calendar-feed.capacity=$CAPACITY"])
class CalendarFeedRateLimitIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var calendarLinkTokens: CalendarLinkTokens

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("the 61st fetch of one token in an hour is refused, with a Retry-After") {
            val token = liveLink()
            repeat(CAPACITY) { fetch(token).andExpect(status().isOk) }

            val blocked = fetch(token)
                .andExpect(status().isTooManyRequests)
                .andExpect(header().exists("Retry-After"))
                .andReturn()

            blocked.response.getHeader("Retry-After")!!.toInt() shouldBeGreaterThan 0
            blocked.response.contentAsString shouldContain "rate_limited"
        }

        test("a second link keeps working while the first one's allowance is spent") {
            val busy = liveLink()
            repeat(CAPACITY) { fetch(busy).andExpect(status().isOk) }
            fetch(busy).andExpect(status().isTooManyRequests)

            fetch(liveLink()).andExpect(status().isOk)
        }
    }

    private fun fetch(token: CalendarToken) =
        mockMvc.perform(MockMvcRequestBuilders.get("/api/calendar/$ALPHA_SLUG/${token.value}.ics"))

    private fun liveLink() = CalendarLinkFixture.link(
        jdbcTemplate, calendarLinkTokens, ALPHA_SCHEMA, ALPHA_MEMBER,
        expiresAt = Instant.now().plusSeconds(3600),
    )
}
