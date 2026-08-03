package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

// A dedicated id (NOT a demo-seed user) so this user belongs only to this spec's team — the member
// lookup for attendance assumes one team per user, so reusing a demo user would resolve their position
// ambiguously across two teams.
private const val JAN_USER_ID = "b0000000-0000-0000-0000-0000000000b2"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000002"

@AutoConfigureMockMvc
class AttendanceControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        test("PUT /api/events/{id}/attendances/{userId} returns role in response") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute("""
                INSERT INTO public.teams (id, name, slug, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team 2', 'test-team-2', 'public')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan2@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')",
            )

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute("""
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Test Match', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """)

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.put("/api/events/$eventId/attendances/$JAN_USER_ID")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"state":"ATTENDING"}""")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.role").value("Setter"))

            queryChangedBy(eventId, JAN_USER_ID) shouldBe UUID.fromString(JAN_USER_ID)
        }

        test("PUT twice updates the existing attendance row instead of duplicating it") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute("""
                INSERT INTO public.teams (id, name, slug, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team 2', 'test-team-2', 'public')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan2@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')",
            )

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute("""
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Toggle Twice', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """)

            putAttendance(eventId, "ATTENDING")
            putAttendance(eventId, "MAYBE")

            val rows = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.attendances a JOIN public.events e ON e.id = a.event_id " +
                    "WHERE e.uuid = '$eventId'::uuid AND a.user_id = '$JAN_USER_ID'::uuid",
                Int::class.java,
            )
            rows shouldBe 1

            val state = jdbcTemplate.queryForObject(
                "SELECT a.state FROM public.attendances a JOIN public.events e ON e.id = a.event_id " +
                    "WHERE e.uuid = '$eventId'::uuid AND a.user_id = '$JAN_USER_ID'::uuid",
                String::class.java,
            )
            state shouldBe "MAYBE"
        }

        test("PUT /api/events/{id}/attendances/{userId} records the editor, not the owner, as changedBy") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            val teamId = UUID.randomUUID().toString()
            val ownerId = UUID.randomUUID().toString()
            val editorId = UUID.randomUUID().toString()

            jdbcTemplate.execute("""
                INSERT INTO public.teams (id, name, slug, schema_name)
                VALUES ('$teamId'::uuid, 'Cross Edit Team', 'cross-edit-team-$teamId', 'cross-edit-team-$teamId')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.users (id, email, display_name) VALUES
                    ('$ownerId'::uuid, 'owner-$ownerId@test.com', 'Owner'),
                    ('$editorId'::uuid, 'editor-$editorId@test.com', 'Editor')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("SELECT public.tb_add_member('$teamId'::uuid, '$ownerId'::uuid, 'USER', 'Setter')")
            jdbcTemplate.execute("SELECT public.tb_add_member('$teamId'::uuid, '$editorId'::uuid, 'ADMIN', 'Libero')")

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute("""
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Cross Edit Match', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$editorId'::uuid, now(), now())
            """)

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.put("/api/events/$eventId/attendances/$ownerId")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"state":"ATTENDING"}""")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", editorId),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").value(ownerId))

            queryChangedBy(eventId, ownerId) shouldBe UUID.fromString(editorId)
        }
    }

    private fun putAttendance(eventId: UUID, state: String) {
        val started = mockMvc.perform(
            MockMvcRequestBuilders.put("/api/events/$eventId/attendances/$JAN_USER_ID")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"state":"$state"}""")
                .header("X-Team-Id", "public")
                .header("X-User-Id", JAN_USER_ID),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
        mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    private fun queryChangedBy(eventId: UUID, userId: String): UUID? =
        jdbcTemplate.queryForObject(
            """
            SELECT changed_by FROM public.attendances
            WHERE event_id = (SELECT id FROM public.events WHERE uuid = ?::uuid)
            AND user_id = ?::uuid
            """.trimIndent(),
            UUID::class.java,
            eventId.toString(),
            userId,
        )
}
