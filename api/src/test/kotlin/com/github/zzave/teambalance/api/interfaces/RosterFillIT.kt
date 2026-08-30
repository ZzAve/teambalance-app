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

// This spec owns its fixtures — its own team, positions and event type — because every IT runs
// against the one shared `public` schema and the one demo team. It puts members on positions and
// answers attendance for them, which the demo roster's own specs assert on.
// Fixture user ids are namespaced `b2190000-…` after this feature's issue (#219). Every IT shares
// one `public` schema and `tb_add_member` is ON CONFLICT DO NOTHING, so two specs claiming the same
// id silently share a member — and whichever seeds first decides their role. That is not
// hypothetical: these specs originally used `…0000d1`-`…0000d3`, which #242 later took for
// EventControllerTest's setters, turning this spec's admin into a plain USER and every admin-gated
// write into a 403. An issue-scoped prefix makes a future collision implausible rather than lucky.
private const val ADMIN_USER_ID = "b2190000-0000-0000-0000-000000000011"
private const val SETTER_USER_ID = "b2190000-0000-0000-0000-000000000012"
private const val SETTER_USER_2_ID = "b2190000-0000-0000-0000-000000000013"
private const val LIBERO_USER_ID = "b2190000-0000-0000-0000-000000000014"
private const val NOPOS_USER_ID = "b2190000-0000-0000-0000-000000000015"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"
private const val SETTER = "Fill Setter"
private const val LIBERO = "Fill Libero"
private const val MIDDLE = "Fill Middle"
private const val TYPE_NAME = "FillFixture"

/**
 * The roster fill end to end (#219, step 2): a stored requirement plus real attendance rows, through
 * the real events payload.
 *
 * [com.github.zzave.teambalance.api.domain.model.RosterFillTest] already pins every status rule as
 * pure arithmetic, so this spec deliberately does NOT re-enumerate them. It proves the wiring that
 * arithmetic can't see:
 *  - that the *effective* requirement really is override-else-type-default, resolved per read, so
 *    editing the default moves an inheriting event and leaves an overriding one alone;
 *  - that only ATTENDING rows in the database feed the counts;
 *  - that positions join by id through a rename;
 *  - and that the list and detail payloads agree.
 */
