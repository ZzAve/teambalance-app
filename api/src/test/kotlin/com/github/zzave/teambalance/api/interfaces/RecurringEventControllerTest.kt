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

private const val JAN_USER_ID = "b0000000-0000-0000-0000-000000000001"
private const val LISA_USER_ID = "b0000000-0000-0000-0000-000000000002"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

/**
 * Batch creation of a recurring series (ADR-0014, Phase 2). Proves N concrete rows share one
 * recurring_group, the shared links fan out to every occurrence, the roster is derived at read time
 * (no seeded attendance), season bounds every generated start, and the endpoint is admin-only — the
 * seams that a pure generation unit test cannot reach.
 */
@AutoConfigureMockMvc
class RecurringEventControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("POST /api/recurring-events materializes N rows sharing one group, roster derived at read time") {
            seedTeam()
            val admin = seedAdmin()
            seedMember(LISA_USER_ID, "lisa-rec@test.com", "Lisa Bakker")
            clearSeason()
            val memberCount = activeMemberCount()
            val eventTypeId = trainingTypeId()

            // WEEKLY Tue + Thu, 2026-09-01 (Tue) → 2026-09-10 (Thu): Tue 01, Thu 03, Tue 08, Thu 10 = 4.
            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/recurring-events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", admin)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "Weekly Training",
                          "description": null,
                          "location": "Gym",
                          "timeOfDay": "20:30",
                          "durationMinutes": 90,
                          "references": [{"title": "Nevobo", "url": "https://nevobo.nl"}],
                          "recurrence": {
                            "frequency": "WEEKLY",
                            "weekdays": ["TUESDAY", "THURSDAY"],
                            "startDate": "2026-09-01",
                            "endDate": "2026-09-10"
                          }
                        }
                        """.trimIndent(),
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.recurringGroup").isNotEmpty)
                .andExpect(MockMvcResultMatchers.jsonPath("$.events.length()").value(4))
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].title").value("Weekly Training"))
                // The one shared link fans out to every occurrence.
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].references[0].url").value("https://nevobo.nl"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[3].references[0].url").value("https://nevobo.nl"))
                // Attendance is derived from current membership at read time (#114): no rows are
                // seeded, yet every occurrence reports the full roster as not-responded.
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].attendanceSummary.notResponded").value(memberCount))
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].attendanceSummary.attending").value(0))

            // Exactly one shared group across all four rows.
            val groups = jdbcTemplate.queryForList(
                "SELECT DISTINCT recurring_group FROM public.events WHERE title = 'Weekly Training'",
                UUID::class.java,
            )
            groups.size shouldBe 1
            val group = groups.single()

            val rowCount = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.events WHERE recurring_group = ?",
                Long::class.java,
                group,
            )
            rowCount shouldBe 4L

            // No attendance rows are materialized — the roster is derived at read time.
            val attendanceCount = jdbcTemplate.queryForObject(
                """
                SELECT count(*) FROM public.attendances a
                JOIN public.events e ON e.id = a.event_id
                WHERE e.recurring_group = ?
                """.trimIndent(),
                Long::class.java,
                group,
            )
            attendanceCount shouldBe 0L
        }

        test("POST /api/recurring-events rejects the whole batch when any generated start falls outside the season") {
            seedTeam()
            val admin = seedAdmin()
            // Season ends 2026-09-05; a range to 2026-09-10 generates starts past the window.
            setSeason("2026-09-01", "2026-09-05")
            val eventTypeId = trainingTypeId()
            val before = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.events WHERE title = 'Out Of Season Series'",
                Long::class.java,
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/recurring-events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", admin)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "Out Of Season Series",
                          "description": null,
                          "location": null,
                          "timeOfDay": "20:30",
                          "durationMinutes": 90,
                          "references": [],
                          "recurrence": {
                            "frequency": "WEEKLY",
                            "weekdays": ["TUESDAY", "THURSDAY"],
                            "startDate": "2026-09-01",
                            "endDate": "2026-09-10"
                          }
                        }
                        """.trimIndent(),
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isUnprocessableEntity)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("EVENT_OUTSIDE_SEASON"))

            // Nothing was written — the batch is all-or-nothing.
            val after = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.events WHERE title = 'Out Of Season Series'",
                Long::class.java,
            )
            after shouldBe before
            clearSeason()
        }

        test("POST /api/recurring-events by a non-admin member is rejected with 403") {
            seedTeam()
            seedAdmin()
            seedMember(LISA_USER_ID, "lisa-rec@test.com", "Lisa Bakker")
            clearSeason()
            val eventTypeId = trainingTypeId()

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/recurring-events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", LISA_USER_ID)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "Should Not Exist",
                          "description": null,
                          "location": null,
                          "timeOfDay": "20:30",
                          "durationMinutes": 90,
                          "references": [],
                          "recurrence": {
                            "frequency": "WEEKLY",
                            "weekdays": ["TUESDAY"],
                            "startDate": "2026-09-01",
                            "endDate": "2026-09-08"
                          }
                        }
                        """.trimIndent(),
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }
    }

    private fun seedTeam() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public')
            ON CONFLICT DO NOTHING
            """.trimIndent(),
        )
    }

    private fun seedAdmin(): String {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$JAN_USER_ID'::uuid, 'jan-rec@test.com', 'Jan de Vries')
            ON CONFLICT DO NOTHING
            """.trimIndent(),
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')")
        return JAN_USER_ID
    }

    private fun seedMember(userId: String, email: String, name: String) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$userId'::uuid, '$email', '$name')
            ON CONFLICT DO NOTHING
            """.trimIndent(),
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, 'USER', 'Libero')")
    }

    private fun activeMemberCount(): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid AND active = true",
            Long::class.java,
        )!!

    private fun trainingTypeId(): UUID =
        jdbcTemplate.queryForObject("SELECT uuid FROM public.event_types WHERE name = 'Training'", UUID::class.java)!!

    private fun setSeason(start: String, end: String) {
        jdbcTemplate.update("UPDATE public.team_settings SET season_start = ?::date, season_end = ?::date WHERE id = 1", start, end)
    }

    private fun clearSeason() {
        jdbcTemplate.update("UPDATE public.team_settings SET season_start = NULL, season_end = NULL WHERE id = 1")
    }
}
