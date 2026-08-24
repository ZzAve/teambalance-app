package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.nulls.shouldNotBeNull
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

// d1/d2: every IT shares one `public` schema, and tb_add_member is ON CONFLICT DO NOTHING, so a
// user id another spec already seeded would silently keep THAT spec's role. These two are unused
// elsewhere — check the list before adding more.
// Fixture user ids are namespaced `b2190000-…` after this feature's issue (#219). Every IT shares
// one `public` schema and `tb_add_member` is ON CONFLICT DO NOTHING, so two specs claiming the same
// id silently share a member — and whichever seeds first decides their role. That is not
// hypothetical: these specs originally used `…0000d1`-`…0000d3`, which #242 later took for
// EventControllerTest's setters, turning this spec's admin into a plain USER and every admin-gated
// write into a 403. An issue-scoped prefix makes a future collision implausible rather than lucky.
private const val ADMIN_USER_ID = "b2190000-0000-0000-0000-000000000001"
private const val MEMBER_USER_ID = "b2190000-0000-0000-0000-000000000002"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

// Every IT runs against the ONE shared `public` schema and the one demo team, so this spec owns
// its fixtures rather than borrowing the seeded ones: it deletes a position (which nulls every
// holder's position_id, and tb_add_member's ON CONFLICT DO NOTHING will not re-assign them) and it
// rewrites an event type's roster columns. Doing either to "Setter" or to "Match" would reach into
// specs that assert on them — EventControllerTest expects the demo roster's roles intact.
private const val SETTER = "Roster Setter"
private const val LIBERO = "Roster Libero"
private const val TYPE_NAME = "RosterFixture"

/**
 * Roster requirements against a real Postgres (#219, step 1): the storage and the contract edge, not
 * yet the fill computation.
 *
 * What only a real database can answer here:
 *  - **The override/inherit bit is a nullable column, not a flag.** A stored `trackRoster = false`
 *    override and an absent override are different rows and must read back differently — an in-memory
 *    fake would happily agree with either mapping.
 *  - **Two eager element collections on one event.** `references` (an ordered list) and the roster's
 *    per-position targets (a map) are fetched together; if Hibernate assembled them from one
 *    cartesian result set the references would silently multiply. Only a round-trip catches that.
 *  - **The position-delete cascade is now a foreign key** (ADR-0026), and a constraint is exactly the
 *    kind of thing a fake cannot stand in for: the service issues one DELETE and the database is what
 *    removes every target naming that position. This spec is where that is actually demonstrated.
 */
