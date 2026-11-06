package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import java.util.UUID

class CalendarFeedTenantFilterTest : TeamBalanceIT() {

    @Autowired
    lateinit var teamRepository: TeamRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    private data class Seen(val schema: String?, val teamId: UUID?)

    init {
        afterTest {
            TenantContext.clear()
            CurrentTeamContext.clear()
        }

        listOf("GET", "HEAD").forEach { method ->
            test("$method on the feed path binds the slug's schema and team for the chain, and clears both after") {
                val team = seedTeam()

                val seen = runFilter(method, feedPath(team.slug))

                seen.schema shouldBe team.schema
                seen.teamId shouldBe team.id
                TenantContext.isSet() shouldBe false
                CurrentTeamContext.get() shouldBe null
            }
        }

        test("clears both contexts when the chain throws, and lets the failure through") {
            val team = seedTeam()
            var seenInChain: Seen? = null

            val failure = shouldThrow<IllegalStateException> {
                filter().doFilter(request("GET", feedPath(team.slug)), MockHttpServletResponse()) { _, _ ->
                    seenInChain = currentlySeen()
                    error("boom")
                }
            }

            failure.message shouldBe "boom"
            seenInChain shouldBe Seen(team.schema, team.id)
            TenantContext.isSet() shouldBe false
            CurrentTeamContext.get() shouldBe null
        }

        test("on the feed path the slug's team replaces the session's team, so schema and team never diverge") {
            val sessionTeam = seedTeam()
            val feedTeam = seedTeam()
            TenantContext.set(sessionTeam.schema)
            CurrentTeamContext.set(sessionTeam.id)

            val seen = runFilter("GET", feedPath(feedTeam.slug))

            seen.schema shouldBe feedTeam.schema
            seen.teamId shouldBe feedTeam.id
        }

        test("an unknown slug binds nothing and leaves the session filter's contexts alone") {
            val sessionTeam = seedTeam()
            TenantContext.set(sessionTeam.schema)
            CurrentTeamContext.set(sessionTeam.id)

            val seen = runFilter("GET", feedPath("no-such-team-${UUID.randomUUID()}"))

            seen shouldBe Seen(sessionTeam.schema, sessionTeam.id)
            TenantContext.get() shouldBe sessionTeam.schema
            CurrentTeamContext.get() shouldBe sessionTeam.id
        }

        test("an unknown slug with no session binds nothing") {
            val seen = runFilter("GET", feedPath("no-such-team-${UUID.randomUUID()}"))

            seen shouldBe Seen(null, null)
        }

        listOf("GET" to "/api/events", "POST" to null, "DELETE" to null).forEach { (method, path) ->
            test("$method on ${path ?: "the feed path"} binds nothing and leaves the session filter's contexts alone") {
                val team = seedTeam()
                val sessionTeam = seedTeam()
                TenantContext.set(sessionTeam.schema)
                CurrentTeamContext.set(sessionTeam.id)

                val seen = runFilter(method, path ?: feedPath(team.slug))

                seen shouldBe Seen(sessionTeam.schema, sessionTeam.id)
                TenantContext.get() shouldBe sessionTeam.schema
                CurrentTeamContext.get() shouldBe sessionTeam.id
            }
        }
    }

    private data class SeededTeam(val id: UUID, val slug: String, val schema: String)

    private fun seedTeam(): SeededTeam {
        val id = UUID.randomUUID()
        val team = SeededTeam(id, "feed-$id", "team_${id.toString().replace("-", "")}")
        jdbcTemplate.update(
            "INSERT INTO public.teams (id, name, slug, schema_name) VALUES (?, ?, ?, ?)",
            team.id, "Feed Team", team.slug, team.schema,
        )
        return team
    }

    private fun feedPath(slug: String) = "/api/calendar/$slug/some-token.ics"

    private fun filter() = CalendarFeedTenantFilter(teamRepository)

    private fun request(method: String, path: String) = MockHttpServletRequest(method, path)

    private fun runFilter(method: String, path: String): Seen {
        var seen = Seen(null, null)
        filter().doFilter(request(method, path), MockHttpServletResponse()) { _, _ ->
            seen = currentlySeen()
        }
        return seen
    }

    private fun currentlySeen() = Seen(TenantContext.get().takeIf { TenantContext.isSet() }, CurrentTeamContext.get())
}
