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
import io.kotest.matchers.string.shouldNotContain
import org.flywaydb.core.Flyway
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Duration
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID
import javax.sql.DataSource

/**
 * The feed end to end (ADR-0039): a cookie-less GET resolving a team by slug, a token by hash and a
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

    @Autowired
    lateinit var dataSource: DataSource

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }
        afterSpec {
            jdbcTemplate.update("DELETE FROM public.team_members WHERE team_id = ?::uuid", MIGRATED_TEAM)
            jdbcTemplate.update("DELETE FROM public.teams WHERE id = ?::uuid", MIGRATED_TEAM)
            jdbcTemplate.execute("DROP SCHEMA IF EXISTS $MIGRATED_SCHEMA CASCADE")
        }

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

            test("an event this evening tightens it to an hour") {
                CalendarLinkFixture.extraEvent(jdbcTemplate, Instant.now().plus(Duration.ofHours(6)))

                body(fetch(ALPHA_SLUG, liveLink())) shouldContain "REFRESH-INTERVAL;VALUE=DURATION:PT1H"
            }

            test("an event tomorrow sits three hours apart") {
                CalendarLinkFixture.extraEvent(jdbcTemplate, Instant.now().plus(Duration.ofDays(1)))

                body(fetch(ALPHA_SLUG, liveLink())) shouldContain "REFRESH-INTERVAL;VALUE=DURATION:PT3H"
            }

            test("an event two and a half days out sits six hours apart") {
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

        // The whole chain in one go: EventService stamps a revision, the mapper writes and reads it,
        // CalendarIcs renders it as DTSTAMP/LAST-MODIFIED, and the ETag therefore moves. Before this,
        // DTSTAMP carried created_at, so a rescheduled training reached a subscriber's calendar
        // claiming to be the version it already had — and `updated_at` was written as created_at on
        // every save, so there was no revision time to use.
        context("a rescheduled event reaches the subscriber as a new revision") {
            test("the edit moves DTSTART, DTSTAMP and the ETag together") {
                val token = liveLink()
                val before = fetch(ALPHA_SLUG, token).andExpect(status().isOk).andReturn().response
                before.contentAsString shouldContain "DTSTART:20990106T183000Z"
                // An untouched event reports when it was written, not when it was fetched.
                before.contentAsString shouldContain "DTSTAMP:20260102T090000Z"

                reschedule(to = "2099-01-07T18:30:00Z", end = "2099-01-07T20:00:00Z")

                val after = fetch(ALPHA_SLUG, token).andExpect(status().isOk).andReturn().response
                after.contentAsString shouldContain "DTSTART:20990107T183000Z"
                after.getHeader(HttpHeaders.ETAG) shouldNotBe before.getHeader(HttpHeaders.ETAG)
                revisionOf(after.contentAsString) shouldNotBe revisionOf(before.contentAsString)
            }

            // LAST-MODIFIED is the property several clients read instead of DTSTAMP; they must agree.
            test("DTSTAMP and LAST-MODIFIED carry the same revision") {
                reschedule(to = "2099-01-08T18:30:00Z", end = "2099-01-08T20:00:00Z")

                val ics = body(fetch(ALPHA_SLUG, liveLink()))
                ics shouldContain "LAST-MODIFIED:${revisionOf(ics)}"
            }
        }

        // ADR-0040. Three events the subscriber answered three ways — the seeded training ATTENDING, one
        // MAYBE, one left unanswered — so a filter shows up as which titles are present.
        context("a link's options shape what its feed serves") {
            fun answeredThreeWays() {
                CalendarLinkFixture.answer(jdbcTemplate, ALPHA_MEMBER, "ATTENDING")
                CalendarLinkFixture.extraEvent(jdbcTemplate, FAR_FUTURE, title = "Maybe match", id = MAYBE_EVENT)
                CalendarLinkFixture.answer(jdbcTemplate, ALPHA_MEMBER, "MAYBE", eventId = MAYBE_EVENT)
                CalendarLinkFixture.extraEvent(jdbcTemplate, FAR_FUTURE, title = "Unanswered social")
            }

            test("a Partner-shaped link serves only attended events, bare titles, under a suffixed name") {
                answeredThreeWays()
                val partner = liveLink(
                    attendanceStates = listOf("ATTENDING"),
                    showAttendancePrefix = false,
                    calendarNameSuffix = "Partner",
                )

                val ics = body(fetch(ALPHA_SLUG, partner).andExpect(status().isOk))

                ics shouldContain "SUMMARY:$TRAINING\r\n"
                ics shouldNotContain "Maybe match"
                ics shouldNotContain "Unanswered social"
                ics shouldContain "X-WR-CALNAME:$ALPHA_NAME · Partner\r\n"
            }

            test("a Me-shaped link serves everything, each title wearing the answer") {
                answeredThreeWays()

                val ics = body(fetch(ALPHA_SLUG, liveLink()).andExpect(status().isOk))

                ics shouldContain "SUMMARY:✓ $TRAINING"
                ics shouldContain "SUMMARY:? Maybe match"
                ics shouldContain "SUMMARY:Unanswered social"
                ics shouldContain "X-WR-CALNAME:$ALPHA_NAME\r\n"
            }

            test("two links on the same events with different options carry different ETags") {
                answeredThreeWays()
                val me = fetch(ALPHA_SLUG, liveLink()).andReturn().response.getHeader(HttpHeaders.ETAG)
                val bare = fetch(ALPHA_SLUG, liveLink(showAttendancePrefix = false))
                    .andReturn().response.getHeader(HttpHeaders.ETAG)

                bare shouldNotBe me
            }

            // V016 gives every link that existed before the options the Me shape, so a calendar
            // subscribed before this release keeps receiving exactly what it did. This stops a schema
            // at V015, writes a link the old code would have written, and migrates the rest the way
            // startup does.
            test("a link created before the options existed still serves everything, prefixed") {
                val token = linkMigratedFromV015()

                val ics = body(fetch(MIGRATED_SLUG, token).andExpect(status().isOk))

                ics shouldContain "SUMMARY:? Old training"
                ics shouldContain "SUMMARY:Old social"
                ics shouldContain "X-WR-CALNAME:Calendar Migrated\r\n"
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

    /** Moves the seeded training through the real admin edit path, scope THIS. */
    private fun reschedule(to: String, end: String) {
        val body = """
            {"eventTypeId":"${CalendarLinkFixture.TRAINING_TYPE}","title":"$TRAINING",
             "startTime":"$to","endTime":"$end","location":"Galgenwaard; hall 1"}
        """.trimIndent()
        mockMvc.perform(
            MockMvcRequestBuilders.put("/api/events/${CalendarLinkFixture.TRAINING_ID}")
                .header("X-User-Id", ALPHA_MEMBER)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
            .andExpect(status().isOk)
    }

    private fun revisionOf(ics: String): String =
        Regex("DTSTAMP:(\\S+)").find(ics)?.groupValues?.get(1) ?: error("no DTSTAMP in feed")

    private fun head(slug: String, token: CalendarToken) =
        mockMvc.perform(MockMvcRequestBuilders.head("/api/calendar/$slug/${token.value}.ics"))

    private fun body(result: org.springframework.test.web.servlet.ResultActions) =
        result.andReturn().response.contentAsString

    private fun liveLink(
        userId: String = ALPHA_MEMBER,
        attendanceStates: List<String> = CalendarLinkFixture.ALL_STATES,
        showAttendancePrefix: Boolean = true,
        calendarNameSuffix: String? = null,
    ) = CalendarLinkFixture.link(
        jdbcTemplate, calendarLinkTokens, ALPHA_SCHEMA, userId,
        expiresAt = Instant.now().plusSeconds(3600),
        attendanceStates = attendanceStates,
        showAttendancePrefix = showAttendancePrefix,
        calendarNameSuffix = calendarNameSuffix,
    )

    /**
     * A team whose schema is migrated to V015, given a link and two events (one answered MAYBE) the
     * way the pre-options code would have stored them, then migrated to the latest version.
     */
    private fun linkMigratedFromV015(): CalendarToken {
        jdbcTemplate.execute("DROP SCHEMA IF EXISTS $MIGRATED_SCHEMA CASCADE")
        jdbcTemplate.execute("CREATE SCHEMA $MIGRATED_SCHEMA")
        Flyway.configure()
            .dataSource(dataSource)
            .schemas(MIGRATED_SCHEMA)
            .locations("classpath:db/tenant-migration")
            .table("flyway_tenant_schema_history")
            .target(PRE_OPTIONS_VERSION)
            .load()
            .migrate()

        val token = calendarLinkTokens.mint()
        jdbcTemplate.update(
            """
            INSERT INTO $MIGRATED_SCHEMA.calendar_links
                (id, user_id, token_hash, token_encrypted, label, created_at, expires_at)
            VALUES (?::uuid, ?::uuid, ?, ?, NULL, ?, ?)
            """,
            UUID.randomUUID(), MIGRATED_MEMBER, calendarLinkTokens.hash(token.value).value,
            calendarLinkTokens.conceal(token).value,
            Timestamp.from(Instant.now()), Timestamp.from(Instant.now().plusSeconds(3600)),
        )
        val oldTraining = UUID.randomUUID().toString()
        CalendarLinkFixture.extraEvent(
            jdbcTemplate, FAR_FUTURE, title = "Old training", id = oldTraining, schema = MIGRATED_SCHEMA,
        )
        CalendarLinkFixture.answer(jdbcTemplate, MIGRATED_MEMBER, "MAYBE", eventId = oldTraining, schema = MIGRATED_SCHEMA)
        CalendarLinkFixture.extraEvent(jdbcTemplate, FAR_FUTURE, title = "Old social", schema = MIGRATED_SCHEMA)

        tenantSchemaAdapter.provisionTenantSchema(MIGRATED_SCHEMA)
        CalendarLinkFixture.team(jdbcTemplate, MIGRATED_TEAM, "Calendar Migrated", MIGRATED_SLUG, MIGRATED_SCHEMA)
        CalendarLinkFixture.user(jdbcTemplate, MIGRATED_MEMBER, "cal-migrated-member@test.com", "Migrated Member")
        CalendarLinkFixture.member(jdbcTemplate, MIGRATED_TEAM, MIGRATED_MEMBER)
        return token
    }

    private companion object {
        val FAR_FUTURE: Instant = Instant.parse("2099-02-01T18:30:00Z")
        const val MAYBE_EVENT = "c8320000-0000-0000-0000-0000000000e2"
        const val MIGRATED_TEAM = "c8320000-0000-0000-0000-000000000003"
        const val MIGRATED_SCHEMA = "team_cal_migrated"
        const val MIGRATED_SLUG = "cal-migrated"

        // The last tenant version before V016 added the calendar link options.
        const val PRE_OPTIONS_VERSION = "15"

        // Its own user: the other specs rely on ALPHA_MEMBER belonging to Alpha alone, so the
        // X-User-Id shim can resolve their Active Team.
        const val MIGRATED_MEMBER = "b8320000-0000-0000-0000-000000000004"
    }
}
