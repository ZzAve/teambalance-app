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

private const val JAN_USER_ID = "b0000000-0000-0000-0000-000000000001"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

@AutoConfigureMockMvc
class EventControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        test("GET /api/events/{id} returns role for each attendee") {
            // Ensure platform schema (users, team_members) and tenant schema (events, attendances) exist.
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            // Seed the minimal platform data this test needs.
            jdbcTemplate.execute("""
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """)
            jdbcTemplate.execute("""
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')
                ON CONFLICT DO NOTHING
            """)

            val eventId = UUID.randomUUID()

            // Insert an event (event_type 'Training' seeded by V002__seed_event_types.sql)
            jdbcTemplate.execute("""
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Test Match', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """)

            // Insert attendance for Jan de Vries (ATTENDING)
            jdbcTemplate.execute("""
                INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at)
                VALUES (gen_random_uuid(),
                    (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                    '$JAN_USER_ID'::uuid, 'ATTENDING', now())
            """)

            // Call the API — X-Team-Id is required by TenantFilter
            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "placeholder")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendances[0].role").value("Setter"))
        }
    }
}
