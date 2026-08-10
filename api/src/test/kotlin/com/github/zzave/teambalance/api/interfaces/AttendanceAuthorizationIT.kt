package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

/**
 * Attendance editing is trust-based *within a team* (ADR-0003): any member may edit another member's
 * attendance. That trust stops at the team boundary — a caller must not be able to write attendance
 * for a `userId` that is not a member of their resolved team. This is the membership/tenant gate that
 * was previously missing on the write path (the tenant schema alone did not scope the target user).
 *
 * Following AttendanceControllerTest's cross-team pattern: teams carry unique schema names, the
 * caller's resolved team id comes from their own membership, while the event lives in the
 * `public`-pinned schema (the X-Team-Id test shim), so only the *target user's* membership is in play.
 */
@AutoConfigureMockMvc
class AttendanceAuthorizationIT : TeamBalanceIT() {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var jdbcTemplate: JdbcTemplate
    @Autowired lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("setAttendance for a user outside the caller's team is rejected with 403") {
            tenantSchemaAdapter.provisionPlatformSchema()
            tenantSchemaAdapter.provisionTenantSchema("public")

            // The caller is an ordinary member of their own team.
            val callerTeamId = UUID.randomUUID()
            val callerId = newTeamMember(callerTeamId, "caller@test.com", "Cara Caller")

            // The outsider belongs to a *different* team — not the caller's.
            val otherTeamId = UUID.randomUUID()
            val outsiderId = newTeamMember(otherTeamId, "outsider@test.com", "Otto Outsider")

            // A real event in the caller's tenant, so only the target-user membership is in question.
            val eventId = insertEvent(callerId)

            val result = mockMvc.perform(
                MockMvcRequestBuilders.put("/api/events/$eventId/attendances/$outsiderId")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"state":"ATTENDING"}""")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", callerId),
            ).andExpect(MockMvcResultMatchers.request().asyncStarted()).andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("NO_TEAM_MEMBERSHIP"))

            // And nothing was written for the outsider.
            attendanceRowCount(eventId, outsiderId) shouldBe 0
        }

        test("setAttendance for a fellow team member still succeeds (trust-based editing, ADR-0003)") {
            tenantSchemaAdapter.provisionPlatformSchema()
            tenantSchemaAdapter.provisionTenantSchema("public")

            val teamId = UUID.randomUUID()
            val callerId = newTeamMember(teamId, "editor2@test.com", "Ed Editor")
            val teammateId = joinTeam(teamId, "mate2@test.com", "Tina Teammate")

            val eventId = insertEvent(callerId)

            val result = mockMvc.perform(
                MockMvcRequestBuilders.put("/api/events/$eventId/attendances/$teammateId")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"state":"ATTENDING"}""")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", callerId),
            ).andExpect(MockMvcResultMatchers.request().asyncStarted()).andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
                .andExpect(MockMvcResultMatchers.status().isOk)

            attendanceRowCount(eventId, teammateId) shouldBe 1
        }
    }

    // Creates a team (with a unique schema mapping) and joins a brand-new USER to it.
    private fun newTeamMember(teamId: UUID, email: String, name: String): String {
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$teamId'::uuid, 'Team $teamId', 'authz-$teamId', 'authz-$teamId')
            ON CONFLICT DO NOTHING
            """,
        )
        return joinTeam(teamId, email, name)
    }

    private fun joinTeam(teamId: UUID, email: String, name: String): String {
        val userId = UUID.randomUUID().toString()
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) VALUES ('$userId'::uuid, '$email', '$name') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$teamId'::uuid, '$userId'::uuid, 'USER', 'Setter')")
        return userId
    }

    private fun insertEvent(createdBy: String): UUID {
        val eventId = UUID.randomUUID()
        jdbcTemplate.execute(
            """
            INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
            VALUES ('$eventId'::uuid,
                (SELECT id FROM public.event_types WHERE name = 'Training'),
                'Authz Test', '2050-07-01 20:00:00+00', '2050-07-01 22:00:00+00',
                '$createdBy'::uuid, now(), now())
            """,
        )
        return eventId
    }

    private fun attendanceRowCount(eventId: UUID, userId: String): Int =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.attendances a JOIN public.events e ON e.id = a.event_id " +
                "WHERE e.uuid = '$eventId'::uuid AND a.user_id = '$userId'::uuid",
            Long::class.java,
        )!!.toInt()
}
