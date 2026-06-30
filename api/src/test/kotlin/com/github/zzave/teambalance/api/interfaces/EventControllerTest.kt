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
private const val LISA_USER_ID = "b0000000-0000-0000-0000-000000000002"
private const val TOM_USER_ID = "b0000000-0000-0000-0000-000000000003"
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
            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')
                ON CONFLICT DO NOTHING
            """
            )

            val eventId = UUID.randomUUID()

            // Insert an event (event_type 'Training' seeded by V002__seed_event_types.sql)
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Test Match', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """
            )

            // Insert attendance for Jan de Vries (ATTENDING)
            jdbcTemplate.execute(
                """
                INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at)
                VALUES (gen_random_uuid(),
                    (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                    '$JAN_USER_ID'::uuid, 'ATTENDING', now())
            """
            )

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

        test("GET /api/events returns roleBreakdown per event in the list") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'USER', 'Setter')
                ON CONFLICT DO NOTHING
            """
            )

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'List Breakdown Test', '2050-07-01 20:00:00+00', '2050-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at)
                VALUES (gen_random_uuid(),
                    (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                    '$JAN_USER_ID'::uuid, 'ATTENDING', now())
            """
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events?include-past=true")
                    .header("X-Team-Id", "placeholder")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(
                    MockMvcResultMatchers.jsonPath("$.events[?(@.id=='$eventId')].attendanceSummary.roleBreakdown[0].role")
                        .value("Setter")
                )
                .andExpect(
                    MockMvcResultMatchers.jsonPath("$.events[?(@.id=='$eventId')].attendanceSummary.roleBreakdown[0].attending")
                        .value(1)
                )
        }

        test("GET /api/events/{id} attendanceSummary.roleBreakdown contains only ATTENDING members") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            // Jan — Setter, will ATTEND
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'USER', 'Setter')
                ON CONFLICT DO NOTHING
            """
            )
            // Lisa — Libero (as seeded by V002__seed_demo_data.sql), will ATTEND
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$LISA_USER_ID'::uuid, 'lisa@test.com', 'Lisa Bakker')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')
                ON CONFLICT DO NOTHING
            """
            )
            // Tom — Middle (as seeded by V002__seed_demo_data.sql), will be MAYBE (excluded from role breakdown)
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$TOM_USER_ID'::uuid, 'tom@test.com', 'Tom Visser')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$TOM_USER_ID'::uuid, 'USER', 'Middle')
                ON CONFLICT DO NOTHING
            """
            )

            val eventId = java.util.UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Role Breakdown Test', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """
            )

            jdbcTemplate.execute(
                """
                INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at)
                VALUES (gen_random_uuid(),
                    (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                    '$JAN_USER_ID'::uuid, 'ATTENDING', now())
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at)
                VALUES (gen_random_uuid(),
                    (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                    '$LISA_USER_ID'::uuid, 'ATTENDING', now())
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at)
                VALUES (gen_random_uuid(),
                    (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                    '$TOM_USER_ID'::uuid, 'MAYBE', now())
            """
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "placeholder")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                // MAYBE member (Tom) excluded from breakdown; ATTENDING only
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown.length()").value(2))
                // Sorted alphabetically when count is equal (both count=1): Libero before Setter
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[0].role").value("Libero"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[0].attending").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[1].role").value("Setter"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[1].attending").value(1))
        }

        test("GET /api/events/{id} attendanceSummary.roleBreakdown sums members sharing a role and orders by count desc") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            // Member ids unique to this test: integration tests share DB state and seed with
            // ON CONFLICT DO NOTHING, so reusing the shared ids would keep roles set by other tests.
            val setterAId = "b0000000-0000-0000-0000-0000000000a1"
            val setterBId = "b0000000-0000-0000-0000-0000000000a2"
            val liberoId = "b0000000-0000-0000-0000-0000000000a3"

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            // Two Setters (must be summed into one entry of 2) + one Libero (single).
            listOf(
                Triple(setterAId, "setter-a@test.com", "Setter"),
                Triple(setterBId, "setter-b@test.com", "Setter"),
                Triple(liberoId, "libero@test.com", "Libero"),
            ).forEach { (userId, email, role) ->
                jdbcTemplate.execute(
                    """
                    INSERT INTO public.users (id, email, display_name)
                    VALUES ('$userId'::uuid, '$email', '$email')
                    ON CONFLICT DO NOTHING
                """
                )
                jdbcTemplate.execute(
                    """
                    INSERT INTO public.team_members (team_id, user_id, role, team_role)
                    VALUES ('$TEAM_ID'::uuid, '$userId'::uuid, 'USER', '$role')
                    ON CONFLICT DO NOTHING
                """
                )
            }

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Shared Role Test', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$setterAId'::uuid, now(), now())
            """
            )
            listOf(setterAId, setterBId, liberoId).forEach { userId ->
                jdbcTemplate.execute(
                    """
                    INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at)
                    VALUES (gen_random_uuid(),
                        (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                        '$userId'::uuid, 'ATTENDING', now())
                """
                )
            }

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "placeholder")
                    .header("X-User-Id", setterAId),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown.length()").value(2))
                // Two Setters summed into one entry of 2, ordered before the single Libero (count desc)
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[0].role").value("Setter"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[0].attending").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[1].role").value("Libero"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[1].attending").value(1))
        }

        test("GET /api/events/{id} with no attendances returns an empty roleBreakdown and zeroed counts") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'USER', 'Setter')
                ON CONFLICT DO NOTHING
            """
            )

            // Event with NO attendances at all.
            val eventId = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'No Responses Test', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "placeholder")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown.length()").value(0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.attending").value(0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.maybe").value(0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.absent").value(0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.notResponded").value(0))
        }
    }
}
