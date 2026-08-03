package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

/**
 * The attendance summary/roster must reflect *current team membership*, not the set of attendance
 * rows that happened to be created when the event was made. Two failure modes this guards:
 *  - a member who joins AFTER an event exists (no pre-created row) must still count as not-responded
 *    and appear in the roster;
 *  - a member who is removed must drop out of the counts even if they had responded.
 * These tests share the suite's single `public`-schema team, so they assert against a dynamically
 * queried member count rather than hardcoded totals.
 */
@AutoConfigureMockMvc
class AttendanceMembershipIT : TeamBalanceIT() {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var jdbcTemplate: JdbcTemplate
    @Autowired lateinit var tenantSchemaManager: TenantSchemaManager

    private val teamId = "a0000000-0000-0000-0000-000000000001"

    init {
        test("a member who joins after an event exists is counted as not-responded and listed in the roster") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")
            seedTeam()
            val admin = addMember("late-admin@test.com", "Late Admin", "ADMIN", "Setter")

            // Event created while only the current members exist (no row for anyone who joins later).
            val eventId = insertEvent(admin)

            // A brand-new member joins AFTER the event was created.
            val latecomer = addMember("latecomer@test.com", "Nora Newbie", "USER", "Libero")

            val expectedNotResponded = activeMemberCount()

            val result = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", admin),
            ).andExpect(MockMvcResultMatchers.request().asyncStarted()).andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
                .andExpect(MockMvcResultMatchers.status().isOk)
                // Everyone currently on the team is not-responded — including the latecomer.
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.notResponded").value(expectedNotResponded))
                // The latecomer appears in the roster despite having no pre-created attendance row.
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendances[?(@.userId=='$latecomer')].state").value("NOT_RESPONDED"))
        }

        test("a removed member no longer counts toward attendance even if they had responded") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")
            seedTeam()
            val admin = addMember("rm-admin@test.com", "Rm Admin", "ADMIN", "Setter")
            val leaver = addMember("leaver@test.com", "Ben Leaver", "USER", "Middle")

            val eventId = insertEvent(admin)
            insertAttendance(eventId, leaver, "ATTENDING")

            // The member leaves the team (deactivated).
            jdbcTemplate.execute("UPDATE public.team_members SET active = false WHERE user_id = '$leaver'::uuid")

            val result = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", admin),
            ).andExpect(MockMvcResultMatchers.request().asyncStarted()).andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
                .andExpect(MockMvcResultMatchers.status().isOk)
                // The ex-member's stale ATTENDING response must not be counted.
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.attending").value(0))
                // …nor should they appear in the roster.
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendances[?(@.userId=='$leaver')]").doesNotExist())
        }
    }

    private fun seedTeam() {
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$teamId'::uuid, 'Test Team', 'test-team', 'public')
            ON CONFLICT DO NOTHING
            """,
        )
    }

    private fun addMember(email: String, name: String, role: String, position: String): String {
        val userId = UUID.randomUUID().toString()
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) VALUES ('$userId'::uuid, '$email', '$name') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$teamId'::uuid, '$userId'::uuid, '$role', '$position')")
        return userId
    }

    private fun insertEvent(createdBy: String): UUID {
        val eventId = UUID.randomUUID()
        jdbcTemplate.execute(
            """
            INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
            VALUES ('$eventId'::uuid,
                (SELECT id FROM public.event_types WHERE name = 'Training'),
                'Membership Test', '2050-07-01 20:00:00+00', '2050-07-01 22:00:00+00',
                '$createdBy'::uuid, now(), now())
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

    private fun activeMemberCount(): Int =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.team_members WHERE team_id = '$teamId'::uuid AND active = true",
            Long::class.java,
        )!!.toInt()
}
