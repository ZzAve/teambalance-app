package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.ActiveTeamService
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.infrastructure.identity.UserContext
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.mock.web.MockHttpSession
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.test.context.TestPropertySource
import org.springframework.web.context.request.ServletRequestAttributes
import java.util.UUID

private const val PLATFORM_ADMIN_EMAIL = "act-as-operator@test.com"

// The test profile's allowlist is empty (fail-closed), so pin one email for the act-as cases below;
// the operator user is seeded with it, and is deliberately a Member of nothing (ADR-0024 §3).
@TestPropertySource(properties = ["teambalance.platform-admins=$PLATFORM_ADMIN_EMAIL"])
class SessionTenantContextFilterTest : TeamBalanceIT() {

    @Autowired
    lateinit var activeTeamService: ActiveTeamService

    @Autowired
    lateinit var actAsService: ActAsService

    @Autowired
    lateinit var currentUserGateway: CurrentUserGateway

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        afterTest {
            TenantContext.clear()
            CurrentTeamContext.clear()
            UserContext.clear()
            ActAsContext.clear()
        }

        test("session user with a team_members row resolves schema and team id from the same row") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val userId = UUID.randomUUID()
            val teamId = UUID.randomUUID()
            val schemaName = "team_${teamId.toString().replace("-", "")}"
            seedMember(userId, teamId, schemaName)

            // SessionUserContextFilter (order +2) would have set UserContext before this filter runs.
            UserContext.set(userId)
            val resolved = runFilter()

