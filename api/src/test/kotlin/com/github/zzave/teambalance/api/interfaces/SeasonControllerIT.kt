package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

private const val ADMIN_USER_ID = "b0000000-0000-0000-0000-0000000000e1"
private const val MEMBER_USER_ID = "b0000000-0000-0000-0000-0000000000e2"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

/**
 * Covers the season foundation (ADR-0014, Phase 1): the GET/PUT season endpoints (round-trip,
 * clear, admin gating) and the season-bound validation matrix wired into the single-event
 * create/update path.
 *
 * All tests share the single 'public' tenant schema (see EventControllerTest), so each one that
 * touches the season sets it explicitly and resets it to unset in a finally — otherwise a leaked
 * window would spuriously reject other suites' event creates.
 */
@AutoConfigureMockMvc
class SeasonControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        test("GET /api/team/season returns null bounds when no season is configured") {
            seedTeamAndAdmin()
            resetSeason()

            perform(MockMvcRequestBuilders.get("/api/team/season"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.start").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.end").doesNotExist())
        }

        test("PUT /api/team/season by an admin sets the window and GET round-trips it") {
            seedTeamAndAdmin()
            try {
                perform(
                    MockMvcRequestBuilders.put("/api/team/season")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""{ "start": "2026-09-01", "end": "2027-04-30" }"""),
                    ADMIN_USER_ID,
                )
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.start").value("2026-09-01"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.end").value("2027-04-30"))

                perform(MockMvcRequestBuilders.get("/api/team/season"), ADMIN_USER_ID)
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.start").value("2026-09-01"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.end").value("2027-04-30"))
            } finally {
                resetSeason()
            }
        }

        test("PUT /api/team/season with null bounds clears the window") {
            seedTeamAndAdmin()
            setSeason("2026-09-01", "2027-04-30")
            try {
                perform(
                    MockMvcRequestBuilders.put("/api/team/season")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""{ "start": null, "end": null }"""),
                    ADMIN_USER_ID,
                )
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.start").doesNotExist())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.end").doesNotExist())
            } finally {
                resetSeason()
            }
        }

        test("PUT /api/team/season by a non-admin member is rejected with 403") {
            seedTeamAndAdmin()
            seedMember(MEMBER_USER_ID, "member@test.com", role = "USER")
            try {
                perform(
                    MockMvcRequestBuilders.put("/api/team/season")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""{ "start": "2026-09-01", "end": "2027-04-30" }"""),
                    MEMBER_USER_ID,
                )
                    .andExpect(MockMvcResultMatchers.status().isForbidden)
            } finally {
                resetSeason()
            }
        }

        test("POST /api/events with a start outside the season is rejected with 422") {
            seedTeamAndAdmin()
            setSeason("2026-09-01", "2027-04-30")
            try {
                perform(createEventJson(start = "2026-08-01T18:00:00Z"), ADMIN_USER_ID)
                    .andExpect(MockMvcResultMatchers.status().isUnprocessableContent)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("EVENT_OUTSIDE_SEASON"))
            } finally {
                resetSeason()
            }
        }

        test("POST /api/events with a start inside the season succeeds") {
            seedTeamAndAdmin()
            setSeason("2026-09-01", "2027-04-30")
            try {
                perform(createEventJson(start = "2026-10-01T18:00:00Z"), ADMIN_USER_ID)
                    .andExpect(MockMvcResultMatchers.status().isCreated)
            } finally {
                resetSeason()
            }
        }

        test("PUT /api/events grandfathers an unchanged out-of-window start") {
            seedTeamAndAdmin()
            // Event created (via SQL) before the window; the window is then set to exclude it.
            val eventId = insertEvent(start = "2026-08-01 18:00:00+00")
            setSeason("2026-09-01", "2027-04-30")
            try {
                // Same startTime as stored => start not moved => grandfathered, edit allowed.
                perform(
                    MockMvcRequestBuilders.put("/api/events/$eventId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateEventBody(title = "Renamed but same date", start = "2026-08-01T18:00:00Z")),
                    ADMIN_USER_ID,
                )
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    // UpdateEvent now returns an EventList of affected occurrences (ADR-0014 Phase 3).
                    .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].title").value("Renamed but same date"))
            } finally {
                resetSeason()
            }
        }

        test("PUT /api/events rejects a start newly moved outside the season with 422") {
            seedTeamAndAdmin()
            // Event starts inside the window; moving it out must be rejected.
            val eventId = insertEvent(start = "2026-10-01 18:00:00+00")
            setSeason("2026-09-01", "2027-04-30")
            try {
                perform(
                    MockMvcRequestBuilders.put("/api/events/$eventId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateEventBody(title = "Moved out", start = "2026-08-01T18:00:00Z")),
                    ADMIN_USER_ID,
                )
                    .andExpect(MockMvcResultMatchers.status().isUnprocessableContent)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("EVENT_OUTSIDE_SEASON"))
            } finally {
                resetSeason()
            }
        }

        test("POST /api/events with no season configured accepts any start") {
            seedTeamAndAdmin()
            resetSeason()

            perform(createEventJson(start = "2020-01-01T18:00:00Z"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isCreated)
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun perform(builder: org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder, userId: String) =
        mockMvc.perform(builder.header("X-Team-Id", "public").header("X-User-Id", userId))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun createEventJson(start: String): org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder {
        val eventTypeId = trainingTypeId()
        return MockMvcRequestBuilders.post("/api/events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(
                """
                {
                  "eventTypeId": "$eventTypeId",
                  "title": "Season check",
                  "description": null,
                  "startTime": "$start",
                  "endTime": "2027-05-01T20:00:00Z",
                  "location": null
                }
                """.trimIndent(),
            )
    }

    private fun updateEventBody(title: String, start: String): String {
        val eventTypeId = trainingTypeId()
        return """
            {
              "eventTypeId": "$eventTypeId",
              "title": "$title",
              "description": null,
              "startTime": "$start",
              "endTime": "2027-05-01T20:00:00Z",
              "location": null
            }
        """.trimIndent()
    }

    private fun trainingTypeId(): UUID =
        jdbcTemplate.queryForObject("SELECT uuid FROM public.event_types WHERE name = 'Training'", UUID::class.java)!!

    private fun insertEvent(start: String): UUID {
        val eventId = UUID.randomUUID()
        jdbcTemplate.execute(
            """
            INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
            VALUES ('$eventId'::uuid,
                (SELECT id FROM public.event_types WHERE name = 'Training'),
                'Seeded Event', '$start', '2027-05-01 20:00:00+00',
                '$ADMIN_USER_ID'::uuid, now(), now())
            """,
        )
        return eventId
    }

    private fun setSeason(start: String?, end: String?) {
        jdbcTemplate.update(
            "UPDATE public.team_settings SET season_start = ?::date, season_end = ?::date WHERE id = 1",
            start,
            end,
        )
    }

    private fun resetSeason() = setSeason(null, null)

    private fun seedTeamAndAdmin() {
        tenantSchemaManager.provisionPlatformSchema()
        tenantSchemaManager.provisionTenantSchema("public")
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public')
            ON CONFLICT DO NOTHING
            """,
        )
        seedMember(ADMIN_USER_ID, "season-admin@test.com", role = "ADMIN")
    }

    private fun seedMember(userId: String, email: String, role: String) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$userId'::uuid, '$email', '$email')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute(
            "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, '$role', 'Setter')",
        )
    }
}
