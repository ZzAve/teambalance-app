package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.domain.model.CalendarToken
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_NAME
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SLUG
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_TEAM
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_SLUG
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.LEAVER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.TRAINING
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.HttpHeaders
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Duration
import java.time.Instant

/**
 * The feed end to end (ADR-0032): a cookie-less GET resolving a team by slug, a token by hash and a
 * membership by row, against two real tenant schemas.
 *
 * Everything here is the wiring the units cannot see. [CalendarIcsTest] already pins the ICS format,
 * so this spec does not re-enumerate it — it proves that a request carrying no session at all reaches
 * the right schema, and that each of the five ways to be refused really is the same 404.
 */
@AutoConfigureMockMvc
class CalendarFeedIT : TeamBalanceIT() {

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

        test("a link fetched with no cookie and no header serves the team's calendar") {
            val token = liveLink()

            val response = fetch(ALPHA_SLUG, token).andExpect(status().isOk).andReturn().response

            response.contentType shouldContain "text/calendar"
            response.contentAsString shouldContain "BEGIN:VCALENDAR"
            response.contentAsString shouldContain "X-WR-CALNAME:$ALPHA_NAME"
            response.contentAsString shouldContain "SUMMARY:$TRAINING"
            response.contentAsString shouldContain "UID:${CalendarLinkFixture.TRAINING_ID}"
        }

        // The prefix is the whole reason the feed is per-member rather than one calendar per team.
        test("the subscriber's own answer rides on the event title") {
            CalendarLinkFixture.answer(jdbcTemplate, ALPHA_MEMBER, "ATTENDING")
            val token = liveLink()

            body(fetch(ALPHA_SLUG, token)) shouldContain "SUMMARY:✓ $TRAINING"
        }

        test("it is another member's own answer that rides on theirs") {
            CalendarLinkFixture.answer(jdbcTemplate, ALPHA_MEMBER, "ATTENDING")
            CalendarLinkFixture.answer(jdbcTemplate, LEAVER, "ABSENT")

            body(fetch(ALPHA_SLUG, liveLink(LEAVER))) shouldContain "SUMMARY:✗ $TRAINING"
        }

        // Spring routes HEAD to the @GetMapping handler, so both the tenant filter and the throttle have
        // to match it too. Matching GET alone let HEAD through with no tenant bound, which surfaced as
        // a 500 against __no_tenant__ rather than the 404 every other refusal gives.
        context("HEAD is the same endpoint, not a way past its filters") {
            test("a live link answers HEAD with the same status and headers as GET") {
                val token = liveLink()
                val eTag = fetch(ALPHA_SLUG, token).andReturn().response.getHeader(HttpHeaders.ETAG)

                head(ALPHA_SLUG, token)
                    .andExpect(status().isOk)
                    .andExpect(header().string(HttpHeaders.ETAG, eTag!!))
            }

            test("an unknown token answers 404, not a 500 from an unbound tenant") {
                head(ALPHA_SLUG, calendarLinkTokens.mint()).andExpect(status().isNotFound)
            }
        }

        // The banding itself is RefreshCadenceTest's; what this proves is that the *right* event picks
        // the band — against real rows, where the feed also carries a month of history.
        context("the refresh cadence follows the next event") {
            test("a team with nothing soon is told to come back in twelve hours") {
                body(fetch(ALPHA_SLUG, liveLink())) shouldContain "REFRESH-INTERVAL;VALUE=DURATION:PT12H"
            }

            test("an event tomorrow tightens it to an hour") {
                CalendarLinkFixture.extraEvent(jdbcTemplate, Instant.now().plus(Duration.ofDays(1)))

                body(fetch(ALPHA_SLUG, liveLink())) shouldContain "REFRESH-INTERVAL;VALUE=DURATION:PT1H"
            }

            test("an event two and a half days out sits in the middle band") {
                CalendarLinkFixture.extraEvent(jdbcTemplate, Instant.now().plus(Duration.ofHours(60)))

                body(fetch(ALPHA_SLUG, liveLink())) shouldContain "REFRESH-INTERVAL;VALUE=DURATION:PT6H"
            }

            // The feed reaches thirty days back, so its *first* entry is usually already over. Only
            // events still ahead may tighten the cadence.
            test("an event that has already happened does not tighten anything") {
                CalendarLinkFixture.extraEvent(jdbcTemplate, Instant.now().minus(Duration.ofDays(1)))

                body(fetch(ALPHA_SLUG, liveLink())) shouldContain "REFRESH-INTERVAL;VALUE=DURATION:PT12H"
            }
        }