@AutoConfigureMockMvc
class RosterRequirementPersistenceIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("an event type's roster default round-trips through the listing") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)
            val libero = positionId(LIBERO)
            setTypeDefault(trackRoster = true, totalTarget = 12, targets = mapOf(setter to 2, libero to 1))

            perform(MockMvcRequestBuilders.get("/api/event-types"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.eventTypes[?(@.name == 'RosterFixture')].rosterDefault.trackRoster").value(true))
                .andExpect(jsonPath("$.eventTypes[?(@.name == 'RosterFixture')].rosterDefault.totalTarget").value(12))
                .andExpect(jsonPath("$.eventTypes[?(@.name == 'RosterFixture')].rosterDefault.positionTargets.length()").value(2))
                .andExpect(jsonPath("$.eventTypes[?(@.name == 'RosterFixture')].archived").value(false))
        }

        // The seeded types predate roster tracking: the migration's defaults must leave them switched
        // off rather than, say, "tracking with no targets" — a social would otherwise sprout a panel.
        test("an unconfigured event type reads as tracking off with no targets") {
            seedTeamAndAdmin()

            perform(MockMvcRequestBuilders.get("/api/event-types"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.eventTypes[?(@.name == 'Other')].rosterDefault.trackRoster").value(false))
                .andExpect(jsonPath("$.eventTypes[?(@.name == 'Other')].rosterDefault.positionTargets.length()").value(0))
            // Asserted on the column rather than the JSON: a JsonPath filter yields an array, so an
            // absent total reads as [null] and no doesNotExist() assertion can tell it from a real one.
            totalTargetColumnOf("Other") shouldBe null
        }

        test("an event created with an override round-trips it, alongside its references") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)

            val id = createEvent(
                title = "Override",
                rosterOverride = """
                    {"trackRoster": true, "totalTarget": 8, "positionTargets": [{"positionId": "$setter", "count": 2}]}
                """.trimIndent(),
                references = """[{"title": "Sheet", "url": "https://example.com/a"}, {"url": "https://example.com/b"}]""",
            )

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.rosterOverride.trackRoster").value(true))
                .andExpect(jsonPath("$.rosterOverride.totalTarget").value(8))
                .andExpect(jsonPath("$.rosterOverride.positionTargets.length()").value(1))
                .andExpect(jsonPath("$.rosterOverride.positionTargets[0].positionId").value(setter.toString()))
                .andExpect(jsonPath("$.rosterOverride.positionTargets[0].count").value(2))
                // The second eager collection did not multiply the first.
                .andExpect(jsonPath("$.references.length()").value(2))
        }

        test("an event created without an override reads back as inheriting") {
            seedTeamAndAdmin()

            val id = createEvent(title = "Inherits", rosterOverride = null)

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.rosterOverride").doesNotExist())
            trackRosterColumnOf(id) shouldBe null
        }

        // "Tracked, but nothing required" is a state of its own, and the one most easily lost: it is
        // an override whose every other field is empty, so a mapping that treated "empty" as "absent"
        // would silently turn it back into inheritance.
        test("an override that only switches tracking on is stored as an override, not as inheritance") {
            seedTeamAndAdmin()

            val id = createEvent(
                title = "Tally only",
                rosterOverride = """{"trackRoster": true, "totalTarget": null, "positionTargets": []}""",
            )

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.rosterOverride.trackRoster").value(true))
                .andExpect(jsonPath("$.rosterOverride.totalTarget").doesNotExist())
                .andExpect(jsonPath("$.rosterOverride.positionTargets.length()").value(0))
            trackRosterColumnOf(id) shouldBe true
        }

        // Same trap from the other side: an override that switches tracking OFF is a deliberate "no
        // panel on this one occurrence", and must not read back as "inherit whatever the type says".
        test("an override that switches tracking off is stored, not read back as inheritance") {
            seedTeamAndAdmin()
            setTypeDefault(trackRoster = true, totalTarget = 10, targets = emptyMap())

            val id = createEvent(
                title = "Opted out",
                rosterOverride = """{"trackRoster": false, "totalTarget": null, "positionTargets": []}""",
            )

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.rosterOverride.trackRoster").value(false))
            trackRosterColumnOf(id) shouldBe false
        }

        test("an edit replaces the override wholesale, and can drop it back to inheriting") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)
            val libero = positionId(LIBERO)
            val id = createEvent(
                title = "Edited",
                rosterOverride = """
                    {"trackRoster": true, "totalTarget": 8, "positionTargets": [{"positionId": "$setter", "count": 2}]}
                """.trimIndent(),
            )

            // Whole replacement, not a patch: the setter target is gone because the new value omits it.
            updateEvent(
                id,
                rosterOverride = """
                    {"trackRoster": true, "totalTarget": null, "positionTargets": [{"positionId": "$libero", "count": 3}]}
                """.trimIndent(),
            ).andExpect(status().isOk)

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(jsonPath("$.rosterOverride.positionTargets.length()").value(1))
                .andExpect(jsonPath("$.rosterOverride.positionTargets[0].positionId").value(libero.toString()))
                .andExpect(jsonPath("$.rosterOverride.totalTarget").doesNotExist())

            updateEvent(id, rosterOverride = null).andExpect(status().isOk)

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(jsonPath("$.rosterOverride").doesNotExist())
            targetCountFor(id) shouldBe 0
        }

        // A stepper wound down to zero is the admin saying "no target here", so it is dropped rather
        // than stored as a target of nothing (which would render a permanently-covered panel row).
        test("a zero count is dropped rather than stored") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)
            val libero = positionId(LIBERO)

            val id = createEvent(
                title = "Zeroed",
                rosterOverride = """
                    {"trackRoster": true, "totalTarget": null, "positionTargets": [
                        {"positionId": "$setter", "count": 0}, {"positionId": "$libero", "count": 2}]}
                """.trimIndent(),
            )

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(jsonPath("$.rosterOverride.positionTargets.length()").value(1))
                .andExpect(jsonPath("$.rosterOverride.positionTargets[0].positionId").value(libero.toString()))
        }

        test("a nonsensical target is rejected with 400 and nothing is written") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)

            perform(
                MockMvcRequestBuilders.post("/api/events")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        eventBody(
                            "Bad",
                            """
                            {"trackRoster": true, "totalTarget": null, "positionTargets": [
                                {"positionId": "$setter", "count": -2}]}
                            """.trimIndent(),
                        ),
                    ),
                ADMIN_USER_ID,
            ).andExpect(status().isBadRequest)

            eventCountWithTitle("Bad") shouldBe 0
        }

        // Zero means "no target here" on both axes, or the same stepper gesture on the same form
        // would drop one row and 400 on the other.
        test("a zero total target clears the headcount rather than failing") {
            seedTeamAndAdmin()

            val id = createEvent(
                title = "Zero total",
                rosterOverride = """{"trackRoster": true, "totalTarget": 0, "positionTargets": []}""",
            )

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.rosterOverride.trackRoster").value(true))
                .andExpect(jsonPath("$.rosterOverride.totalTarget").doesNotExist())
        }

        // The foreign key makes an unknown id unstorable; this guard is what makes the refusal the
        // declared 400 rather than a constraint violation surfacing as a 500 (ADR-0026).
        test("a target naming an unknown position is rejected with 400 and nothing is written") {
            seedTeamAndAdmin()

            perform(
                MockMvcRequestBuilders.post("/api/events")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        eventBody(
                            "Ghost",
                            """
                            {"trackRoster": true, "totalTarget": null, "positionTargets": [
                                {"positionId": "${UUID.randomUUID()}", "count": 2}]}
                            """.trimIndent(),
                        ),
                    ),
                ADMIN_USER_ID,
            )
                .andExpect(status().isBadRequest)
                .andExpect(jsonPath("$.code").value("UNKNOWN_ROSTER_POSITION"))

            eventCountWithTitle("Ghost") shouldBe 0
        }

        test("an edit naming an unknown position is rejected and leaves the stored override intact") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)
            val id = createEvent(
                title = "Keeps override",
                rosterOverride = """
                    {"trackRoster": true, "totalTarget": null, "positionTargets": [{"positionId": "$setter", "count": 2}]}
                """.trimIndent(),
            )

            updateEvent(
                id,
                rosterOverride = """
                    {"trackRoster": true, "totalTarget": null, "positionTargets": [
                        {"positionId": "${UUID.randomUUID()}", "count": 2}]}
                """.trimIndent(),
            ).andExpect(status().isBadRequest)

            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(jsonPath("$.rosterOverride.positionTargets.length()").value(1))
                .andExpect(jsonPath("$.rosterOverride.positionTargets[0].positionId").value(setter.toString()))
        }

        test("the same position twice is rejected with 400") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)

            perform(
                MockMvcRequestBuilders.post("/api/events")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        eventBody(
                            "Dup",
                            """
                            {"trackRoster": true, "totalTarget": null, "positionTargets": [
                                {"positionId": "$setter", "count": 2}, {"positionId": "$setter", "count": 3}]}
                            """.trimIndent(),
                        ),
                    ),
                ADMIN_USER_ID,
            ).andExpect(status().isBadRequest)

            eventCountWithTitle("Dup") shouldBe 0
        }

        // The cascade the design calls for: deleting a position drops it from every type default and
        // every event override, and leaves its members Unassigned. Since ADR-0026 all three are
        // foreign keys in one schema — ON DELETE CASCADE for the two target tables, SET NULL for the
        // member profile so the member keeps their name — so this proves one statement does the lot,
        // where it used to prove three ordered writes in PositionService.
        test("deleting a position clears it from type defaults and event overrides, and unassigns its members") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)
            val libero = positionId(LIBERO)
            seedMember(MEMBER_USER_ID, "roster-member@test.com", role = "USER", position = SETTER)
            setTypeDefault(trackRoster = true, totalTarget = 12, targets = mapOf(setter to 2, libero to 1))
            val id = createEvent(
                title = "Cascade",
                rosterOverride = """
                    {"trackRoster": true, "totalTarget": null, "positionTargets": [
                        {"positionId": "$setter", "count": 2}, {"positionId": "$libero", "count": 1}]}
                """.trimIndent(),
            )

            perform(MockMvcRequestBuilders.delete("/api/positions/$setter"), ADMIN_USER_ID)
                .andExpect(status().isNoContent)

            // The setter target is gone from both surfaces; the libero one is untouched.
            perform(MockMvcRequestBuilders.get("/api/event-types"), ADMIN_USER_ID)
                .andExpect(jsonPath("$.eventTypes[?(@.name == 'RosterFixture')].rosterDefault.positionTargets.length()").value(1))
                .andExpect(
                    jsonPath("$.eventTypes[?(@.name == 'RosterFixture')].rosterDefault.positionTargets[0].positionId")
                        .value(libero.toString()),
                )
            perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID)
                .andExpect(jsonPath("$.rosterOverride.positionTargets.length()").value(1))
                .andExpect(jsonPath("$.rosterOverride.positionTargets[0].positionId").value(libero.toString()))

            // The member holding it simply becomes unassigned, and the event keeps its override.
            positionOf(MEMBER_USER_ID) shouldBe null
            trackRosterColumnOf(id) shouldBe true
        }

        test("a non-admin cannot delete a position, so no target is cleared") {
            seedTeamAndAdmin()
            val setter = positionId(SETTER)
            seedMember(MEMBER_USER_ID, "roster-nonadmin@test.com", role = "USER", position = null)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 2))
            roleOf(MEMBER_USER_ID) shouldBe "USER"

            perform(MockMvcRequestBuilders.delete("/api/positions/$setter"), MEMBER_USER_ID)
                .andExpect(status().isForbidden)

            typeTargetCountFor() shouldBe 1
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String) =
        mockMvc.perform(builder.header("X-Team-Id", "public").header("X-User-Id", userId))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun eventBody(title: String, rosterOverride: String?, references: String = "[]"): String = """
        {
          "eventTypeId": "${fixtureTypeId()}",
          "title": "$title",
          "description": null,
          "startTime": "2026-09-01T17:00:00Z",
          "endTime": "2026-09-01T18:30:00Z",
          "location": null,
          "references": $references,
          "rosterOverride": ${rosterOverride ?: "null"}
        }
    """.trimIndent()

    private fun createEvent(title: String, rosterOverride: String?, references: String = "[]"): UUID {
        val response = perform(
            MockMvcRequestBuilders.post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(eventBody(title, rosterOverride, references)),
            ADMIN_USER_ID,
        ).andExpect(status().isCreated).andReturn().response.contentAsString
        return UUID.fromString(Regex("\"id\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1])
    }

    private fun updateEvent(id: UUID, rosterOverride: String?) = perform(
        MockMvcRequestBuilders.put("/api/events/$id")
            .contentType(MediaType.APPLICATION_JSON)
            .content(eventBody("Edited", rosterOverride)),
        ADMIN_USER_ID,
    )

    private fun typeId(name: String): UUID =
        jdbcTemplate.queryForObject("SELECT uuid FROM public.event_types WHERE name = ?", UUID::class.java, name)!!

    // This spec's own event type, so rewriting its roster columns cannot disturb a seeded one that
    // another spec reads. Created on demand and left in place; other specs address types by name.
    private fun fixtureTypeId(): UUID {
        jdbcTemplate.update(
            "INSERT INTO public.event_types (name, color) SELECT ?, '#7B5EA7' " +
                "WHERE NOT EXISTS (SELECT 1 FROM public.event_types WHERE name = ?)",
            TYPE_NAME,
            TYPE_NAME,
        )
        return typeId(TYPE_NAME)
    }

    // No authoring endpoint exists yet (that is step 4), so a type's default is seeded directly. The
    // read path back out is the real one.
    private fun setTypeDefault(trackRoster: Boolean, totalTarget: Int?, targets: Map<UUID, Int>) {
        fixtureTypeId()
        jdbcTemplate.update(
            "UPDATE public.event_types SET track_roster = ?, total_target = ? WHERE name = ?",
            trackRoster,
            totalTarget,
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

    // Positions are tenant rows since ADR-0026, and this spec routes to `public`, so that is where a
    // position has to exist for a target to reference it — event_type_position_targets.position_id is
    // a real foreign key now, and seeding only the platform table would (correctly) be rejected.
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

    private fun totalTargetColumnOf(name: String): Int? =
        jdbcTemplate.queryForObject("SELECT total_target FROM public.event_types WHERE name = ?", Int::class.java, name)

    private fun roleOf(userId: String): String? =
        jdbcTemplate.queryForObject(
            "SELECT role FROM public.team_members WHERE user_id = ?::uuid AND team_id = ?::uuid",
            String::class.java,
            userId,
            TEAM_ID,
        )

    private fun trackRosterColumnOf(id: UUID): Boolean? =
        jdbcTemplate.queryForObject("SELECT roster_track_roster FROM public.events WHERE uuid = ?", Boolean::class.java, id)

    private fun targetCountFor(id: UUID): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.event_position_targets t " +
                "JOIN public.events e ON e.id = t.event_id WHERE e.uuid = ?",
            Long::class.java,
            id,
        )!!

    private fun typeTargetCountFor(): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.event_type_position_targets t " +
                "JOIN public.event_types et ON et.id = t.event_type_id WHERE et.name = ?",
            Long::class.java,
            TYPE_NAME,
        )!!

    private fun eventCountWithTitle(title: String): Long =
        jdbcTemplate.queryForObject("SELECT count(*) FROM public.events WHERE title = ?", Long::class.java, title)!!

    // The tenant's assignment since ADR-0026. The platform column still exists but is no longer
    // maintained, so reading it would assert on a stale copy rather than on what the API did.
    private fun positionOf(userId: String): UUID? =
        jdbcTemplate.queryForObject(
            "SELECT position_id FROM public.member_profiles WHERE user_id = ?::uuid",
            UUID::class.java,
            userId,
        )

    private fun seedTeamAndAdmin() {
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
        seedMember(ADMIN_USER_ID, "roster-admin@test.com", role = "ADMIN", position = null)
    }

    private fun seedMember(userId: String, email: String, role: String, position: String?) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$userId'::uuid, '$email', '$email')
            ON CONFLICT DO NOTHING
            """,
        )
        // execute(), not update(): tb_add_member is a function, so the statement returns a (void) row.
        val label = position?.let { "'$it'" } ?: "NULL"
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, '$role', $label)")
    }
}
