package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.infrastructure.email.FakeEmailGateway
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import jakarta.servlet.http.Cookie
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

// Ids dedicated to this spec: the Testcontainers DB is shared, and these assertions are about who is
// and is not on a roster.
private const val OPERATOR_ID = "e0000000-0000-0000-0000-0000000000c1"
private const val MEMBER_ID = "e0000000-0000-0000-0000-0000000000c2"
private const val TEAM_ID = "f0000000-0000-0000-0000-0000000000ca"
private const val OTHER_TEAM_ID = "f0000000-0000-0000-0000-0000000000cb"
private const val TEAM_SCHEMA = "team_act_as_it"
private const val OTHER_TEAM_SCHEMA = "team_act_as_it_two"
private const val OPERATOR_EMAIL = "act-as-it-operator@test.com"

// Act-as is gated on the platform-admin allowlist, which is empty by default in the test profile
// (fail-closed). The operator seeded below holds this email and is a Member of nothing (ADR-0024 §3).
@AutoConfigureMockMvc
@Import(ActAsControllerIT.TestConfig::class)
@TestPropertySource(properties = ["teambalance.platform-admins=$OPERATOR_EMAIL"])
class ActAsControllerIT : TeamBalanceIT() {

    @TestConfiguration
    class TestConfig {
        @Bean
        @Primary
        fun emailGateway(): EmailGateway = FakeEmailGateway()
    }

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var fakeEmailGateway: FakeEmailGateway

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { seed() }

        context("the platform console") {
            test("lists every Team for a Platform Admin, whether or not anyone is a Member") {
                listTeamsAs(OPERATOR_ID)
                    .andExpect(status().isOk)
                    .andExpect(jsonPath("$.teams[?(@.id == '$TEAM_ID')]").exists())
                    .andExpect(jsonPath("$.teams[?(@.id == '$OTHER_TEAM_ID')]").exists())
            }

            test("is closed to an ordinary member") {
                listTeamsAs(MEMBER_ID).andExpect(status().isForbidden)
            }
        }

        context("entering a Team") {
            test("answers with the Team it entered — the name the banner needs") {
                enterAs(OPERATOR_ID, TEAM_ID)
                    .andExpect(status().isOk)
                    .andExpect(jsonPath("$.team.id").value(TEAM_ID))
                    .andExpect(jsonPath("$.team.name").value("Act-as IT Team"))
                    .andExpect(jsonPath("$.expiresAt").isNotEmpty)
            }

            // ADR-0024 §2, invariant 2, on the table rather than on a mock: a Virtual Member that
            // leaked into `team_members` would land the operator in the roster, in every attendance
            // denominator and in the Hall of Shame.
            test("writes no team_members row, then or ever") {
                enterAs(OPERATOR_ID, TEAM_ID).andExpect(status().isOk)
                createPositionAs(OPERATOR_ID, "Setter").andExpect(status().isCreated)

                membershipCount(OPERATOR_ID) shouldBe 0
            }

            test("is refused for a caller off the allowlist, however ordinary-looking the team id") {
                enterAs(MEMBER_ID, TEAM_ID)
                    .andExpect(status().isForbidden)
                    .andExpect(jsonPath("$.code").value("NOT_PLATFORM_ADMIN"))
            }

            test("a Team that does not exist is a 404") {
                enterAs(OPERATOR_ID, "f0000000-0000-0000-0000-0000000000ff").andExpect(status().isNotFound)
            }
        }

        context("working inside the Team") {
            // The Virtual Member is the whole point: full write, as an Admin (ADR-0024 §1).
            test("a Platform Admin who entered writes as an Admin of that Team") {
                enterAs(OPERATOR_ID, TEAM_ID).andExpect(status().isOk)

                createPositionAs(OPERATOR_ID, "Libero").andExpect(status().isCreated)
            }

            // The keystone (ADR-0024 §2): being on the allowlist is not being in a team.
            test("a Platform Admin who has NOT entered is nobody, and reaches no tenant at all") {
                createPositionAs(OPERATOR_ID, "Outside Hitter")
                    .andExpect(status().isForbidden)
                    .andExpect(jsonPath("$.code").value("NO_TEAM_MEMBERSHIP"))
            }

            test("entering a second Team moves the writes with it") {
                enterAs(OPERATOR_ID, TEAM_ID).andExpect(status().isOk)
                enterAs(OPERATOR_ID, OTHER_TEAM_ID).andExpect(status().isOk)

                createPositionAs(OPERATOR_ID, "Setter").andExpect(status().isCreated)
                positionCount(OTHER_TEAM_ID) shouldBe 1
                positionCount(TEAM_ID) shouldBe 0
            }
        }

