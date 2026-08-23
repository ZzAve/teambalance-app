package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import jakarta.servlet.http.Cookie
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

/**
 * The switch endpoint through the real HTTP boundary (#143, ADR-0021 §2): `POST /api/teams/{slug}/activate`,
 * driven over a **real signed-in session** (magic-link verify, then the session cookie) rather than
 * the X-User-Id test shim. Two things can only be proven that way:
 *
 *  - **The session memo really is invalidated.** The Active Team is carried as a session attribute
 *    pair that every later request reads back without touching the database, so "the switch
 *    overwrote it" is a claim about a *subsequent request on the same session*. ADR-0021 calls a
 *    missed invalidation here a cross-tenant read; this is the test that would catch one.
 *  - **"Not yours" is indistinguishable from "no such Team".** Both must answer byte-identically,
 *    or the slug space becomes a probe for which Teams exist on the platform.
 */
@AutoConfigureMockMvc
class ActivateTeamControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("activating a Team the caller is a Member of returns it and remembers it as last-used") {
            val session = signIn()
            val (teamId, slug) = seedTeam()
            seedMembership(session.userId, teamId)

            activate(slug, session)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.slug").value(slug))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(teamId.toString()))

            lastActiveTeamOf(session.userId) shouldBe teamId
        }

        test("the switch is what the next request on that session reads back as its tenant") {
            val session = signIn()
            val (firstTeam, firstSlug) = seedTeam()
            val (secondTeam, secondSlug) = seedTeam()
            seedMembership(session.userId, firstTeam)
            seedMembership(session.userId, secondTeam)

            activate(firstSlug, session).andExpect(MockMvcResultMatchers.status().isOk)
            activeTeamOnMe(session) shouldBe firstSlug

            activate(secondSlug, session).andExpect(MockMvcResultMatchers.status().isOk)

            // The load-bearing assertion: without the re-pin this still reads firstSlug, and every
            // tenant-scoped read on this session lands in the previous Team's schema.
            activeTeamOnMe(session) shouldBe secondSlug
        }

        test("a Team the caller is not a Member of and an unknown slug are the same bare 404") {
            val session = signIn()
            val (mine, mySlug) = seedTeam()
            val (_, theirSlug) = seedTeam()
            seedMembership(session.userId, mine)
            activate(mySlug, session).andExpect(MockMvcResultMatchers.status().isOk)

            val notMine = activate(theirSlug, session)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
                .andReturn().response.contentAsString
            val notThere = activate("no-such-team-${UUID.randomUUID()}", session)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
                .andReturn().response.contentAsString

            // Byte-identical, and carrying no discriminator either — the caller cannot tell which of
            // the two happened, which is the whole point.
            notMine shouldBe notThere
            notMine.contains("code") shouldBe false

            // And a refused switch leaves the caller where they were, on the session and on the user.
            activeTeamOnMe(session) shouldBe mySlug
            lastActiveTeamOf(session.userId) shouldBe mine
        }

        test("the Active Team is remembered across a fresh sign-in, on a brand-new session") {
            val email = "switcher-${UUID.randomUUID()}@test.com"
            val first = signIn(email)
            val (alpha, alphaSlug) = seedTeam()
            val (bravo, bravoSlug) = seedTeam()
            seedMembership(first.userId, alpha)
            seedMembership(first.userId, bravo)
            activate(bravoSlug, first).andExpect(MockMvcResultMatchers.status().isOk)

            // A second sign-in for the same person — a new session, a new device. With two Teams open
            // and nothing remembered they would have to choose; the remembered Team is what makes the
            // landing deterministic (ADR-0021 §3).
            val fresh = signIn(email)

            activeTeamOnMe(fresh) shouldBe bravoSlug
            lastActiveTeamOf(first.userId) shouldBe bravo
            // The other Team is still theirs — remembering one is not choosing between them.
            teamSlugsOnMe(fresh) shouldBe listOf(alphaSlug, bravoSlug).sorted()
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    /** A signed-in caller: the user the magic link resolved to, plus the session cookie to carry. */
    private data class SignedIn(val userId: UUID, val cookies: List<Cookie>)

    private fun signIn(email: String = "switcher-${UUID.randomUUID()}@test.com"): SignedIn {
        tenantSchemaAdapter.provisionPlatformSchema()
        val rawToken = "activate-${UUID.randomUUID()}"
        jdbcTemplate.update(
            """
            INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, used_at, created_at)
            VALUES (?, ?, ?, ?, NULL, now())
            """,
            UUID.randomUUID(),
            sha256(rawToken),
            email,
            Timestamp.from(Instant.now().plusSeconds(900)),
        )
        val response = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"token":"$rawToken"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn().response

        val userId = UUID.fromString(
            Regex("\"id\":\"([^\"]+)\"").find(response.contentAsString)!!.groupValues[1],
        )
        return SignedIn(userId, response.cookies.toList())
    }

    private fun activate(slug: String, session: SignedIn) =
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/teams/$slug/activate").cookie(*session.cookies.toTypedArray()),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun me(session: SignedIn): String =
        mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/me").cookie(*session.cookies.toTypedArray()))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn().response.contentAsString

    /** The Active Team as the caller's own `/auth/me` reports it — i.e. what the next request resolves. */
    private fun activeTeamOnMe(session: SignedIn): String? =
        Regex("\"activeTeam\":\\{[^}]*\"slug\":\"([^\"]+)\"").find(me(session))?.groupValues?.get(1)

    private fun teamSlugsOnMe(session: SignedIn): List<String> {
        val teams = Regex("\"teams\":\\[(.*?)]").find(me(session))?.groupValues?.get(1) ?: return emptyList()
        return Regex("\"slug\":\"([^\"]+)\"").findAll(teams).map { it.groupValues[1] }.sorted().toList()
    }

    private fun lastActiveTeamOf(userId: UUID): UUID? = jdbcTemplate.queryForObject(
        "SELECT last_active_team_id FROM public.users WHERE id = ?",
        UUID::class.java,
        userId,
    )

    private fun seedTeam(): Pair<UUID, String> {
        val teamId = UUID.randomUUID()
        val slug = "switch-${teamId.toString().take(8)}"
        jdbcTemplate.update(
            "INSERT INTO public.teams (id, name, slug, schema_name) VALUES (?, ?, ?, ?)",
            teamId, "Switch Team", slug, "team_${teamId.toString().replace("-", "")}",
        )
        return teamId to slug
    }

    private fun seedMembership(userId: UUID, teamId: UUID) {
        jdbcTemplate.update(
            "INSERT INTO public.team_members (team_id, user_id, role) VALUES (?, ?, 'USER')",
            teamId, userId,
        )
    }

    private fun sha256(value: String): String =
        MessageDigest.getInstance("SHA-256").digest(value.toByteArray()).joinToString("") { "%02x".format(it) }
}
