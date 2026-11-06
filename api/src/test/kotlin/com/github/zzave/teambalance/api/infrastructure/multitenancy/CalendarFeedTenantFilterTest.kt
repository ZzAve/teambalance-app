package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.application.TeamDirectory
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import java.util.UUID

class CalendarFeedTenantFilterTest : FunSpec() {

    private data class Seen(val schema: String?, val teamId: UUID?)

    private val directory = TeamDirectory()
    private val feedTeam = directory.addTeam("Feed Team", "feed-team")
    private val feedSchema = directory.schemaOf(feedTeam).value
    private val filter = CalendarFeedTenantFilter(directory.teamRepository())

    private fun run(method: String, path: String): Seen {
        var seen = Seen(null, null)
        filter.doFilter(MockHttpServletRequest(method, path), MockHttpServletResponse()) { _, _ ->
            seen = Seen(TenantContext.get().takeIf { TenantContext.isSet() }, CurrentTeamContext.get())
        }
        return seen
    }

    init {
        afterTest {
            TenantContext.clear()
            CurrentTeamContext.clear()
        }

        test("without a session, binds the slug's schema and team together and clears both after") {
            run("GET", "/api/calendar/feed-team/token.ics") shouldBe Seen(feedSchema, feedTeam.value)

            TenantContext.isSet() shouldBe false
            CurrentTeamContext.get() shouldBe null
        }

        test("HEAD binds the same as GET") {
            run("HEAD", "/api/calendar/feed-team/token.ics") shouldBe Seen(feedSchema, feedTeam.value)
        }

        test("over a session bound to another team, binds the slug's team for the request and restores the session's after") {
            val sessionTeam = UUID.randomUUID()
            TenantContext.set("team_session")
            CurrentTeamContext.set(sessionTeam)

            run("GET", "/api/calendar/feed-team/token.ics") shouldBe Seen(feedSchema, feedTeam.value)

            TenantContext.get() shouldBe "team_session"
            CurrentTeamContext.get() shouldBe sessionTeam
        }

        test("leaves the context alone for an unknown slug or a path that is not the feed") {
            val sessionTeam = UUID.randomUUID()
            TenantContext.set("team_session")
            CurrentTeamContext.set(sessionTeam)

            run("GET", "/api/calendar/no-such-team/token.ics") shouldBe Seen("team_session", sessionTeam)
            run("GET", "/api/events") shouldBe Seen("team_session", sessionTeam)
            run("POST", "/api/calendar/feed-team/token.ics") shouldBe Seen("team_session", sessionTeam)

            TenantContext.get() shouldBe "team_session"
            CurrentTeamContext.get() shouldBe sessionTeam
        }
    }
}