        context("the box running out") {
            test("is reported as ACT_AS_EXPIRED, not as a 403 the frontend cannot tell apart") {
                enterAs(OPERATOR_ID, TEAM_ID).andExpect(status().isOk)
                expireGrant()

                createPositionAs(OPERATOR_ID, "Setter")
                    .andExpect(status().isForbidden)
                    .andExpect(jsonPath("$.code").value("ACT_AS_EXPIRED"))
            }

            test("leaves no tenant behind — a lapsed operator writes nowhere, not somewhere else") {
                enterAs(OPERATOR_ID, TEAM_ID).andExpect(status().isOk)
                expireGrant()

                createPositionAs(OPERATOR_ID, "Setter")
                positionCount(TEAM_ID) shouldBe 0
            }
        }

        context("leaving") {
            test("exit drops the tenant, and the next write is refused") {
                enterAs(OPERATOR_ID, TEAM_ID).andExpect(status().isOk)

                dispatch(MockMvcRequestBuilders.post("/api/admin/act-as/exit").header("X-User-Id", OPERATOR_ID))
                    .andExpect(status().isNoContent)

                createPositionAs(OPERATOR_ID, "Setter")
                    .andExpect(status().isForbidden)
                    .andExpect(jsonPath("$.code").value("NO_TEAM_MEMBERSHIP"))
            }
        }

        context("/auth/me while inside a Team") {
            test("names the Team, reports the synthesized ADMIN, and stays teamless") {
                val session = signInOperator()
                enterOn(session, TEAM_ID).andExpect(status().isOk)

                dispatch(MockMvcRequestBuilders.get("/api/auth/me").cookie(session))
                    .andExpect(status().isOk)
                    .andExpect(jsonPath("$.actAs.team.slug").value("act-as-it-team"))
                    .andExpect(jsonPath("$.activeTeam.id").value(TEAM_ID))
                    .andExpect(jsonPath("$.role").value("ADMIN"))
                    .andExpect(jsonPath("$.isPlatformAdmin").value(true))
                    .andExpect(jsonPath("$.teams").isEmpty)
            }

            // Also the trap, end to end: the session memo still names the tenant, and act-as still
            // reports nothing — otherwise the box would never close for a signed-in operator.
            test("reports no act-as once the box has run out, so the gate sends them to the console") {
                val session = signInOperator()
                enterOn(session, TEAM_ID).andExpect(status().isOk)
                expireGrant()

                dispatch(MockMvcRequestBuilders.get("/api/auth/me").cookie(session))
                    .andExpect(status().isOk)
                    .andExpect(jsonPath("$.actAs").doesNotExist())
                    .andExpect(jsonPath("$.activeTeam").doesNotExist())
            }
        }

        // The grant outlives a session on purpose — it is a durable, time-boxed record — but it must
        // never be *resumed*, or act-as stops being a mode you enter and becomes one you find
        // yourself in after a login (ADR-0024 §4).
        context("across sessions") {
            test("a fresh sign-in does not resume an open grant") {
                enterOn(signInOperator(), TEAM_ID).andExpect(status().isOk)

                val second = signInOperator()

                dispatch(MockMvcRequestBuilders.get("/api/auth/me").cookie(second))
                    .andExpect(status().isOk)
                    .andExpect(jsonPath("$.actAs").doesNotExist())
                createPositionAs(OPERATOR_ID, "Setter")
                    .andExpect(status().isForbidden)
                    .andExpect(jsonPath("$.code").value("NO_TEAM_MEMBERSHIP"))
            }

            test("signing out leaves the Team behind") {
                val session = signInOperator()
                enterOn(session, TEAM_ID).andExpect(status().isOk)

                dispatch(MockMvcRequestBuilders.post("/api/auth/logout").cookie(session))
                    .andExpect(status().isNoContent)

                createPositionAs(OPERATOR_ID, "Setter")
                    .andExpect(status().isForbidden)
                    .andExpect(jsonPath("$.code").value("NO_TEAM_MEMBERSHIP"))
            }
        }

