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

private const val JAN_USER_ID = "b0000000-0000-0000-0000-000000000002"
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
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team 2', 'test-team-2', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan2@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')
                ON CONFLICT DO NOTHING
            """)

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
                    .header("X-Team-Id", "placeholder")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.role").value("Setter"))

            val changedBy = jdbcTemplate.queryForObject(
                """
                SELECT changed_by FROM public.attendances
                WHERE event_id = (SELECT id FROM public.events WHERE uuid = ?::uuid) AND user_id = ?::uuid
                """.trimIndent(),
                UUID::class.java,
                eventId.toString(),
                JAN_USER_ID,
            )
            changedBy shouldBe UUID.fromString(JAN_USER_ID)
        }

        test("PUT /api/events/{id}/attendances/{userId} records the editor, not the owner, as changedBy") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            val teamId = UUID.randomUUID().toString()
            val ownerId = UUID.randomUUID().toString()
            val editorId = UUID.randomUUID().toString()

            jdbcTemplate.execute("""
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$teamId'::uuid, 'Cross Edit Team', 'cross-edit-team-$teamId', 'Volleyball', 'cross-edit-team-$teamId')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.users (id, email, display_name) VALUES
                    ('$ownerId'::uuid, 'owner-$ownerId@test.com', 'Owner'),
                    ('$editorId'::uuid, 'editor-$editorId@test.com', 'Editor')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.team_members (team_id, user_id, role, team_role) VALUES
                    ('$teamId'::uuid, '$ownerId'::uuid, 'USER', 'Setter'),
                    ('$teamId'::uuid, '$editorId'::uuid, 'ADMIN', 'Libero')
                ON CONFLICT DO NOTHING
            """)

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
                    .header("X-Team-Id", "placeholder")
                    .header("X-User-Id", editorId),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").value(ownerId))

            val changedBy = jdbcTemplate.queryForObject(
                """
                SELECT changed_by FROM public.attendances
                WHERE event_id = (SELECT id FROM public.events WHERE uuid = ?::uuid) AND user_id = ?::uuid
                """.trimIndent(),
                UUID::class.java,
                eventId.toString(),
                ownerId,
            )
            changedBy shouldBe UUID.fromString(editorId)
        }
    }
}
