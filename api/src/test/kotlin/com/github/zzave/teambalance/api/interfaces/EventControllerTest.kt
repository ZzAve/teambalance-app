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

private const val JAN_USER_ID = "b0000000-0000-0000-0000-000000000001"
private const val LISA_USER_ID = "b0000000-0000-0000-0000-000000000002"
private const val TOM_USER_ID = "b0000000-0000-0000-0000-000000000003"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

// A Kotest FunSpec accumulates every `test { }` into the one class body, so this integration suite
// trips the LargeClass heuristic as event scenarios grow. Splitting it is a separate concern.
@Suppress("LargeClass")
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')"
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
            insertAttendance(eventId, JAN_USER_ID)

            // Call the API — X-Team-Id is required by TenantFilter
            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                // The roster is the whole team, so match Jan by id rather than assuming position 0.
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendances[?(@.userId=='$JAN_USER_ID')].role").value("Setter"))
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'USER', 'Setter')"
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
            insertAttendance(eventId, JAN_USER_ID)

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events?include-past=true")
                    .header("X-Team-Id", "public")
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'USER', 'Setter')"
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')"
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$TOM_USER_ID'::uuid, 'USER', 'Middle')"
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

            insertAttendance(eventId, JAN_USER_ID)
            insertAttendance(eventId, LISA_USER_ID)
            insertAttendance(eventId, TOM_USER_ID, "MAYBE")

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "public")
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
                    "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, 'USER', '$role')"
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
                insertAttendance(eventId, userId)
            }

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "public")
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

        test("GET /api/events/{id} with no responses counts every current member as not-responded") {
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'USER', 'Setter')"
            )

            // Event with NO attendance rows at all.
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

            // With no responses, every current member is not-responded — a count derived from team
            // membership, not from pre-created rows (which is why a row-less event is not "0 of nobody").
            val memberCount = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid AND active = true",
                Long::class.java,
            )!!.toInt()

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "public")
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
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.notResponded").value(memberCount))
        }

        test("POST /api/events creates no attendance rows yet reports every member as not-responded") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            // teams.schema_name is UNIQUE, so this suite's tests all share the single 'public'-schema
            // team ($TEAM_ID) — inserts are idempotent (ON CONFLICT DO NOTHING) across tests.
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')"
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$LISA_USER_ID'::uuid, 'lisa@test.com', 'Lisa Bakker')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')"
            )
            val memberCount = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid AND active = true",
                Long::class.java,
            )!!.toInt()

            val eventTypeId = jdbcTemplate.queryForObject(
                "SELECT uuid FROM public.event_types WHERE name = 'Training'",
                UUID::class.java,
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "Created via API",
                          "description": null,
                          "startTime": "2026-08-01T20:00:00Z",
                          "endTime": "2026-08-01T22:00:00Z",
                          "location": null
                        }
                        """.trimIndent()
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isCreated)
                // Every active member of the real team (resolved via team_members, not a hardcoded
                // id) is reported NOT_RESPONDED on a freshly created event — derived from membership.
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.notResponded").value(memberCount))

            // …and that count is derived, not seeded: creating the event writes no attendance rows.
            val attendanceRows = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.attendances WHERE event_id IN (SELECT id FROM public.events WHERE title = 'Created via API')",
                Long::class.java,
            )
            attendanceRows shouldBe 0L
        }

        test("POST /api/events by a user with no team membership is rejected, not silently defaulted") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            val teamlessUserId = "b0000000-0000-0000-0000-0000000000ff"
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$teamlessUserId'::uuid, 'teamless@test.com', 'Teamless User')
                ON CONFLICT DO NOTHING
            """
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", teamlessUserId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "00000000-0000-0000-0000-000000000000",
                          "title": "Should not be created",
                          "description": null,
                          "startTime": "2026-08-01T20:00:00Z",
                          "endTime": "2026-08-01T22:00:00Z",
                          "location": null
                        }
                        """.trimIndent()
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("POST /api/events by a non-admin team member is rejected with 403") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            // Lisa is a plain USER (non-admin) member of the team — seeded by other tests too,
            // but re-asserting the role here keeps this test independent of ordering.
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$LISA_USER_ID'::uuid, 'lisa@test.com', 'Lisa Bakker')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')"
            )

            val eventTypeId = jdbcTemplate.queryForObject(
                "SELECT uuid FROM public.event_types WHERE name = 'Training'",
                UUID::class.java,
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", LISA_USER_ID)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "Should not be created",
                          "description": null,
                          "startTime": "2026-08-01T20:00:00Z",
                          "endTime": "2026-08-01T22:00:00Z",
                          "location": null
                        }
                        """.trimIndent()
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("PUT /api/events/{id} by an admin succeeds") {
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')"
            )

            val eventTypeId = jdbcTemplate.queryForObject(
                "SELECT uuid FROM public.event_types WHERE name = 'Training'",
                UUID::class.java,
            )

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Original Title', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.put("/api/events/$eventId")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "Updated by admin",
                          "description": null,
                          "startTime": "2026-08-01T20:00:00Z",
                          "endTime": "2026-08-01T22:00:00Z",
                          "location": null
                        }
                        """.trimIndent()
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                // UpdateEvent now returns an EventList of affected occurrences (ADR-0014 Phase 3).
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].title").value("Updated by admin"))
        }

        test("DELETE /api/events/{id} by an admin succeeds") {
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')"
            )

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'To Be Deleted', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.delete("/api/events/$eventId")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            val remaining = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.events WHERE uuid = '$eventId'::uuid",
                Long::class.java,
            )
            remaining shouldBe 0L
        }

        test("GET /api/events/{id} roleBreakdown groups a member with no position under 'Unassigned'") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            // A member deliberately given NO position (null label) — should land in the Unassigned bucket.
            val noPositionUserId = "b0000000-0000-0000-0000-0000000000c1"
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
                VALUES ('$noPositionUserId'::uuid, 'nopos@test.com', 'No Position')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$noPositionUserId'::uuid, 'USER', NULL)"
            )

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    'Unassigned Bucket Test', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$noPositionUserId'::uuid, now(), now())
            """
            )
            insertAttendance(eventId, noPositionUserId)

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", noPositionUserId),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendances[?(@.userId=='$noPositionUserId')].role").value("Unassigned"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[0].role").value("Unassigned"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.attendanceSummary.roleBreakdown[0].attending").value(1))
        }

        test("POST /api/events with a missing required field returns 400, not a raw 500") {
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
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')"
            )

            val eventTypeId = jdbcTemplate.queryForObject(
                "SELECT uuid FROM public.event_types WHERE name = 'Training'",
                UUID::class.java,
            )

            // endTime is required by the contract but omitted here — a malformed request must be a
            // client error (400), never surface as an unhandled deserialization crash (500).
            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "No end time",
                          "description": null,
                          "startTime": "2026-08-01T20:00:00Z",
                          "location": null
                        }
                        """.trimIndent()
                    ),
            ).andReturn()

            // The failure may surface synchronously (arg resolution) or via async dispatch depending
            // on where Wirespec deserializes the body — handle both so the test asserts status, not timing.
            val status = if (mvcResult.request.isAsyncStarted) {
                mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult)).andReturn().response.status
            } else {
                mvcResult.response.status
            }

            status shouldBe 400
        }
    }

    private fun insertAttendance(eventId: UUID, userId: String, state: String = "ATTENDING") {
        jdbcTemplate.execute(
            """
            INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at, changed_by)
            VALUES (gen_random_uuid(),
                (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                '$userId'::uuid, '$state', now(), '$userId'::uuid)
        """
        )
    }
}