            resolved.wasSet shouldBe true
            resolved.schema shouldBe schemaName
            resolved.teamId shouldBe teamId
            TenantContext.isSet() shouldBe false
        }

        test("second request on the same session resolves schema and team id from cache without a DB lookup") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val userId = UUID.randomUUID()
            val teamId = UUID.randomUUID()
            val schemaName = "team_${teamId.toString().replace("-", "")}"
            seedMember(userId, teamId, schemaName)

            val session = MockHttpSession()

            // First request resolves from the DB and memoizes schema + team id on the session.
            UserContext.set(userId)
            val first = runFilter(session)
            first.wasSet shouldBe true
            first.schema shouldBe schemaName
            first.teamId shouldBe teamId

            // Remove the backing row so a DB lookup would now resolve to nothing.
            jdbcTemplate.update("DELETE FROM public.team_members WHERE user_id = ?", userId)

            // Second request on the same session still resolves both — only possible from the cache.
            UserContext.set(userId)
            val second = runFilter(session)
            second.wasSet shouldBe true
            second.schema shouldBe schemaName
            second.teamId shouldBe teamId
        }

        // The memo is a CORRECTNESS concern since #143, not a cache (ADR-0023 §2): it is what says
        // which Team the request is scoped to. This is the direct test that a switch overwrites it —
        // a switch that did not would leave the very next request reading the previous tenant.
        test("switching the Active Team overwrites the session memo, so the next request follows") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val userId = UUID.randomUUID()
            val first = UUID.randomUUID()
            val second = UUID.randomUUID()
            seedMember(userId, first, schemaFor(first))
            seedTeam(second, schemaFor(second))
            seedMembership(userId, second)

            val session = MockHttpSession()

            // Land in `first` explicitly, then memoize it by taking one request through the filter.
            activate(userId, first, session)
            UserContext.set(userId)
            runFilter(session).schema shouldBe schemaFor(first)

            activate(userId, second, session)

            UserContext.set(userId)
            val afterSwitch = runFilter(session)
            afterSwitch.schema shouldBe schemaFor(second)
            afterSwitch.teamId shouldBe second
        }

        // The other half of the same guarantee: a refused switch must not disturb the memo either, or
        // a probe for someone else's Team would knock the caller out of their own.
        test("a refused switch leaves the memo - and the Active Team - exactly as it was") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val userId = UUID.randomUUID()
            val mine = UUID.randomUUID()
            val theirs = UUID.randomUUID()
            seedMember(userId, mine, schemaFor(mine))
            seedTeam(theirs, schemaFor(theirs))

            val session = MockHttpSession()
            activate(userId, mine, session)

            activateExpectingRefusal(userId, theirs, session)

            UserContext.set(userId)
            runFilter(session).schema shouldBe schemaFor(mine)
        }

        // ADR-0024 §2, invariant 2, asserted where it actually matters: on the table. A synthesized
        // Virtual Member that leaked into `team_members` would put the operator in the roster, in
        // every attendance denominator and in the Hall of Shame — and no mock would notice.
        test("act-as routes a Platform Admin into a Team while writing no team_members row") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val operator = seedPlatformAdmin()
            val teamId = UUID.randomUUID()
            seedTeam(teamId, schemaFor(teamId))

            enterActAs(operator, teamId)

            UserContext.set(operator)
            val resolved = runFilter(MockHttpSession())
            resolved.schema shouldBe schemaFor(teamId)
            resolved.teamId shouldBe teamId
            membershipCount(operator) shouldBe 0
        }

        // THE trap (ADR-0024 §4). The session memo is never re-verified, so if act-as resolved through
        // it like an ordinary membership the 60-minute box would never close for tenant routing and
        // act-as would be a property carried for the four-week life of the session (ADR-0015).
        test("a lapsed grant resolves to NO tenant even though the session memo still holds one") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val operator = seedPlatformAdmin()
            val teamId = UUID.randomUUID()
            seedTeam(teamId, schemaFor(teamId))
            enterActAs(operator, teamId)

            // Memoize the tenant on the session the way a first request does...
            val session = MockHttpSession()
            UserContext.set(operator)
            runFilter(session).schema shouldBe schemaFor(teamId)

            // ...then let the box run out. Only the grant knows; the memo is unchanged.
            expireGrant(operator)

            UserContext.set(operator)
            val afterLapse = runFilter(session)
            afterLapse.wasSet shouldBe false
            afterLapse.teamId shouldBe null
            TenantRoutingSession.read(session) shouldBe null
        }

        test("exiting drops the tenant immediately, without waiting for the box") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val operator = seedPlatformAdmin()
            val teamId = UUID.randomUUID()
            seedTeam(teamId, schemaFor(teamId))
            enterActAs(operator, teamId)

            val session = MockHttpSession()
            UserContext.set(operator)
            runFilter(session).teamId shouldBe teamId

            inBoundRequest(session) { actAsService.exit(UserId(operator)) }

            UserContext.set(operator)
            runFilter(session).teamId shouldBe null
        }

        test("session user with no team_members row falls through with no silent fallback") {
            tenantSchemaAdapter.provisionPlatformSchema()
            val userId = UUID.randomUUID()

            jdbcTemplate.update(
                "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
                userId, "teamless-$userId@test.com", "Teamless User",
            )

            UserContext.set(userId)
            val resolved = runFilter()

            resolved.wasSet shouldBe false
            resolved.schema shouldBe "public"
            resolved.teamId shouldBe null
            TenantContext.isSet() shouldBe false
        }
    }

    private fun schemaFor(teamId: UUID) = "team_${teamId.toString().replace("-", "")}"

    private fun seedMember(userId: UUID, teamId: UUID, schemaName: String) {
        jdbcTemplate.update(
            "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
            userId, "member-$userId@test.com", "Test Member",
        )
        seedTeam(teamId, schemaName)
        seedMembership(userId, teamId)
    }

    private fun seedTeam(teamId: UUID, schemaName: String) {
        jdbcTemplate.update(
            "INSERT INTO public.teams (id, name, slug, schema_name) VALUES (?, ?, ?, ?)",
            teamId, "Test Team", "test-team-$teamId", schemaName,
        )
    }

    /** A Platform Admin: on the allowlist, and a Member of nothing (ADR-0024 §3). */
    private fun seedPlatformAdmin(): UUID {
        // One allowlisted email, several tests: reuse the row rather than colliding on it.
        jdbcTemplate.queryForList("SELECT id FROM public.users WHERE email = ?", UUID::class.java, PLATFORM_ADMIN_EMAIL)
            .firstOrNull()
            ?.let { existing ->
                jdbcTemplate.update("DELETE FROM public.act_as_sessions WHERE created_by = ?", existing)
                return existing
            }
        val id = UUID.randomUUID()
        jdbcTemplate.update(
            "INSERT INTO public.users (id, email, display_name) VALUES (?, ?, ?)",
            id, PLATFORM_ADMIN_EMAIL, "Platform Operator",
        )
        return id
    }

    private fun enterActAs(operator: UUID, teamId: UUID) =
        inBoundRequest(MockHttpSession()) { actAsService.enter(UserId(operator), TeamId(teamId)) }

    /** Runs the 60-minute box out without waiting for it — the grant's own expiry, not the session's. */
    private fun expireGrant(operator: UUID) {
        jdbcTemplate.update(
            "UPDATE public.act_as_sessions SET expires_at = now() - interval '1 minute' " +
                "WHERE created_by = ? AND exited_at IS NULL",
            operator,
        )
    }

    private fun membershipCount(userId: UUID): Int =
        jdbcTemplate.queryForObject("SELECT count(*) FROM public.team_members WHERE user_id = ?", Int::class.java, userId)!!

    private fun seedMembership(userId: UUID, teamId: UUID) {
        jdbcTemplate.update(
            "INSERT INTO public.team_members (team_id, user_id, role) VALUES (?, ?, 'USER')",
            teamId, userId,
        )
    }

    /**
     * Performs a switch the way a request would: the routing gateway pins onto the session behind the
     * request-scoped [HttpServletRequest] proxy, so the switch has to run inside a bound request — the
     * same constraint the real controller runs under.
     */
    private fun activate(userId: UUID, teamId: UUID, session: MockHttpSession) =
        inBoundRequest(session) {
            activeTeamService.activate(UserId(userId), TeamId(teamId)).shouldNotBeNull()
        }

    private fun activateExpectingRefusal(userId: UUID, teamId: UUID, session: MockHttpSession) =
        inBoundRequest(session) {
            activeTeamService.activate(UserId(userId), TeamId(teamId)) shouldBe null
        }

    private fun <T> inBoundRequest(session: MockHttpSession, block: () -> T): T {
        val request = MockHttpServletRequest().apply { setSession(session) }
        RequestContextHolder.setRequestAttributes(ServletRequestAttributes(request))
        try {
            return block()
        } finally {
            RequestContextHolder.resetRequestAttributes()
        }
    }

    private data class Resolved(val schema: String?, val teamId: UUID?, val wasSet: Boolean)

    private fun runFilter(session: MockHttpSession? = null): Resolved {
        val filter = SessionTenantContextFilter(activeTeamService, actAsService, currentUserGateway)
        val request = MockHttpServletRequest().apply { session?.let { setSession(it) } }
        var resolved = Resolved(null, null, false)
        filter.doFilter(request, MockHttpServletResponse()) { _, _ ->
            resolved = Resolved(TenantContext.get(), CurrentTeamContext.get(), TenantContext.isSet())
        }
        return resolved
    }
}
