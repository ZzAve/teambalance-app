package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.UUID

// Fixture ids are namespaced after this feature's issue (#359), for the reason RosterFillIT gives:
// every IT shares one `public` schema, and two specs claiming the same user id share a member.
private const val ADMIN_USER_ID = "03590000-0000-0000-0000-000000000001"
private const val MEMBER_USER_ID = "03590000-0000-0000-0000-000000000002"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"
private const val SETTER = "Sub Setter"
private const val TYPE_NAME = "SubstituteFixture"

/**
 * Substitutes end to end (ADR-0033): a Team-kept list and attendance on an Event for someone with no
 * account, written inside the tenant. [com.github.zzave.teambalance.api.domain.model.EventAttendanceTest]
 * and [com.github.zzave.teambalance.api.domain.model.RosterFillTest] hold the counting rules; this spec
 * proves the wiring: real rows, a plain Member's permissions, and the events payload.
 */
@AutoConfigureMockMvc
class SubstituteIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("a plain member calls in a new substitute as going, and they fill a spot on the event roster") {
            seedTeam()
            val setter = positionId(SETTER)
            setTypeDefault(targets = mapOf(setter to 2))
            val eventId = createEvent("Match")

            val substituteId = createSubstitute("Sam", positionId = setter, asUser = MEMBER_USER_ID)
            setSubstituteState(eventId, substituteId, "ATTENDING", asUser = MEMBER_USER_ID)
                .andExpect(status().isOk)

            detail(eventId)
                .andExpect(jsonPath("$.roster.totalAttending").value(1))
                .andExpect(jsonPath("$.roster.substituteAttending").value(1))
                .andExpect(jsonPath("$.roster.positions[0].attending").value(1))
                .andExpect(jsonPath("$.roster.openSlots").value(1))
                // Members only: a Substitute is never part of the expected total.
                .andExpect(jsonPath("$.attendanceSummary.attending").value(0))
                .andExpect(jsonPath("$.substitutes.length()").value(1))
                .andExpect(jsonPath("$.substitutes[0].substituteId").value(substituteId))
                .andExpect(jsonPath("$.substitutes[0].name").value("Sam"))
                .andExpect(jsonPath("$.substitutes[0].position.label").value(SETTER))
                .andExpect(jsonPath("$.substitutes[0].state").value("ATTENDING"))
                .andExpect(jsonPath("$.substitutes[0].changedBy").value(MEMBER_USER_ID))
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String) =
        mockMvc.perform(builder.header("X-Team-Id", "public").header("X-User-Id", userId))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun detail(id: UUID) =
        perform(MockMvcRequestBuilders.get("/api/events/$id"), MEMBER_USER_ID).andExpect(status().isOk)

    private fun createSubstitute(name: String, positionId: UUID?, asUser: String): String {
        val position = positionId?.let { "\"$it\"" } ?: "null"
        val response = perform(
            MockMvcRequestBuilders.post("/api/substitutes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"name": "$name", "positionId": $position}"""),
            asUser,
        ).andExpect(status().isCreated).andReturn().response.contentAsString
        return Regex("\"id\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1]
    }

    private fun setSubstituteState(eventId: UUID, substituteId: String, state: String, asUser: String) =
        perform(
            MockMvcRequestBuilders.put("/api/events/$eventId/substitutes/$substituteId")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"state": "$state"}"""),
            asUser,
        )

    private fun createEvent(title: String): UUID {
        val body = """
            {
              "eventTypeId": "${fixtureTypeId()}",
              "title": "$title",
              "description": null,
              "startTime": "2026-09-01T17:00:00Z",
              "endTime": "2026-09-01T18:30:00Z",
              "location": null,
              "references": [],
              "rosterOverride": null
            }
        """.trimIndent()
        val response = perform(
            MockMvcRequestBuilders.post("/api/events").contentType(MediaType.APPLICATION_JSON).content(body),
            ADMIN_USER_ID,
        ).andExpect(status().isCreated).andReturn().response.contentAsString
        return UUID.fromString(Regex("\"id\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1])
    }

    private fun fixtureTypeId(): UUID {
        jdbcTemplate.update(
            "INSERT INTO public.event_types (name, color) SELECT ?, '#7B5EA7' " +
                "WHERE NOT EXISTS (SELECT 1 FROM public.event_types WHERE name = ?)",
            TYPE_NAME,
            TYPE_NAME,
        )
        return jdbcTemplate.queryForObject(
            "SELECT uuid FROM public.event_types WHERE name = ?",
            UUID::class.java,
            TYPE_NAME,
        )!!
    }

    // No authoring endpoint is needed to prove the fill, so the type's default is seeded directly.
    private fun setTypeDefault(targets: Map<UUID, Int>) {
        fixtureTypeId()
        jdbcTemplate.update(
            "UPDATE public.event_types SET track_roster = true, total_target = NULL WHERE name = ?",
            TYPE_NAME,
        )
        val id = jdbcTemplate.queryForObject(
            "SELECT id FROM public.event_types WHERE name = ?",
            Long::class.java,
            TYPE_NAME,
        )!!
        jdbcTemplate.update("DELETE FROM public.event_type_position_targets WHERE event_type_id = ?", id)
        targets.forEach { (positionId, count) ->
            jdbcTemplate.update(
                "INSERT INTO public.event_type_position_targets (event_type_id, position_id, target_count) VALUES (?, ?, ?)",
                id,
                positionId,
                count,
            )
        }
    }

    private fun positionId(label: String): UUID {
        jdbcTemplate.update(
            "INSERT INTO public.positions (id, label) VALUES (gen_random_uuid(), ?) ON CONFLICT DO NOTHING",
            label,
        )
        return jdbcTemplate.queryForObject(
            "SELECT id FROM public.positions WHERE lower(label) = lower(?)",
            UUID::class.java,
            label,
        )!!
    }

    private fun seedTeam() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.update("UPDATE public.team_settings SET season_start = NULL, season_end = NULL WHERE id = 1")
        seedMember(ADMIN_USER_ID, "sub-admin@test.com", role = "ADMIN")
        seedMember(MEMBER_USER_ID, "sub-member@test.com", role = "USER")
    }

    private fun seedMember(userId: String, email: String, role: String) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$userId'::uuid, '$email', '$email')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, '$role', NULL)")
    }
}
