package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.exception.SubstituteNameTakenException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantContext
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.assertions.throwables.shouldThrow
import org.hamcrest.Matchers.contains
import org.hamcrest.Matchers.nullValue
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
import java.time.Duration
import java.time.Instant
import java.util.UUID
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs

// Fixture ids are namespaced after this feature's issue (#359), for the reason RosterFillIT gives:
// every IT shares one `public` schema, and two specs claiming the same user id share a member.
private const val ADMIN_USER_ID = "03590000-0000-0000-0000-000000000001"
private const val MEMBER_USER_ID = "03590000-0000-0000-0000-000000000002"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"
private const val SETTER = "Sub Setter"
private const val LIBERO = "Sub Libero"
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

    @Autowired
    lateinit var substituteRepository: SubstituteRepository

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

        // The picker lists everyone the Team has called in before, so Teams reuse the same few people.
        test("any member reads the team's substitutes, with their position") {
            seedTeam()
            val setter = positionId(SETTER)
            val withPosition = createSubstitute("Listed Setter", positionId = setter, asUser = MEMBER_USER_ID)
            val without = createSubstitute("Listed Floater", positionId = null, asUser = ADMIN_USER_ID)

            perform(MockMvcRequestBuilders.get("/api/substitutes"), MEMBER_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.substitutes[?(@.id == '$withPosition')].position.label").value(SETTER))
                .andExpect(jsonPath("$.substitutes[?(@.id == '$without')].name").value("Listed Floater"))
                .andExpect(jsonPath("$.substitutes[?(@.id == '$without')].position").value(contains(nullValue())))
        }

        test("taking a substitute off an event frees their spot") {
            seedTeam()
            val setter = positionId(SETTER)
            setTypeDefault(targets = mapOf(setter to 2))
            val eventId = createEvent("Taken off")
            val substituteId = createSubstitute("Temporary", positionId = setter, asUser = MEMBER_USER_ID)
            setSubstituteState(eventId, substituteId, "ATTENDING", asUser = MEMBER_USER_ID).andExpect(status().isOk)

            perform(MockMvcRequestBuilders.delete("/api/events/$eventId/substitutes/$substituteId"), MEMBER_USER_ID)
                .andExpect(status().isNoContent)

            detail(eventId)
                .andExpect(jsonPath("$.substitutes.length()").value(0))
                .andExpect(jsonPath("$.roster.totalAttending").value(0))
                .andExpect(jsonPath("$.roster.substituteAttending").value(0))
            // Nothing left to take off.
            perform(MockMvcRequestBuilders.delete("/api/events/$eventId/substitutes/$substituteId"), MEMBER_USER_ID)
                .andExpect(status().isNotFound)
        }

        // The card reads the list payload; it must agree with the detail page.
        test("the events list carries the substitutes and their count on the roster") {
            seedTeam()
            val setter = positionId(SETTER)
            setTypeDefault(targets = mapOf(setter to 2))
            val eventId = createEvent("Listed event")
            val substituteId = createSubstitute("In the list", positionId = setter, asUser = MEMBER_USER_ID)
            setSubstituteState(eventId, substituteId, "ATTENDING", asUser = MEMBER_USER_ID).andExpect(status().isOk)

            perform(MockMvcRequestBuilders.get("/api/events?include-past=true"), MEMBER_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.events[?(@.id == '$eventId')].roster.substituteAttending").value(1))
                .andExpect(jsonPath("$.events[?(@.id == '$eventId')].substitutes[0].name").value("In the list"))
        }

        // A Substitute is never expected to answer, so there is no blank state to set them to.
        test("a substitute cannot be set to not responded") {
            seedTeam()
            val eventId = createEvent("No blanks")
            val substituteId = createSubstitute("Never blank", positionId = null, asUser = MEMBER_USER_ID)

            setSubstituteState(eventId, substituteId, "NOT_RESPONDED", asUser = MEMBER_USER_ID)
                .andExpect(status().isBadRequest)
        }

        test("an unknown substitute or event is not found") {
            seedTeam()
            val eventId = createEvent("Known event")
            val substituteId = createSubstitute("Known substitute", positionId = null, asUser = MEMBER_USER_ID)

            setSubstituteState(eventId, UUID.randomUUID().toString(), "ATTENDING", asUser = MEMBER_USER_ID)
                .andExpect(status().isNotFound)
            setSubstituteState(UUID.randomUUID(), substituteId, "ATTENDING", asUser = MEMBER_USER_ID)
                .andExpect(status().isNotFound)
        }

        test("an admin renames a substitute and every event shows the new name") {
            seedTeam()
            val eventId = createEvent("Renamed on")
            val substituteId = createSubstitute("Before Rename", positionId = null, asUser = MEMBER_USER_ID)
            setSubstituteState(eventId, substituteId, "MAYBE", asUser = MEMBER_USER_ID).andExpect(status().isOk)

            putSubstitute(substituteId, "After Rename", positionId = null, asUser = ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.name").value("After Rename"))

            detail(eventId).andExpect(jsonPath("$.substitutes[0].name").value("After Rename"))
        }

        // Only Admins keep the list (ADR-0033); a plain Member gets the refusal every admin endpoint gives.
        test("a plain member cannot rename, move, count or remove a substitute") {
            seedTeam()
            val setter = positionId(SETTER)
            val substituteId = createSubstitute("Kept As Is", positionId = null, asUser = MEMBER_USER_ID)

            putSubstitute(substituteId, "Renamed By Member", positionId = null, asUser = MEMBER_USER_ID)
                .andExpect(status().isForbidden)
            putSubstitute(substituteId, "Kept As Is", positionId = setter, asUser = MEMBER_USER_ID)
                .andExpect(status().isForbidden)
            perform(MockMvcRequestBuilders.get("/api/substitutes/$substituteId/usage"), MEMBER_USER_ID)
                .andExpect(status().isForbidden)
            perform(MockMvcRequestBuilders.delete("/api/substitutes/$substituteId"), MEMBER_USER_ID)
                .andExpect(status().isForbidden)

            perform(MockMvcRequestBuilders.get("/api/substitutes"), MEMBER_USER_ID)
                .andExpect(jsonPath("$.substitutes[?(@.id == '$substituteId')].name").value("Kept As Is"))
                .andExpect(jsonPath("$.substitutes[?(@.id == '$substituteId')].position").value(contains(nullValue())))
        }

        // Unchanged behaviour, proven here: an Event reads the Substitute's current Position, as it
        // does a Member's, so a change moves them on every Event they are already on.
        test("changing a substitute's position moves them to that position's group on existing events") {
            seedTeam()
            val setter = positionId(SETTER)
            val libero = positionId(LIBERO)
            setTypeDefault(targets = mapOf(setter to 2, libero to 1))
            val eventId = createEvent("Moved on")
            val substituteId = createSubstitute("Moving", positionId = setter, asUser = MEMBER_USER_ID)
            setSubstituteState(eventId, substituteId, "ATTENDING", asUser = MEMBER_USER_ID).andExpect(status().isOk)

            putSubstitute(substituteId, "Moving", positionId = libero, asUser = ADMIN_USER_ID).andExpect(status().isOk)

            detail(eventId)
                .andExpect(jsonPath("$.substitutes[0].position.label").value(LIBERO))
                .andExpect(jsonPath("$.roster.positions[?(@.id == '$libero')].attending").value(contains(1)))
                .andExpect(jsonPath("$.roster.positions[?(@.id == '$setter')].attending").value(contains(0)))
        }

        test("a substitute's name stays unique on the list") {
            seedTeam()
            createSubstitute("Unique Name", positionId = null, asUser = MEMBER_USER_ID)
            val other = createSubstitute("Other Name", positionId = null, asUser = MEMBER_USER_ID)

            postSubstitute("unique name", asUser = MEMBER_USER_ID).andExpect(status().isConflict)
            putSubstitute(other, "UNIQUE NAME", positionId = null, asUser = ADMIN_USER_ID).andExpect(status().isConflict)
        }

        test("an admin gives a substitute a shirt number that no other substitute wears") {
            seedTeam()
            val wearer = createSubstitute("Number Wearer", positionId = null, asUser = MEMBER_USER_ID)
            val other = createSubstitute("Number Other", positionId = null, asUser = MEMBER_USER_ID)

            putSubstitute(wearer, "Number Wearer", null, ADMIN_USER_ID, shirtNumber = 21)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.shirtNumber").value(21))
            perform(MockMvcRequestBuilders.get("/api/substitutes"), MEMBER_USER_ID)
                .andExpect(jsonPath("$.substitutes[?(@.name == 'Number Wearer')].shirtNumber").value(contains(21)))

            putSubstitute(other, "Number Other", null, ADMIN_USER_ID, shirtNumber = 21)
                .andExpect(status().isConflict)
                .andExpect(jsonPath("$.code").value("NUMBER_TAKEN"))
            putSubstitute(other, "Number Other", null, ADMIN_USER_ID, shirtNumber = 1000)
                .andExpect(status().isBadRequest)
            putSubstitute(other, "Number Other", null, MEMBER_USER_ID, shirtNumber = 22)
                .andExpect(status().isForbidden)
        }

        // Two Members creating the same name at once both pass the service's check, so the repository
        // is called directly here, as the second of the two would be. The index refuses it, and the
        // caller hears the same 409 the service gives.
        test("a name taken between the service's check and the write is refused as taken") {
            seedTeam()
            val createdBy = UserId(UUID.fromString(MEMBER_USER_ID))
            val other = inPublicTenant {
                substituteRepository.create(DisplayName("Raced Name"), null, createdBy)
                substituteRepository.create(DisplayName("Raced Other"), null, createdBy)
            }

            shouldThrow<SubstituteNameTakenException> {
                inPublicTenant { substituteRepository.create(DisplayName("RACED NAME"), null, createdBy) }
            }
            shouldThrow<SubstituteNameTakenException> {
                inPublicTenant { substituteRepository.update(other.id, DisplayName("raced name"), null, null) }
            }
        }

        test("the remove dialog's count is every event the substitute is on, past ones included") {
            seedTeam()
            val past = createEvent("Counted, played", start = "2026-01-11T17:00:00Z")
            val upcoming = createEvent("Counted, to play", start = "2099-01-11T17:00:00Z")
            createEvent("Not on this one")
            val substituteId = createSubstitute("Counted", positionId = null, asUser = MEMBER_USER_ID)
            setSubstituteState(past, substituteId, "ABSENT", asUser = MEMBER_USER_ID).andExpect(status().isOk)
            setSubstituteState(upcoming, substituteId, "MAYBE", asUser = MEMBER_USER_ID).andExpect(status().isOk)

            perform(MockMvcRequestBuilders.get("/api/substitutes/$substituteId/usage"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.eventCount").value(2))
        }

        // The same rule as a departed Member (ADR-0009): they leave no trace on any Event, past ones included.
        test("an admin removes a substitute and they leave every event, past ones included") {
            seedTeam()
            val past = createEvent("Played already", start = "2026-01-10T17:00:00Z")
            val upcoming = createEvent("Still to play", start = "2099-01-10T17:00:00Z")
            val substituteId = createSubstitute("Leaving", positionId = null, asUser = MEMBER_USER_ID)
            setSubstituteState(past, substituteId, "ATTENDING", asUser = MEMBER_USER_ID).andExpect(status().isOk)
            setSubstituteState(upcoming, substituteId, "MAYBE", asUser = MEMBER_USER_ID).andExpect(status().isOk)

            perform(MockMvcRequestBuilders.delete("/api/substitutes/$substituteId"), ADMIN_USER_ID)
                .andExpect(status().isNoContent)

            detail(past).andExpect(jsonPath("$.substitutes.length()").value(0))
            detail(upcoming).andExpect(jsonPath("$.substitutes.length()").value(0))
            perform(MockMvcRequestBuilders.get("/api/substitutes"), MEMBER_USER_ID)
                .andExpect(jsonPath("$.substitutes[?(@.id == '$substituteId')]").isEmpty)
            // There is no restore: a second removal finds nothing.
            perform(MockMvcRequestBuilders.delete("/api/substitutes/$substituteId"), ADMIN_USER_ID)
                .andExpect(status().isNotFound)
        }

        test("a blank or over-long name is refused") {
            seedTeam()

            postSubstitute("   ", asUser = MEMBER_USER_ID).andExpect(status().isBadRequest)
            postSubstitute("x".repeat(101), asUser = MEMBER_USER_ID).andExpect(status().isBadRequest)
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun <T> inPublicTenant(block: () -> T): T {
        TenantContext.set("public")
        try {
            return block()
        } finally {
            TenantContext.clear()
        }
    }

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String) =
        mockMvc.perform(builder.with(loginAs(userId, tenant = "public")))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun detail(id: UUID) =
        perform(MockMvcRequestBuilders.get("/api/events/$id"), MEMBER_USER_ID).andExpect(status().isOk)

    private fun postSubstitute(name: String, positionId: UUID? = null, asUser: String) =
        perform(
            MockMvcRequestBuilders.post("/api/substitutes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"name": "$name", "positionId": ${positionId?.let { "\"$it\"" } ?: "null"}}"""),
            asUser,
        )

    private fun putSubstitute(id: String, name: String, positionId: UUID?, asUser: String, shirtNumber: Long? = null) =
        perform(
            MockMvcRequestBuilders.put("/api/substitutes/$id")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """{"name": "$name", "positionId": ${positionId?.let { "\"$it\"" } ?: "null"}, "shirtNumber": $shirtNumber}""",
                ),
            asUser,
        )

    private fun createSubstitute(name: String, positionId: UUID?, asUser: String): String {
        val response = postSubstitute(name, positionId, asUser)
            .andExpect(status().isCreated).andReturn().response.contentAsString
        return Regex("\"id\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1]
    }

    private fun setSubstituteState(eventId: UUID, substituteId: String, state: String, asUser: String) =
        perform(
            MockMvcRequestBuilders.put("/api/events/$eventId/substitutes/$substituteId")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"state": "$state"}"""),
            asUser,
        )

    private fun createEvent(title: String, start: String = "2026-09-01T17:00:00Z"): UUID {
        val startTime = Instant.parse(start)
        val body = """
            {
              "eventTypeId": "${fixtureTypeId()}",
              "title": "$title",
              "description": null,
              "startTime": "$startTime",
              "endTime": "${startTime.plus(Duration.ofMinutes(90))}",
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
        jdbcTemplate.update("UPDATE public.substitutes SET shirt_number = NULL")
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
