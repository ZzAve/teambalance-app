package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
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

// This spec runs against its OWN tenant schema, not the shared `public` one every other IT uses.
// It archives event types — including, deliberately, all but one of the seeded ones — and event
// types are tenant-schema rows, so doing that in `public` would hide Training/Match/Other from every
// other spec that reads them. The team, members and positions still come from the platform schema.
// Fixture user ids are namespaced `b2190000-…` after this feature's issue (#219). Every IT shares
// one `public` schema and `tb_add_member` is ON CONFLICT DO NOTHING, so two specs claiming the same
// id silently share a member — and whichever seeds first decides their role. That is not
// hypothetical: these specs originally used `…0000d1`-`…0000d3`, which #242 later took for
// EventControllerTest's setters, turning this spec's admin into a plain USER and every admin-gated
// write into a 403. An issue-scoped prefix makes a future collision implausible rather than lucky.
private const val ADMIN_USER_ID = "b2190000-0000-0000-0000-000000000021"
private const val MEMBER_USER_ID = "b2190000-0000-0000-0000-000000000022"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"
private const val SETTER = "Admin Setter"
private const val SCHEMA = "team_roster_admin"
private const val OFF_DEFAULT = """{"trackRoster": false, "totalTarget": null, "positionTargets": []}"""

/**
 * Event-type authoring against a real Postgres (#219, step 4): create / rename / recolor / archive,
 * and the roster default each type carries.
 *
 * The rules worth proving here are the ones that protect a team from locking itself out or losing
 * events: archiving is a soft delete that never touches an event, the migration and the archive
 * commit together, and the last active type cannot be archived at all.
 */
@AutoConfigureMockMvc
class EventTypeAdminIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("an admin creates a type with a roster default and reads it back") {
            seedTeam()
            val setter = positionId(SETTER)

            val id = createType(
                name = "Cup Match",
                color = "#225C9C",
                rosterDefault = """
                    {"trackRoster": true, "totalTarget": 10, "positionTargets": [{"positionId": "$setter", "count": 2}]}
                """.trimIndent(),
            )