        context("the Act-as Record") {
            test("is visible to the team, attributes the platform generically, and names no operator") {
                enterAs(OPERATOR_ID, TEAM_ID).andExpect(status().isOk)

                val body = dispatch(MockMvcRequestBuilders.get("/api/team/act-as-records").header("X-User-Id", MEMBER_ID))
                    .andExpect(status().isOk)
                    .andExpect(jsonPath("$.records[0].actorKind").value("PLATFORM_ADMIN"))
                    .andExpect(jsonPath("$.records[0].exitedAt").doesNotExist())
                    .andReturn().response.contentAsString

                (OPERATOR_EMAIL in body) shouldBe false
                (OPERATOR_ID in body) shouldBe false
            }

            test("stamps the end of an episode that was left deliberately") {
                enterAs(OPERATOR_ID, TEAM_ID).andExpect(status().isOk)
                dispatch(MockMvcRequestBuilders.post("/api/admin/act-as/exit").header("X-User-Id", OPERATOR_ID))

                dispatch(MockMvcRequestBuilders.get("/api/team/act-as-records").header("X-User-Id", MEMBER_ID))
                    .andExpect(status().isOk)
                    .andExpect(jsonPath("$.records[0].exitedAt").isNotEmpty)
            }
        }
    }

    // The Wirespec handlers are suspend → the request dispatches asynchronously; complete it.
    private fun dispatch(builder: MockHttpServletRequestBuilder): ResultActions =
        mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun listTeamsAs(userId: String) =
        dispatch(MockMvcRequestBuilders.get("/api/admin/teams").header("X-User-Id", userId))

    private fun enterOn(session: Cookie, teamId: String) =
        dispatch(
            MockMvcRequestBuilders.post("/api/admin/act-as")
                .cookie(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"teamId":"$teamId"}"""),
        )

    private fun enterAs(userId: String, teamId: String) =
        dispatch(
            MockMvcRequestBuilders.post("/api/admin/act-as")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"teamId":"$teamId"}"""),
        )

    private fun createPositionAs(userId: String, label: String) =
        dispatch(
            MockMvcRequestBuilders.post("/api/positions")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"label":"$label"}"""),
        )

    /**
     * A real session for the operator. `/auth/me` answers on the session identity, not on the
     * `X-User-Id` test shim, so these cases go through the actual magic-link flow. The user row is
     * seeded first, so verify resolves the existing (allowlisted) operator rather than creating one.
     */
    private fun signInOperator(): Cookie {
        dispatch(
            MockMvcRequestBuilders.post("/api/auth/magic-link/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"email":"$OPERATOR_EMAIL"}"""),
        ).andExpect(status().isAccepted)
        val token = fakeEmailGateway.sentMagicLinks.last { it.first.value == OPERATOR_EMAIL }.second
        return dispatch(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"token":"$token"}"""),
        ).andExpect(status().isOk).andReturn().response.cookies.first()
    }

    /** Runs the 60-minute box out without waiting for it — the grant's own expiry, not the session's. */
    private fun expireGrant() {
        jdbcTemplate.update(
            "UPDATE public.act_as_sessions SET expires_at = now() - interval '1 minute' " +
                "WHERE created_by = ?::uuid AND exited_at IS NULL",
            OPERATOR_ID,
        )
    }

    private fun membershipCount(userId: String): Int =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.team_members WHERE user_id = ?::uuid", Int::class.java, userId,
        )!!

    private fun positionCount(teamId: String): Int =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.team_positions WHERE team_id = ?::uuid", Int::class.java, teamId,
        )!!

    private fun seed() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema(TEAM_SCHEMA)
        tenantSchemaAdapter.provisionTenantSchema(OTHER_TEAM_SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) VALUES " +
                "('$TEAM_ID'::uuid, 'Act-as IT Team', 'act-as-it-team', '$TEAM_SCHEMA'), " +
                "('$OTHER_TEAM_ID'::uuid, 'Act-as IT Other', 'act-as-it-other', '$OTHER_TEAM_SCHEMA') " +
                "ON CONFLICT DO NOTHING",
        )
        // Shared DB, no per-test rollback — reset to a known state before each case.
        jdbcTemplate.execute("DELETE FROM public.act_as_sessions WHERE created_by = '$OPERATOR_ID'::uuid")
        jdbcTemplate.execute(
            "DELETE FROM public.team_positions WHERE team_id IN ('$TEAM_ID'::uuid, '$OTHER_TEAM_ID'::uuid)",
        )
        jdbcTemplate.execute("DELETE FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid")
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$OPERATOR_ID'::uuid, '$OPERATOR_EMAIL', 'Platform Operator') " +
                "ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$MEMBER_ID'::uuid, 'act-as-it-member@test.com', 'Act-as IT Member') " +
                "ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$MEMBER_ID'::uuid, 'USER', NULL)")
    }
}
