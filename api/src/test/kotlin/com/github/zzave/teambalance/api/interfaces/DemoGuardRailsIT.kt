package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.DemoPersona
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

private val SANNE = DemoPersona.MEMBER.userId.value.toString()
private val KEES = DemoPersona.ADMIN.userId.value.toString()
private val DEMO_TEAM = DemoPersona.TEAM_ID.value.toString()
private const val EXTRA_USER = "d0000000-0000-0000-0000-0000000000e1"
private const val OTHER_ADMIN = "d0000000-0000-0000-0000-0000000000e2"
private const val OTHER_TEAM = "d0000000-0000-0000-0000-0000000000e3"
private const val OTHER_SCHEMA = "team_demo_guard_other"

/**
 * The demo team's write blocks (ADR-0043): its two personas cannot be removed or have their role changed, scoped to the
 * demo team id. Everything else on the demo team, and every other team, behaves as in prod. The app has no endpoint
 * that deletes a team, so there is no block to prove for that.
 */
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.demo.enabled=true",
        "teambalance.email.send=false",
        "teambalance.bunq.environment=fake",
    ],
)
class DemoGuardRailsIT : TeamBalanceIT() {

    @Autowired lateinit var mockMvc: MockMvc

    @Autowired lateinit var jdbcTemplate: JdbcTemplate

    @Autowired lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeSpec {
            tenantSchemaAdapter.provisionTenantSchema(OTHER_SCHEMA)
            jdbcTemplate.update(
                "INSERT INTO public.teams (id, name, slug, schema_name) " +
                    "VALUES (?::uuid, 'Guard other', 'demo-guard-other', ?) ON CONFLICT DO NOTHING",
                OTHER_TEAM,
                OTHER_SCHEMA,
            )
            jdbcTemplate.update(
                "INSERT INTO public.users (id, email, display_name) VALUES " +
                    "(?::uuid, 'guard-extra@test.com', 'Extra'), (?::uuid, 'guard-other-admin@test.com', 'Other admin') " +
                    "ON CONFLICT DO NOTHING",
                EXTRA_USER,
                OTHER_ADMIN,
            )
        }
        // The demo schema is shared with the other ITs: leave the roster as the seed made it.
        afterSpec {
            // The edit test sends no position or shirt number, which clears them: put the seed back.
            jdbcTemplate.update(
                "UPDATE ${DemoPersona.SCHEMA}.member_profiles SET position_id = ?::uuid, shirt_number = 7 WHERE user_id = ?::uuid",
                "d0000000-0000-0000-0002-000000000002",
                SANNE,
            )
            jdbcTemplate.update("DELETE FROM public.invitations WHERE team_id = ?::uuid AND role = 'ADMIN'", DEMO_TEAM)
            jdbcTemplate.update("DELETE FROM public.team_members WHERE team_id = ?::uuid", OTHER_TEAM)
            jdbcTemplate.update(
                "DELETE FROM public.team_members WHERE team_id = ?::uuid AND user_id = ?::uuid",
                DEMO_TEAM,
                EXTRA_USER,
            )
        }