            listTypes()
                .andExpect(jsonPath("$.eventTypes[?(@.id == '$id')].name").value("Cup Match"))
                .andExpect(jsonPath("$.eventTypes[?(@.id == '$id')].color").value("#225C9C"))
                .andExpect(jsonPath("$.eventTypes[?(@.id == '$id')].archived").value(false))
                .andExpect(jsonPath("$.eventTypes[?(@.id == '$id')].rosterDefault.trackRoster").value(true))
                .andExpect(jsonPath("$.eventTypes[?(@.id == '$id')].rosterDefault.totalTarget").value(10))
        }

        test("an admin renames, recolors and re-targets a type in one update") {
            seedTeam()
            val setter = positionId(SETTER)
            val id = createType("Friendly", "#249E6C", OFF_DEFAULT)

            perform(
                MockMvcRequestBuilders.put("/api/event-types/$id")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {"name": "Friendly Match", "color": "#F4B400", "rosterDefault":
                          {"trackRoster": true, "totalTarget": null,
                           "positionTargets": [{"positionId": "$setter", "count": 3}]}}
                        """.trimIndent(),
                    ),
                ADMIN_USER_ID,
            )
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.name").value("Friendly Match"))
                .andExpect(jsonPath("$.color").value("#F4B400"))
                .andExpect(jsonPath("$.rosterDefault.positionTargets[0].count").value(3))
        }

        // The whole point of resolving the requirement on read: an admin changes the shape of a
        // Match once, and every inheriting Match follows without a single event row being rewritten.
        test("editing a type's roster default moves the events that inherit it") {
            seedTeam()
            val setter = positionId(SETTER)
            seedMember(MEMBER_USER_ID, "admin-member@test.com", SETTER)
            val typeId = createType("Inheriting", null, OFF_DEFAULT)
            val eventId = createEvent(typeId, "Follows the type")
            attend(eventId, MEMBER_USER_ID)

            // Tracking is off, so the event shows no panel.
            detail(eventId).andExpect(jsonPath("$.roster.state").value("OFF"))

            updateType(
                typeId,
                "Inheriting",
                """
                {"trackRoster": true, "totalTarget": null, "positionTargets": [{"positionId": "$setter", "count": 2}]}
                """.trimIndent(),
            ).andExpect(status().isOk)

            detail(eventId)
                .andExpect(jsonPath("$.roster.state").value("SPOTS_OPEN"))
                .andExpect(jsonPath("$.roster.openSlots").value(1))
        }

        test("archiving hides a type from the pickers while its events keep it and keep rendering") {
            seedTeam()
            val typeId = createType("Doomed", null, OFF_DEFAULT)
            val eventId = createEvent(typeId, "Still here")

            archive(typeId, migrateTo = null).andExpect(status().isOk)

            // Gone from the default listing — which is what every create/edit picker reads…
            listTypes().andExpect(jsonPath("$.eventTypes[?(@.id == '$typeId')]").isEmpty)
            // …but present when the admin screen asks for archived ones too.
            listTypes(includeArchived = true)
                .andExpect(jsonPath("$.eventTypes[?(@.id == '$typeId')].archived").value(true))
            // And the event neither vanished nor lost its type.
            detail(eventId)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.eventType.name").value("Doomed"))
        }

        // The offer the admin gets before archiving: move the events somewhere they stay visible.
        test("archiving with a migration target moves every event of that type first") {
            seedTeam()
            val fromId = createType("Old Match", null, OFF_DEFAULT)
            val toId = createType("New Match", null, OFF_DEFAULT)
            val a = createEvent(fromId, "Migrating A")
            val b = createEvent(fromId, "Migrating B")
            val untouched = createEvent(toId, "Already there")

            archive(fromId, migrateTo = toId).andExpect(status().isOk)

            detail(a).andExpect(jsonPath("$.eventType.id").value(toId.toString()))
            detail(b).andExpect(jsonPath("$.eventType.id").value(toId.toString()))
            detail(untouched).andExpect(jsonPath("$.eventType.id").value(toId.toString()))
            eventCountOfType(fromId) shouldBe 0
        }

        // Without this a team can archive its way to zero types and then be unable to create an
        // event at all, with no way back through the UI.
        test("the last active type cannot be archived") {
            seedTeam()
            val ids = activeTypeIds()
            // Archive everything but one, then try the last.
            ids.dropLast(1).forEach { archive(it, migrateTo = ids.last()).andExpect(status().isOk) }

            archive(ids.last(), migrateTo = null)
                .andExpect(status().isConflict)
                .andExpect(jsonPath("$.code").value("LAST_EVENT_TYPE"))

            activeTypeIds().size shouldBe 1
            // …and unarchiving puts one back in the pickers, which is what makes it a soft delete.
            perform(MockMvcRequestBuilders.post("/api/event-types/${ids.first()}/unarchive"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.archived").value(false))
            activeTypeIds().size shouldBe 2
        }

        test("a migration target that is archived, unknown or the type itself is rejected") {
            seedTeam()
            val fromId = createType("Source", null, OFF_DEFAULT)
            val archivedId = createType("Archived Target", null, OFF_DEFAULT)
            archive(archivedId, migrateTo = null).andExpect(status().isOk)

            archive(fromId, migrateTo = archivedId).andExpect(status().isBadRequest)
            archive(fromId, migrateTo = UUID.randomUUID()).andExpect(status().isBadRequest)
            archive(fromId, migrateTo = fromId).andExpect(status().isBadRequest)

            // Nothing was archived by a rejected attempt.
            listTypes().andExpect(jsonPath("$.eventTypes[?(@.id == '$fromId')].archived").value(false))
        }

        test("event type names are unique per team, case-insensitively, archived ones included") {
            seedTeam()
            createType("Unique Name", null, OFF_DEFAULT)

            perform(
                MockMvcRequestBuilders.post("/api/event-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"name": "unique name", "color": null, "rosterDefault": ${OFF_DEFAULT}}"""),
                ADMIN_USER_ID,
            )
                .andExpect(status().isConflict)
                .andExpect(jsonPath("$.code").value("EVENT_TYPE_NAME_TAKEN"))
        }

        // Without the value object's cap a 101-character name reaches VARCHAR(100) and surfaces as a
        // 500; without the blank guard a whitespace name is stored as "". Both are 400s.
        test("a blank or over-long name is rejected with 400, not a 500") {
            seedTeam()

            perform(
                MockMvcRequestBuilders.post("/api/event-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"name": "   ", "color": null, "rosterDefault": $OFF_DEFAULT}"""),
                ADMIN_USER_ID,
            ).andExpect(status().isBadRequest)

            perform(
                MockMvcRequestBuilders.post("/api/event-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"name": "${"x".repeat(101)}", "color": null, "rosterDefault": $OFF_DEFAULT}"""),
                ADMIN_USER_ID,
            ).andExpect(status().isBadRequest)

            eventTypeCountNamed("   ") shouldBe 0
        }

        test("a roster default naming an unknown position is rejected") {
            seedTeam()

            perform(
                MockMvcRequestBuilders.post("/api/event-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {"name": "Ghost Targets", "color": null, "rosterDefault":
                          {"trackRoster": true, "totalTarget": null,
                           "positionTargets": [{"positionId": "${UUID.randomUUID()}", "count": 2}]}}
                        """.trimIndent(),
                    ),
                ADMIN_USER_ID,
            )
                .andExpect(status().isBadRequest)
                .andExpect(jsonPath("$.code").value("UNKNOWN_ROSTER_POSITION"))
        }

        // Config is admin-only; reading the vocabulary is not, because every picker and the roster
        // panel need it.
        test("a non-admin may read event types but may not write them") {
            seedTeam()
            seedMember(MEMBER_USER_ID, "admin-member@test.com", null)
            val id = createType("Read Only", null, OFF_DEFAULT)

            perform(MockMvcRequestBuilders.get("/api/event-types"), MEMBER_USER_ID).andExpect(status().isOk)

            perform(
                MockMvcRequestBuilders.post("/api/event-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"name": "Nope", "color": null, "rosterDefault": ${OFF_DEFAULT}}"""),
                MEMBER_USER_ID,
            ).andExpect(status().isForbidden)

            perform(
                MockMvcRequestBuilders.put("/api/event-types/$id")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"name": "Nope", "color": null, "rosterDefault": ${OFF_DEFAULT}}"""),
                MEMBER_USER_ID,
            ).andExpect(status().isForbidden)

            archive(id, migrateTo = null, asUser = MEMBER_USER_ID).andExpect(status().isForbidden)
        }

        // What the delete confirmation reports before an admin agrees to it.
        // Its own position, because the counts are cumulative: other tests in this spec target
        // SETTER, and a shared one would make the expected numbers depend on execution order.
        test("position usage reports the types, events and members that would be touched") {
            seedTeam()
            val counted = "Admin Counted"
            val setter = positionId(counted)
            seedMember(MEMBER_USER_ID, "admin-member@test.com", counted)
            val targeting = """
                {"trackRoster": true, "totalTarget": null, "positionTargets": [{"positionId": "$setter", "count": 2}]}
            """.trimIndent()
            val typeId = createType("Uses Setter", null, targeting)
            createEventWithOverride(typeId, "Overrides too", targeting)

            perform(MockMvcRequestBuilders.get("/api/positions/$setter/usage"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.eventTypeCount").value(1))
                .andExpect(jsonPath("$.eventCount").value(1))
                .andExpect(jsonPath("$.memberCount").value(1))
        }

        test("position usage is admin-only") {
            seedTeam()
            val setter = positionId(SETTER)
            seedMember(MEMBER_USER_ID, "admin-member@test.com", null)

            perform(MockMvcRequestBuilders.get("/api/positions/$setter/usage"), MEMBER_USER_ID)
                .andExpect(status().isForbidden)
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String) =
        mockMvc.perform(builder.header("X-Team-Id", SCHEMA).header("X-User-Id", userId))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    // Tracking off, no targets: the default a type starts life with.

    private fun listTypes(includeArchived: Boolean = false) = perform(
        MockMvcRequestBuilders.get("/api/event-types?include-archived=$includeArchived"),
        ADMIN_USER_ID,
    ).andExpect(status().isOk)

    private fun createType(name: String, color: String?, rosterDefault: String): UUID {
        val body = """{"name": "$name", "color": ${color?.let { "\"$it\"" } ?: "null"}, "rosterDefault": $rosterDefault}"""
        val response = perform(
            MockMvcRequestBuilders.post("/api/event-types").contentType(MediaType.APPLICATION_JSON).content(body),
            ADMIN_USER_ID,
        ).andExpect(status().isCreated).andReturn().response.contentAsString
        return UUID.fromString(Regex("\"id\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1])
    }

    private fun updateType(id: UUID, name: String, rosterDefault: String) = perform(
        MockMvcRequestBuilders.put("/api/event-types/$id")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"name": "$name", "color": null, "rosterDefault": $rosterDefault}"""),
        ADMIN_USER_ID,
    )

    private fun archive(id: UUID, migrateTo: UUID?, asUser: String = ADMIN_USER_ID) = perform(
        MockMvcRequestBuilders.post("/api/event-types/$id/archive")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"migrateEventsTo": ${migrateTo?.let { "\"$it\"" } ?: "null"}}"""),
        asUser,
    )

    private fun createEvent(typeId: UUID, title: String) = createEventWithOverride(typeId, title, null)

    private fun createEventWithOverride(typeId: UUID, title: String, rosterOverride: String?): UUID {
        val body = """
            {
              "eventTypeId": "$typeId", "title": "$title", "description": null,
              "startTime": "2026-09-01T17:00:00Z", "endTime": "2026-09-01T18:30:00Z",
              "location": null, "references": [], "rosterOverride": ${rosterOverride ?: "null"}
            }
        """.trimIndent()
        val response = perform(
            MockMvcRequestBuilders.post("/api/events").contentType(MediaType.APPLICATION_JSON).content(body),
            ADMIN_USER_ID,
        ).andExpect(status().isCreated).andReturn().response.contentAsString
        return UUID.fromString(Regex("\"id\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1])
    }

    private fun detail(id: UUID) = perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)

    private fun attend(eventId: UUID, userId: String) {
        perform(
            MockMvcRequestBuilders.put("/api/events/$eventId/attendances/$userId")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"state": "ATTENDING"}"""),
            ADMIN_USER_ID,
        ).andExpect(status().isOk)
    }

    private fun eventTypeCountNamed(name: String): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM $SCHEMA.event_types WHERE name = ?",
            Long::class.java,
            name,
        )!!

    private fun activeTypeIds(): List<UUID> =
        jdbcTemplate.queryForList(
            "SELECT uuid FROM $SCHEMA.event_types WHERE archived = false ORDER BY id",
            UUID::class.java,
        ).filterNotNull()

    private fun eventCountOfType(id: UUID): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM $SCHEMA.events e JOIN $SCHEMA.event_types et ON et.id = e.event_type_id WHERE et.uuid = ?",
            Long::class.java,
            id,
        )!!

    // Positions are tenant rows since ADR-0025, so they belong in the schema this spec routes to
    // (X-Team-Id: $SCHEMA), not in the platform schema. It is also where they have to be for a
    // target to reference one — event_type_position_targets.position_id is a real foreign key now.
    private fun positionId(label: String): UUID {
        jdbcTemplate.update(
            "INSERT INTO $SCHEMA.positions (id, label) VALUES (gen_random_uuid(), ?) ON CONFLICT DO NOTHING",
            label,
        )
        return jdbcTemplate.queryForObject(
            "SELECT id FROM $SCHEMA.positions WHERE lower(label) = lower(?)",
            UUID::class.java,
            label,
        )!!
    }

    private fun seedTeam() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema(SCHEMA)
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.update("UPDATE $SCHEMA.team_settings SET season_start = NULL, season_end = NULL WHERE id = 1")
        seedMember(ADMIN_USER_ID, "admin-admin@test.com", null, role = "ADMIN")
    }

    private fun seedMember(userId: String, email: String, position: String?, role: String = "USER") {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$userId'::uuid, '$email', '$email')
            ON CONFLICT DO NOTHING
            """,
        )
        val label = position?.let { "'$it'" } ?: "NULL"
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, '$role', $label)")
        if (position != null) {
            // tb_add_member seeds the profile into the team's own schema; this spec routes elsewhere
            // by header, so the profile it reads back has to be written here explicitly.
            jdbcTemplate.update(
                "INSERT INTO $SCHEMA.member_profiles (user_id, display_name, position_id) " +
                    "VALUES (?::uuid, ?, (SELECT id FROM $SCHEMA.positions WHERE lower(label) = lower(?))) " +
                    "ON CONFLICT (user_id) DO UPDATE SET position_id = EXCLUDED.position_id",
                userId,
                email,
                position,
            )
        }
    }
}