@AutoConfigureMockMvc
class RosterFillIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("an inheriting event is computed from its type's default, per read") {
            seedTeam()
            val setter = positionId(SETTER)
            val libero = positionId(LIBERO)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            seedMember(LIBERO_USER_ID, "fill-libero@test.com", LIBERO)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 2, libero to 1))
            val id = createEvent("Inherits", rosterOverride = null)
            attend(id, SETTER_USER_ID)
            attend(id, LIBERO_USER_ID)

            // One of two setters: short, but nobody is missing entirely.
            detail(id)
                .andExpect(jsonPath("$.roster.state").value("SPOTS_OPEN"))
                .andExpect(jsonPath("$.roster.openSlots").value(1))
                .andExpect(jsonPath("$.roster.totalAttending").value(2))

            // Editing the TYPE's default moves the inheriting event with it — the whole point of
            // resolving on read rather than copying at write time.
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 1, libero to 1))

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("LINEUP_SET"))
                .andExpect(jsonPath("$.roster.openSlots").value(0))
        }

        test("an overriding event ignores its type's default, and keeps ignoring it when that changes") {
            seedTeam()
            val setter = positionId(SETTER)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 1))
            val id = createEvent(
                "Overrides",
                rosterOverride = """
                    {"trackRoster": true, "totalTarget": null, "positionTargets": [{"positionId": "$setter", "count": 3}]}
                """.trimIndent(),
            )
            attend(id, SETTER_USER_ID)

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("SPOTS_OPEN"))
                .andExpect(jsonPath("$.roster.openSlots").value(2))

            // Move the type default somewhere the override would be visibly dragged to if it were
            // inherited: satisfied, with no targets at all. The overriding event must not notice.
            setTypeDefault(trackRoster = true, totalTarget = 1, targets = emptyMap())

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("SPOTS_OPEN"))
                .andExpect(jsonPath("$.roster.openSlots").value(2))
                // Still the override's own axes: no headcount, one targeted position.
                .andExpect(jsonPath("$.roster.totalTarget").doesNotExist())
                .andExpect(jsonPath("$.roster.positions.length()").value(1))
        }

        // Only ATTENDING fills a slot. A maybe is not a body on the court, and an event whose whole
        // squad answered "maybe" must still read as needing everyone.
        test("only attending rows fill slots — maybe, absent and no-response do not") {
            seedTeam()
            val setter = positionId(SETTER)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            seedMember(SETTER_USER_2_ID, "fill-setter2@test.com", SETTER)
            seedMember(LIBERO_USER_ID, "fill-libero@test.com", LIBERO)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 2))
            val id = createEvent("States", rosterOverride = null)

            attend(id, SETTER_USER_ID, state = "MAYBE")
            attend(id, SETTER_USER_2_ID, state = "ABSENT")
            // LIBERO_USER_ID never answers at all.

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("CRITICAL"))
                .andExpect(jsonPath("$.roster.openSlots").value(2))
                .andExpect(jsonPath("$.roster.totalAttending").value(0))

            attend(id, SETTER_USER_ID, state = "ATTENDING")

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("SPOTS_OPEN"))
                .andExpect(jsonPath("$.roster.totalAttending").value(1))
        }

        // Targets are stored by id, so the label is only ever looked up for display. A rename must
        // therefore carry the target — the case that motivated keying by id in the first place.
        test("a renamed position keeps its target and shows its new label") {
            seedTeam()
            val setter = positionId(SETTER)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 2))
            val id = createEvent("Renamed", rosterOverride = null)
            attend(id, SETTER_USER_ID)

            perform(
                MockMvcRequestBuilders.put("/api/positions/$setter")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"label": "Playmaker"}"""),
                ADMIN_USER_ID,
            ).andExpect(status().isOk)

            detail(id)
                .andExpect(jsonPath("$.roster.positions.length()").value(1))
                .andExpect(jsonPath("$.roster.positions[0].label").value("Playmaker"))
                .andExpect(jsonPath("$.roster.positions[0].required").value(2))
                .andExpect(jsonPath("$.roster.positions[0].attending").value(1))
                .andExpect(jsonPath("$.roster.state").value("SPOTS_OPEN"))

            // Put it back so the shared vocabulary is as this spec's other tests expect.
            perform(
                MockMvcRequestBuilders.put("/api/positions/$setter")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"label": "$SETTER"}"""),
                ADMIN_USER_ID,
            ).andExpect(status().isOk)
        }

        test("unassigned attendees are counted separately and fill no targeted slot") {
            seedTeam()
            val setter = positionId(SETTER)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            seedMember(NOPOS_USER_ID, "fill-nopos@test.com", position = null)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 2))
            val id = createEvent("Unassigned", rosterOverride = null)
            attend(id, SETTER_USER_ID)
            attend(id, NOPOS_USER_ID)

            detail(id)
                .andExpect(jsonPath("$.roster.unassignedAttending").value(1))
                .andExpect(jsonPath("$.roster.totalAttending").value(2))
                // The unpositioned attendee cannot cover the second setter slot.
                .andExpect(jsonPath("$.roster.openSlots").value(1))
                .andExpect(jsonPath("$.roster.positions.length()").value(1))
        }

        // The panel must not become a wall of zeroes on a team with a long vocabulary.
        test("an untargeted position shows only once somebody attending holds it") {
            seedTeam()
            val setter = positionId(SETTER)
            positionId(MIDDLE)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 1))
            val id = createEvent("Sparse", rosterOverride = null)
            attend(id, SETTER_USER_ID)

            detail(id).andExpect(jsonPath("$.roster.positions.length()").value(1))

            seedMember(LIBERO_USER_ID, "fill-libero@test.com", MIDDLE)
            attend(id, LIBERO_USER_ID)

            // Addressed by label, not index: rows follow the position vocabulary's own order, which
            // ListPositions returns alphabetically — an ordering this assertion should not depend on.
            detail(id)
                .andExpect(jsonPath("$.roster.positions.length()").value(2))
                .andExpect(jsonPath("$.roster.positions[?(@.label == '$MIDDLE')].attending").value(1))
                // The Setter row keeps its target; the Middle row appears purely because somebody
                // attending holds it. (That an untargeted row carries a null `required` is pinned in
                // RosterFillTest — a JsonPath filter cannot distinguish a null field from no match.)
                .andExpect(jsonPath("$.roster.positions[?(@.label == '$SETTER')].required").value(1))
        }

        test("a headcount-only requirement drives the status without any position rows") {
            seedTeam()
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            setTypeDefault(trackRoster = true, totalTarget = 3, targets = emptyMap())
            val id = createEvent("Headcount", rosterOverride = null)
            attend(id, SETTER_USER_ID)

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("HEADCOUNT_SHORT"))
                .andExpect(jsonPath("$.roster.openSlots").value(2))
                .andExpect(jsonPath("$.roster.totalTarget").value(3))
        }

        test("tracking on with no targets is a tally, and tracking off yields no panel at all") {
            seedTeam()
            positionId(SETTER)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = emptyMap())
            val id = createEvent("Tally", rosterOverride = null)
            attend(id, SETTER_USER_ID)

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("TALLY_ONLY"))
                .andExpect(jsonPath("$.roster.positions.length()").value(1))
                .andExpect(jsonPath("$.roster.openSlots").value(0))

            setTypeDefault(trackRoster = false, totalTarget = null, targets = emptyMap())

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("OFF"))
                .andExpect(jsonPath("$.roster.trackRoster").value(false))
                .andExpect(jsonPath("$.roster.positions.length()").value(0))
                // Still reports who is coming; it is the panel that is suppressed, not the count.
                .andExpect(jsonPath("$.roster.totalAttending").value(1))
        }

        test("over-fill reads as covered and reports the surplus, without masking a gap elsewhere") {
            seedTeam()
            val setter = positionId(SETTER)
            val libero = positionId(LIBERO)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            seedMember(SETTER_USER_2_ID, "fill-setter2@test.com", SETTER)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 1, libero to 1))
            val id = createEvent("Surplus", rosterOverride = null)
            attend(id, SETTER_USER_ID)
            attend(id, SETTER_USER_2_ID)

            detail(id)
                // Two setters for one slot: covered, +1 surplus…
                .andExpect(jsonPath("$.roster.positions[?(@.label == '$SETTER')].required").value(1))
                .andExpect(jsonPath("$.roster.positions[?(@.label == '$SETTER')].attending").value(2))
                // …but the empty libero still decides the status. Surplus never pays for a gap.
                .andExpect(jsonPath("$.roster.state").value("CRITICAL"))
                .andExpect(jsonPath("$.roster.openSlots").value(1))
        }

        // The card reads the list, the detail page reads the detail; a disagreement between them
        // would show as the chip changing when you tap into an event.
        test("the list payload carries the same roster as the detail payload") {
            seedTeam()
            val setter = positionId(SETTER)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            setTypeDefault(trackRoster = true, totalTarget = 4, targets = mapOf(setter to 2))
            val id = createEvent("Listed", rosterOverride = null)
            attend(id, SETTER_USER_ID)

            perform(MockMvcRequestBuilders.get("/api/events?include-past=true"), ADMIN_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.events[?(@.id == '$id')].roster.state").value("SPOTS_OPEN"))
                .andExpect(jsonPath("$.events[?(@.id == '$id')].roster.openSlots").value(1))
                .andExpect(jsonPath("$.events[?(@.id == '$id')].roster.totalAttending").value(1))

            detail(id)
                .andExpect(jsonPath("$.roster.state").value("SPOTS_OPEN"))
                .andExpect(jsonPath("$.roster.openSlots").value(1))
                .andExpect(jsonPath("$.roster.totalAttending").value(1))
        }

        // Roster config is admin-only, but the panel is read-only for EVERYONE — a player's "is my
        // position covered / am I needed?" is the other half of what it answers.
        test("a non-admin member reads the same roster") {
            seedTeam()
            val setter = positionId(SETTER)
            seedMember(SETTER_USER_ID, "fill-setter@test.com", SETTER)
            setTypeDefault(trackRoster = true, totalTarget = null, targets = mapOf(setter to 2))
            val id = createEvent("Readable", rosterOverride = null)
            attend(id, SETTER_USER_ID)

            perform(MockMvcRequestBuilders.get("/api/events/$id"), SETTER_USER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.roster.state").value("SPOTS_OPEN"))
                .andExpect(jsonPath("$.roster.openSlots").value(1))
        }

        // There is deliberately no IT for "a stale target naming a deleted position": since ADR-0025
        // the targets and the positions share one schema, so event_type_position_targets.position_id
        // is a foreign key with ON DELETE CASCADE and the row cannot outlive the position it names.
        // RosterFillTest still proves the domain ignores an unknown target, as defence in depth.
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String) =
        mockMvc.perform(builder.header("X-Team-Id", "public").header("X-User-Id", userId))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun detail(id: UUID) =
        perform(MockMvcRequestBuilders.get("/api/events/$id"), ADMIN_USER_ID).andExpect(status().isOk)

    private fun createEvent(title: String, rosterOverride: String?): UUID {
        val body = """
            {
              "eventTypeId": "${fixtureTypeId()}",
              "title": "$title",
              "description": null,
              "startTime": "2026-09-01T17:00:00Z",
              "endTime": "2026-09-01T18:30:00Z",
              "location": null,
              "references": [],
              "rosterOverride": ${rosterOverride ?: "null"}
            }
        """.trimIndent()
        val response = perform(
            MockMvcRequestBuilders.post("/api/events").contentType(MediaType.APPLICATION_JSON).content(body),
            ADMIN_USER_ID,
        ).andExpect(status().isCreated).andReturn().response.contentAsString
        return UUID.fromString(Regex("\"id\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1])
    }

    // Through the real attendance endpoint, so the counts are folded from real rows.
    private fun attend(eventId: UUID, userId: String, state: String = "ATTENDING") {
        perform(
            MockMvcRequestBuilders.put("/api/events/$eventId/attendances/$userId")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"state": "$state"}"""),
            ADMIN_USER_ID,
        ).andExpect(status().isOk)
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

    // No authoring endpoint yet (step 4), so the type's default is seeded directly; every read of it
    // back out goes through the real resolution path.
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

    // Positions are tenant rows since ADR-0025, and this spec's team routes to `public`, so that is
    // where a position has to exist for a target to reference it — event_type_position_targets
    // .position_id is a real foreign key now, and seeding only the platform table would be rejected.
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
        seedMember(ADMIN_USER_ID, "fill-admin@test.com", position = null, role = "ADMIN")
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
        // tb_add_member is ON CONFLICT DO NOTHING, so a member this spec already seeded keeps their
        // original position. Re-assert it, since these tests move members between positions.
        if (position != null) {
            jdbcTemplate.update(
                "UPDATE public.member_profiles SET position_id = " +
                    "(SELECT id FROM public.positions WHERE lower(label) = lower(?)) WHERE user_id = ?::uuid",
                position,
                userId,
            )
        }
    }
}