        test("removing Sanne is refused with 403 and she stays on the roster") {
            remove(KEES, SANNE)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("DEMO_PERSONA_PROTECTED"))
            active(DEMO_TEAM, SANNE) shouldBe true
        }

        test("removing Coach Kees is refused with 403") {
            remove(KEES, KEES)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("DEMO_PERSONA_PROTECTED"))
            active(DEMO_TEAM, KEES) shouldBe true
        }

        test("demoting Coach Kees and promoting Sanne are refused with 403") {
            update(KEES, KEES, "Coach Kees", "USER")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("DEMO_PERSONA_PROTECTED"))
            update(KEES, SANNE, "Sanne", "ADMIN")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("DEMO_PERSONA_PROTECTED"))
            role(DEMO_TEAM, KEES) shouldBe "ADMIN"
            role(DEMO_TEAM, SANNE) shouldBe "USER"
        }

        test("an admin handover link cannot promote Sanne, and the link stays unspent") {
            val created = perform(MockMvcRequestBuilders.post("/api/invitations/admin"), KEES)
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andReturn().response.contentAsString
            val token = Regex(""""token":"([^"]+)"""").find(created)!!.groupValues[1]

            perform(MockMvcRequestBuilders.post("/api/invitations/$token/accept"), SANNE)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("DEMO_PERSONA_PROTECTED"))
            role(DEMO_TEAM, SANNE) shouldBe "USER"
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.invitations WHERE team_id = ?::uuid AND role = 'ADMIN' AND consumed_at IS NULL",
                Int::class.java,
                DEMO_TEAM,
            ) shouldBe 1
        }

        test("the Bunq connection of the demo team cannot be disconnected") {
            perform(MockMvcRequestBuilders.delete("/api/team/money-pool/connection"), KEES)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("DEMO_BUNQ_CONNECTION_LOCKED"))
            jdbcTemplate.queryForObject("SELECT count(*) FROM ${DemoPersona.SCHEMA}.bunq_connection", Int::class.java) shouldBe 1
        }

        test("a persona can still be edited without a role change") {
            update(KEES, SANNE, "Sanne", "USER").andExpect(MockMvcResultMatchers.status().isOk)
        }

        test("any other member of the demo team can still be removed") {
            jdbcTemplate.update(
                "INSERT INTO public.team_members (team_id, user_id, role) VALUES (?::uuid, ?::uuid, 'USER') ON CONFLICT DO NOTHING",
                DEMO_TEAM,
                EXTRA_USER,
            )
            remove(KEES, EXTRA_USER).andExpect(MockMvcResultMatchers.status().isNoContent)
            active(DEMO_TEAM, EXTRA_USER) shouldBe false
        }

        test("in another team the persona ids are ordinary users: they can be demoted and removed") {
            jdbcTemplate.update("DELETE FROM public.team_members WHERE team_id = ?::uuid", OTHER_TEAM)
            listOf(OTHER_ADMIN to "ADMIN", KEES to "ADMIN", SANNE to "USER").forEach { (user, role) ->
                jdbcTemplate.update(
                    "INSERT INTO public.team_members (team_id, user_id, role) VALUES (?::uuid, ?::uuid, ?)",
                    OTHER_TEAM,
                    user,
                    role,
                )
            }

            update(OTHER_ADMIN, KEES, "Coach Kees", "USER").andExpect(MockMvcResultMatchers.status().isOk)
            remove(OTHER_ADMIN, SANNE).andExpect(MockMvcResultMatchers.status().isNoContent)
            active(OTHER_TEAM, SANNE) shouldBe false
            role(OTHER_TEAM, KEES) shouldBe "USER"
        }
    }

    private fun active(team: String, user: String) = jdbcTemplate.queryForObject(
        "SELECT active FROM public.team_members WHERE team_id = ?::uuid AND user_id = ?::uuid",
        Boolean::class.java,
        team,
        user,
    )

    private fun role(team: String, user: String) = jdbcTemplate.queryForObject(
        "SELECT role FROM public.team_members WHERE team_id = ?::uuid AND user_id = ?::uuid",
        String::class.java,
        team,
        user,
    )

    private fun remove(caller: String, target: String) =
        perform(MockMvcRequestBuilders.delete("/api/members/$target"), caller)

    private fun update(caller: String, target: String, name: String, role: String) = perform(
        MockMvcRequestBuilders.put("/api/members/$target").contentType(MediaType.APPLICATION_JSON)
            .content("""{"displayName":"$name","role":"$role"}"""),
        caller,
    )

    // The other team's admin belongs to that team only; the demo callers are pinned to the demo schema.
    private fun perform(builder: MockHttpServletRequestBuilder, caller: String): ResultActions {
        val tenant = if (caller == OTHER_ADMIN) OTHER_SCHEMA else DemoPersona.SCHEMA
        return mockMvc.perform(builder.with(loginAs(caller, tenant)))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
    }
}
