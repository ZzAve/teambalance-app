package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

/**
 * Reset Attendance: an admin clears every member's answer on one event, so each member reads as
 * NOT_RESPONDED again. Follows BulkAttendIT's setup: the caller's team id comes from their own
 * membership while the events live in the `public`-pinned schema.
 */
@AutoConfigureMockMvc
class ResetAttendanceIT : TeamBalanceIT() {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var jdbcTemplate: JdbcTemplate
    @Autowired lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("an admin reset deletes every answer on that event and leaves other events alone") {
            provision()
            val teamId = UUID.randomUUID()
            val admin = newTeam(teamId, "reset-admin@test.com", "Ada Admin", role = "ADMIN")
            val member = joinTeam(teamId, "reset-member@test.com", "Max Member", role = "USER")
            val event = insertEvent(admin)
            val otherEvent = insertEvent(admin)
            insertAttendance(event, admin, "ATTENDING")
            insertAttendance(event, member, "ABSENT")
            insertAttendance(otherEvent, member, "MAYBE")

            reset(admin, event).andExpect(MockMvcResultMatchers.status().isNoContent)

            rowCount(event) shouldBe 0
            rowCount(otherEvent) shouldBe 1
        }

        test("a member who is not an admin is rejected with 403 and nothing is deleted") {
            provision()
            val teamId = UUID.randomUUID()
            val admin = newTeam(teamId, "reset-owner@test.com", "Olga Owner", role = "ADMIN")
            val member = joinTeam(teamId, "reset-user@test.com", "Uma User", role = "USER")
            val event = insertEvent(admin)
            insertAttendance(event, member, "ATTENDING")

            reset(member, event)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("NOT_TEAM_ADMIN"))

            rowCount(event) shouldBe 1
        }

        test("an unknown event answers 404") {
            provision()
            val admin = newTeam(UUID.randomUUID(), "reset-404@test.com", "Nina Nobody", role = "ADMIN")

            reset(admin, UUID.randomUUID()).andExpect(MockMvcResultMatchers.status().isNotFound)
        }
    }

    private fun reset(caller: String, eventId: UUID): ResultActions {
        val result = mockMvc.perform(
            MockMvcRequestBuilders.delete("/api/events/$eventId/attendances")
                .with(loginAs(caller, tenant = "public")),
        ).andExpect(MockMvcResultMatchers.request().asyncStarted()).andReturn()
        return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
    }

    private fun provision() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
    }

    private fun newTeam(teamId: UUID, email: String, name: String, role: String): String {
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$teamId'::uuid, 'Team $teamId', 'reset-$teamId', 'reset-$teamId')
            ON CONFLICT DO NOTHING
            """,
        )
        return joinTeam(teamId, email, name, role)
    }

    private fun joinTeam(teamId: UUID, email: String, name: String, role: String): String {
        val userId = UUID.randomUUID().toString()
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) VALUES ('$userId'::uuid, '$email', '$name') " +
                "ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$teamId'::uuid, '$userId'::uuid, '$role', 'Setter')")
        return userId
    }

    private fun insertEvent(createdBy: String): UUID {
        val eventId = UUID.randomUUID()
        jdbcTemplate.execute(
            """
            INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
            VALUES ('$eventId'::uuid,
                (SELECT id FROM public.event_types WHERE name = 'Training'),
                'Reset Test', '$FUTURE', '$FUTURE', '$createdBy'::uuid, now(), now())
            """,
        )
        return eventId
    }

    private fun insertAttendance(eventId: UUID, userId: String, state: String) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at, changed_by)
            VALUES (gen_random_uuid(),
                (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                '$userId'::uuid, '$state', now(), '$userId'::uuid)
            """,
        )
    }

    private fun rowCount(eventId: UUID): Int =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.attendances a JOIN public.events e ON e.id = a.event_id " +
                "WHERE e.uuid = '$eventId'::uuid",
            Long::class.java,
        )!!.toInt()

    private companion object {
        const val FUTURE = "2050-07-01 20:00:00+00"
    }
}
