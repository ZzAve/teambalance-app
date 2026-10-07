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

private const val CAPACITY = 30

// The per-IP backstop, set just above the per-token one so this spec can exercise both without
// hundreds of requests. In application.yml it is 600 — twenty times looser, because honest traffic
// from a NAT'd club sits an order of magnitude under even that.
private const val CLIENT_CAPACITY = 35

/**
 * The feed is throttled per **token**, 30 an hour (ADR-0032) — the number `application.yml` ships and
 * the one restored here, because the shared test profile raises every limit to 1000 so unrelated specs
 * do not throttle each other.
 *
 * Per token rather than per IP on purpose, and that is the half worth an assertion: the feed is
 * session-less, so there is no user to key on, and a whole club behind one office NAT would otherwise
 * exhaust a shared bucket and knock each other's calendars offline.
 */
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.rate-limit.calendar-feed.capacity=$CAPACITY",
        "teambalance.rate-limit.calendar-feed-per-client.capacity=$CLIENT_CAPACITY",
    ],
)
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

        // Each test takes its own TEST-NET-3 address, so the per-token and per-client ceilings cannot
        // couple: one test spending its client allowance must not decide another's outcome.
        test("the 31st fetch of one token in an hour is refused, with a Retry-After") {
            val ip = "198.51.100.40"
            val token = liveLink()
            repeat(CAPACITY) { fetch(token, ip).andExpect(status().isOk) }

            val blocked = fetch(token, ip)
                .andExpect(status().isTooManyRequests)
                .andExpect(header().exists("Retry-After"))
                .andReturn()

            blocked.response.getHeader("Retry-After")!!.toInt() shouldBeGreaterThan 0
            blocked.response.contentAsString shouldContain "rate_limited"
        }

        test("a second link keeps working while the first one's allowance is spent") {
            val ip = "198.51.100.41"
            val busy = liveLink()
            repeat(CAPACITY) { fetch(busy, ip).andExpect(status().isOk) }
            fetch(busy, ip).andExpect(status().isTooManyRequests)

            fetch(liveLink(), ip).andExpect(status().isOk)
        }

        // The per-token bucket alone cannot bound this: the token comes from the path, so a caller who
        // never reuses one gets a fresh full allowance every request. Each fetch below presents an
        // unknown token — a 404, and still a request the server paid for — so only the per-IP ceiling
        // can stop it.
        test("a client churning fresh tokens is stopped by the per-IP ceiling") {
            val ip = "198.51.100.42"
            repeat(CLIENT_CAPACITY) { fetch(calendarLinkTokens.mint(), ip).andExpect(status().isNotFound) }

            fetch(calendarLinkTokens.mint(), ip).andExpect(status().isTooManyRequests)
        }

        test("another address still gets its own allowance") {
            val busy = "198.51.100.43"
            repeat(CLIENT_CAPACITY) { fetch(calendarLinkTokens.mint(), busy) }
            fetch(calendarLinkTokens.mint(), busy).andExpect(status().isTooManyRequests)

            fetch(liveLink(), "198.51.100.44").andExpect(status().isOk)
        }
    }

    private fun fetch(token: CalendarToken, clientIp: String = "198.51.100.39") =
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/calendar/$ALPHA_SLUG/${token.value}.ics")
                .header("X-Forwarded-For", clientIp),
        )

    private fun liveLink() = CalendarLinkFixture.link(
        jdbcTemplate, calendarLinkTokens, ALPHA_SCHEMA, ALPHA_MEMBER,
        expiresAt = Instant.now().plusSeconds(3600),
    )
}
