package com.github.zzave.teambalance.api.interfaces

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.MatchFeedService
import com.github.zzave.teambalance.api.domain.model.FeedMatch
import com.github.zzave.teambalance.api.domain.model.MatchCode
import com.github.zzave.teambalance.api.domain.model.MatchLink
import com.github.zzave.teambalance.api.domain.model.MatchVenue
import com.github.zzave.teambalance.api.domain.model.NevoboTeamName
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.port.MatchFeedGateway
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Instant
import java.util.UUID

/**
 * The match feed end to end over HTTP and Postgres, with the Nevobo feed served by [FakeMatchFeedGateway].
 * Follows ResetAttendanceIT's setup: the caller's team comes from their membership, the tenant is `public`.
 * `public` has one match feed row for all tests here, so each test configures its own feed first.
 */
@AutoConfigureMockMvc
class MatchFeedIT : TeamBalanceIT() {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var jdbcTemplate: JdbcTemplate
    @Autowired lateinit var tenantSchemaAdapter: TenantSchemaAdapter
    @Autowired lateinit var matchFeedGateway: MatchFeedGateway
    @Autowired lateinit var matchFeedService: MatchFeedService
    @Autowired lateinit var tenants: TenantScopeGateway

    private val mapper = ObjectMapper()
    private val feeds get() = matchFeedGateway as FakeMatchFeedGateway

    init {
        test("an admin picks a team from the feed's team names") {
            val (admin, _) = team()
            feeds.serve(FEED, listOf(match("AA", "Alpha HS 1", "Bravo HS 2"), match("AB", "Charlie HS 3", "Alpha HS 1")))

            val teams = body(call(admin, teams(FEED)).andExpect(status().isOk))

            teams["teams"].map { it.asText() } shouldBe listOf("Alpha HS 1", "Bravo HS 2", "Charlie HS 3")
        }

        test("a URL that is not a Nevobo programme feed is refused before anything is fetched") {
            val (admin, _) = team()

            call(admin, teams("http://169.254.169.254/latest"))
                .andExpect(status().isBadRequest)
                .andExpect(jsonPath("$.code").value("INVALID_FEED_URL"))
        }

        test("a feed that cannot be read answers 503") {
            val (admin, _) = team()
            feeds.takeDown(FEED)

            call(admin, teams(FEED))
                .andExpect(status().isServiceUnavailable)
        }

        test("a member who is not an admin cannot read or set the feed") {
            val (_, member) = team()

            call(member, MockMvcRequestBuilders.get("/api/match-feed")).andExpect(status().isForbidden)
            call(member, configure("Alpha HS 1")).andExpect(status().isForbidden)
        }

        test("a team that plays no match in the feed is refused") {
            val (admin, _) = team()
            feeds.serve(FEED, listOf(match("AA", "Alpha HS 1", "Bravo HS 2")))

            call(admin, configure("Zulu HS 9"))
                .andExpect(status().isBadRequest)
                .andExpect(jsonPath("$.code").value("UNKNOWN_FEED_TEAM"))
        }

        test("the status shows a differing event and a missing match, and removing the feed removes it") {
            val (admin, _) = team()
            val us = "Delta ${UUID.randomUUID().toString().take(6)}"
            val moved = match("BA", "Echo HS 1", us)
            val unplanned = match("BB", us, "Foxtrot HS 2", start = START.plusSeconds(7 * 86_400))
            feeds.serve(FEED, listOf(moved, unplanned, match("BC", "Golf HS 1", "Hotel HS 2")))
            val event = insertEvent(admin, "Echo HS 1 - $us", START.plusSeconds(3600), "De Hal", moved.link.value)

            val status = body(call(admin, configure(us)).andExpect(status().isOk))

            status["teamName"].asText() shouldBe us
            status["lastCheckFailed"].asBoolean() shouldBe false
            status["mismatches"].size() shouldBe 1
            status["mismatches"][0]["eventId"].asText() shouldBe event.toString()
            status["mismatches"][0]["differences"].map { it.asText() } shouldBe listOf("START_TIME")
            status["missing"].map { it["code"].asText() } shouldBe listOf("BB")

            call(admin, MockMvcRequestBuilders.delete("/api/match-feed")).andExpect(status().isNoContent)
            call(admin, MockMvcRequestBuilders.get("/api/match-feed")).andExpect(status().isNotFound)
        }

        test("applying the feed gives the event the feed's values and resets responses when asked") {
            val (admin, member) = team()
            val us = "Lima ${UUID.randomUUID().toString().take(6)}"
            val match = match("DA", "Mike HS 1", us)
            feeds.serve(FEED, listOf(match))
            val event = insertEvent(admin, "Uitwedstrijd", START.plusSeconds(86_400), "Elders", match.link.value)
            insertAttendance(event, member)
            call(admin, configure(us)).andExpect(status().isOk)

            val status = body(call(admin, apply(event)).andExpect(status().isOk))

            status["mismatches"].size() shouldBe 0
            jdbcTemplate.queryForMap(
                "SELECT title, location, start_time = '$START'::timestamptz AS on_time FROM public.events WHERE uuid = '$event'::uuid",
            ) shouldBe mapOf("title" to "Mike HS 1 - $us", "location" to "De Hal", "on_time" to true)
            responseCount(event) shouldBe 0

            call(admin, apply(event)).andExpect(status().isNotFound)
        }

        test("a due check reads the feed again, a check that is not due does not, and a failed check keeps the matches") {
            val (admin, _) = team()
            val us = "India ${UUID.randomUUID().toString().take(6)}"
            feeds.serve(FEED, listOf(match("CA", us, "Juliet HS 1")))
            call(admin, configure(us)).andExpect(status().isOk)

            feeds.serve(FEED, listOf(match("CA", us, "Juliet HS 1"), match("CB", us, "Kilo HS 2")))
            checkIfDue()
            missingCodes(admin) shouldBe listOf("CA")

            lastCheckedTwoDaysAgo()
            checkIfDue()
            missingCodes(admin) shouldBe listOf("CA", "CB")

            feeds.takeDown(FEED)
            lastCheckedTwoDaysAgo()
            checkIfDue()
            val status = body(call(admin, MockMvcRequestBuilders.get("/api/match-feed")))
            status["lastCheckFailed"].asBoolean() shouldBe true
            status["missing"].map { it["code"].asText() } shouldBe listOf("CA", "CB")
        }
    }