        test("the feed is private and revalidates, so no shared cache holds one member's schedule") {
            fetch(ALPHA_SLUG, liveLink())
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, "max-age=0, private"))
        }

        context("every refusal is the same bare 404") {
            test("an unknown slug") {
                fetch("no-such-team", liveLink()).andExpect(status().isNotFound)
            }

            test("an unknown token") {
                fetch(ALPHA_SLUG, calendarLinkTokens.mint()).andExpect(status().isNotFound)
            }

            test("a token past its expiry") {
                val expired = CalendarLinkFixture.link(
                    jdbcTemplate, calendarLinkTokens, ALPHA_SCHEMA, ALPHA_MEMBER,
                    expiresAt = Instant.now().minusSeconds(60),
                )

                fetch(ALPHA_SLUG, expired).andExpect(status().isNotFound)
            }

            // The token is looked up in the schema the slug resolved to, so this is a miss rather than
            // a comparison somebody had to remember to write. It is also the reason the rows are
            // tenant rows at all.
            test("a token minted for one team, presented under another team's slug") {
                val alphaToken = liveLink()

                fetch(BETA_SLUG, alphaToken).andExpect(status().isNotFound)
            }

            test("and the same token under its own slug still works, so the case above is not a fluke") {
                val alphaToken = liveLink()
                fetch(BETA_SLUG, alphaToken).andExpect(status().isNotFound)

                fetch(ALPHA_SLUG, alphaToken).andExpect(status().isOk)
            }

            test("a beta member's link under beta's slug is unaffected by any of this") {
                val betaToken = CalendarLinkFixture.link(
                    jdbcTemplate, calendarLinkTokens, BETA_SCHEMA, BETA_MEMBER,
                    expiresAt = Instant.now().plusSeconds(3600),
                )

                fetch(BETA_SLUG, betaToken).andExpect(status().isOk)
            }

            // Membership is re-read on every fetch precisely so nobody has to remember to delete a
            // departing member's links.
            test("a member who has since left the team") {
                val token = liveLink(LEAVER)
                fetch(ALPHA_SLUG, token).andExpect(status().isOk)

                jdbcTemplate.update(
                    "UPDATE public.team_members SET active = false WHERE team_id = ?::uuid AND user_id = ?::uuid",
                    ALPHA_TEAM, LEAVER,
                )

                fetch(ALPHA_SLUG, token).andExpect(status().isNotFound)
            }
        }

        context("conditional fetching") {
            test("an unchanged calendar answers 304 with no body") {
                val token = liveLink()
                val eTag = fetch(ALPHA_SLUG, token).andExpect(status().isOk)
                    .andReturn().response.getHeader(HttpHeaders.ETAG)
                eTag shouldNotBe null

                val notModified = fetch(ALPHA_SLUG, token, ifNoneMatch = eTag)
                    .andExpect(status().isNotModified)
                    .andExpect(header().string(HttpHeaders.ETAG, eTag!!))
                    .andReturn().response

                notModified.contentAsString shouldBe ""
            }

            test("a changed answer changes the ETag, so the client refetches") {
                val token = liveLink()
                val before = fetch(ALPHA_SLUG, token).andReturn().response.getHeader(HttpHeaders.ETAG)

                CalendarLinkFixture.answer(jdbcTemplate, ALPHA_MEMBER, "ATTENDING")

                fetch(ALPHA_SLUG, token, ifNoneMatch = before)
                    .andExpect(status().isOk)
                    .andReturn().response.getHeader(HttpHeaders.ETAG) shouldNotBe before
            }
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    /** Deliberately naked: no session cookie, no X-User-Id, no X-Team-Id. The token is the credential. */
    private fun fetch(slug: String, token: CalendarToken, ifNoneMatch: String? = null) =
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/calendar/$slug/${token.value}.ics")
                .apply { ifNoneMatch?.let { header(HttpHeaders.IF_NONE_MATCH, it) } },
        )

    private fun head(slug: String, token: CalendarToken) =
        mockMvc.perform(MockMvcRequestBuilders.head("/api/calendar/$slug/${token.value}.ics"))

    private fun body(result: org.springframework.test.web.servlet.ResultActions) =
        result.andReturn().response.contentAsString

    private fun liveLink(userId: String = ALPHA_MEMBER) = CalendarLinkFixture.link(
        jdbcTemplate, calendarLinkTokens, ALPHA_SCHEMA, userId,
        expiresAt = Instant.now().plusSeconds(3600),
    )
}