    private fun checkIfDue() =
        tenants.within(TenantRouting(TeamId(UUID.randomUUID()), SchemaName("public"))) { matchFeedService.checkIfDue() }

    private fun lastCheckedTwoDaysAgo() =
        jdbcTemplate.execute("UPDATE public.match_feed SET last_checked_at = now() - interval '2 days'")

    private fun missingCodes(admin: String) =
        body(call(admin, MockMvcRequestBuilders.get("/api/match-feed")))["missing"].map { it["code"].asText() }

    private fun teams(feedUrl: String) =
        MockMvcRequestBuilders.post("/api/match-feed/teams")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"feedUrl":"$feedUrl"}""")

    private fun apply(eventId: UUID) =
        MockMvcRequestBuilders.post("/api/match-feed/apply")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"eventId":"$eventId","resetResponses":true}""")

    private fun configure(teamName: String) =
        MockMvcRequestBuilders.put("/api/match-feed")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"feedUrl":"$FEED","teamName":"$teamName"}""")

    private fun call(caller: String, builder: MockHttpServletRequestBuilder): ResultActions {
        val result = mockMvc.perform(builder.with(loginAs(caller, tenant = "public")))
            .andExpect(request().asyncStarted()).andReturn()
        return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
    }

    private fun body(result: ResultActions): JsonNode = mapper.readTree(result.andReturn().response.contentAsString)

    private fun match(code: String, home: String, away: String, start: Instant = START) = FeedMatch(
        code = MatchCode(code),
        link = MatchLink("https://api.nevobo.nl/permalink/wedstrijd/${UUID.randomUUID()}"),
        startTime = start,
        homeTeam = NevoboTeamName(home),
        awayTeam = NevoboTeamName(away),
        venue = MatchVenue("De Hal"),
    )

    /** A fresh team with an admin and a plain member, both returned as user ids. */
    private fun team(): Pair<String, String> {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
        val teamId = UUID.randomUUID()
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$teamId'::uuid, 'Team $teamId', 'feed-$teamId', 'feed-$teamId')",
        )
        return member(teamId, "ADMIN") to member(teamId, "USER")
    }

    private fun member(teamId: UUID, role: String): String {
        val userId = UUID.randomUUID().toString()
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) VALUES ('$userId'::uuid, '$userId@feed.test', 'Feed $role')",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$teamId'::uuid, '$userId'::uuid, '$role', 'Setter')")
        return userId
    }

    private fun insertEvent(createdBy: String, title: String, start: Instant, location: String, reference: String): UUID {
        val eventId = UUID.randomUUID()
        jdbcTemplate.execute(
            """
            INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, location, created_by, created_at, updated_at)
            VALUES ('$eventId'::uuid, (SELECT id FROM public.event_types WHERE name = 'Training'),
                '$title', '$start', '$start', '$location', '$createdBy'::uuid, now(), now())
            """,
        )
        jdbcTemplate.execute(
            """
            INSERT INTO public.event_references (event_id, position, title, url)
            VALUES ((SELECT id FROM public.events WHERE uuid = '$eventId'::uuid), 0, 'Nevobo', '$reference')
            """,
        )
        return eventId
    }

    private fun insertAttendance(eventId: UUID, userId: String) = jdbcTemplate.execute(
        """
        INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at, changed_by)
        VALUES (gen_random_uuid(), (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
            '$userId'::uuid, 'ATTENDING', now(), '$userId'::uuid)
        """,
    )

    private fun responseCount(eventId: UUID): Int = jdbcTemplate.queryForObject(
        "SELECT count(*) FROM public.attendances a JOIN public.events e ON e.id = a.event_id WHERE e.uuid = '$eventId'::uuid",
        Long::class.java,
    )!!.toInt()

    private companion object {
        const val FEED = "https://api.nevobo.nl/export/poule/regio-west/regio-west-h2j-12/programma.rss"
        val START: Instant = Instant.parse("2050-03-01T19:30:00Z")
    }
}
