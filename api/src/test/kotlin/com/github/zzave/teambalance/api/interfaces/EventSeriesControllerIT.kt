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
import java.util.UUID

private const val ADMIN_USER_ID = "b0000000-0000-0000-0000-0000000000e1"
private const val MEMBER_USER_ID = "b0000000-0000-0000-0000-0000000000e2"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

/**
 * Level-3 series edit/delete over a materialized series (ADR-0014, Phase 3). Proves the exact
 * row/group outcome of each scope against a real Postgres — the transactional wiring the pure
 * [com.github.zzave.teambalance.api.domain.model.SeriesModificationTest] cannot reach: that the
 * split reassigns real rows, that a bulk edit keeps each occurrence's own calendar date while a
 * changed time-of-day propagates, that a delete never splits, and that season grandfathering
 * still holds. The clock zone is Europe/Amsterdam, so a September 18:30Z start reads as 20:30 local.
 */
@AutoConfigureMockMvc
class EventSeriesControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        // ── EDIT ─────────────────────────────────────────────────────────────

        test("PUT scope=THIS on a middle occurrence detaches it, regroups the tail, keeps the head") {
            seedTeamAndAdmin()
            resetSeason()
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "THIS-mid")
            val e1 = ev[0]
            val e2 = ev[1]
            val e3 = ev[2]
            val e4 = ev[3]

            // Edit the 2nd of four; THIS may also move its date (to 2026-09-09 19:00 local).
            perform(
                MockMvcRequestBuilders.put("/api/events/$e2?scope=THIS")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editBody(title = "Detached", start = "2026-09-09T17:00:00Z", end = "2026-09-09T18:30:00Z")),
                ADMIN_USER_ID,
            )
                .andExpect(MockMvcResultMatchers.status().isOk)
                // Only the target is "affected" — the tail is merely regrouped, not edited.
                .andExpect(MockMvcResultMatchers.jsonPath("$.events.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].id").value(e2.toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].title").value("Detached"))

            groupOf(e2) shouldBe null // detached
            titleOf(e2) shouldBe "Detached"
            groupOf(e1) shouldBe group // head kept
            titleOf(e1) shouldBe "THIS-mid"

            // The tail (e3, e4) shares one fresh group, distinct from the original and non-null.
            val tail = groupOf(e3)
            tail.shouldNotBeNull()
            tail shouldBe groupOf(e4)
            (tail == group) shouldBe false
            titleOf(e3) shouldBe "THIS-mid" // tail is regrouped, not re-titled
        }

        test("PUT scope=THIS on the first occurrence regroups the whole tail, and on the last leaves no tail") {
            seedTeamAndAdmin()
            resetSeason()

            val gFirst = UUID.randomUUID()
            val ev = seedSeries(gFirst, "THIS-first")
            val f1 = ev[0]
            val f2 = ev[1]
            val f3 = ev[2]
            val f4 = ev[3]
            perform(
                MockMvcRequestBuilders.put("/api/events/$f1?scope=THIS")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editBody(title = "First detached", start = "2026-09-01T17:00:00Z", end = "2026-09-01T18:30:00Z")),
                ADMIN_USER_ID,
            ).andExpect(MockMvcResultMatchers.status().isOk)
            groupOf(f1) shouldBe null
            val tail = groupOf(f2)
            tail.shouldNotBeNull()
            listOf(f3, f4).forEach { groupOf(it) shouldBe tail }
            (tail == gFirst) shouldBe false

            val gLast = UUID.randomUUID()
            val evLast = seedSeries(gLast, "THIS-last")
            val l1 = evLast[0]
            val l4 = evLast[3]
            perform(
                MockMvcRequestBuilders.put("/api/events/$l4?scope=THIS")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editBody(title = "Last detached", start = "2026-09-22T17:00:00Z", end = "2026-09-22T18:30:00Z")),
                ADMIN_USER_ID,
            ).andExpect(MockMvcResultMatchers.status().isOk)
            groupOf(l4) shouldBe null
            groupOf(l1) shouldBe gLast // head untouched, no tail to regroup
        }

        test("PUT scope=THIS_AND_FOLLOWING moves target+following to a new group, propagates time but not date") {
            seedTeamAndAdmin()
            resetSeason()
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "FOLLOWING")
            val e1 = ev[0]
            val e2 = ev[1]
            val e3 = ev[2]
            val e4 = ev[3]

            // Edit e2 onward, moving the wall-clock time 20:30 → 19:00 local (17:00Z in CEST).
            perform(
                MockMvcRequestBuilders.put("/api/events/$e2?scope=THIS_AND_FOLLOWING")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editBody(title = "Tail edited", start = "2026-09-08T17:00:00Z", end = "2026-09-08T18:30:00Z")),
                ADMIN_USER_ID,
            )
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.events.length()").value(3))

            // Head kept as-is.
            groupOf(e1) shouldBe group
            titleOf(e1) shouldBe "FOLLOWING"
            startAt(e1) shouldBe "2026-09-01 18:30:00+00" // 20:30 local, unmoved

            // Target + following: one fresh group, edited, time-of-day propagated…
            val newGroup = groupOf(e2)
            newGroup.shouldNotBeNull()
            (newGroup == group) shouldBe false
            listOf(e2, e3, e4).forEach {
                groupOf(it) shouldBe newGroup
                titleOf(it) shouldBe "Tail edited"
            }
            // …but each keeps its OWN calendar date — only the time-of-day (→17:00Z) changed.
            startAt(e2) shouldBe "2026-09-08 17:00:00+00"
            startAt(e3) shouldBe "2026-09-15 17:00:00+00"
            startAt(e4) shouldBe "2026-09-22 17:00:00+00"
        }

        test("PUT scope=ALL edits every occurrence, keeps the group, keeps each own date") {
            seedTeamAndAdmin()
            resetSeason()
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "ALL")
            val e1 = ev[0]
            val e2 = ev[1]
            val e3 = ev[2]
            val e4 = ev[3]

            // Drive the edit from a middle occurrence to prove ALL reaches the whole group either way.
            perform(
                MockMvcRequestBuilders.put("/api/events/$e3?scope=ALL")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editBody(title = "Whole series", start = "2026-09-15T17:00:00Z", end = "2026-09-15T18:30:00Z")),
                ADMIN_USER_ID,
            )
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.events.length()").value(4))

            listOf(e1, e2, e3, e4).forEach {
                groupOf(it) shouldBe group // no split
                titleOf(it) shouldBe "Whole series"
            }
            startAt(e1) shouldBe "2026-09-01 17:00:00+00"
            startAt(e2) shouldBe "2026-09-08 17:00:00+00"
            startAt(e4) shouldBe "2026-09-22 17:00:00+00"
        }

        // ── DELETE (never splits) ─────────────────────────────────────────────

        test("DELETE scope=THIS removes only the target; survivors keep their group (no split)") {
            seedTeamAndAdmin()
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "DEL-this")
            val e1 = ev[0]
            val e2 = ev[1]
            val e3 = ev[2]
            val e4 = ev[3]

            perform(MockMvcRequestBuilders.delete("/api/events/$e2?scope=THIS"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            exists(e2) shouldBe false
            listOf(e1, e3, e4).forEach {
                exists(it) shouldBe true
                groupOf(it) shouldBe group // untouched — a delete never regroups survivors
            }
        }

        test("DELETE scope=THIS_AND_FOLLOWING removes the target and every later occurrence") {
            seedTeamAndAdmin()
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "DEL-following")
            val e1 = ev[0]
            val e2 = ev[1]
            val e3 = ev[2]
            val e4 = ev[3]

            perform(MockMvcRequestBuilders.delete("/api/events/$e3?scope=THIS_AND_FOLLOWING"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            listOf(e1, e2).forEach { exists(it) shouldBe true; groupOf(it) shouldBe group }
            listOf(e3, e4).forEach { exists(it) shouldBe false }
        }

        test("DELETE scope=ALL removes every occurrence in the group") {
            seedTeamAndAdmin()
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "DEL-all")
            val e1 = ev[0]
            val e2 = ev[1]
            val e3 = ev[2]
            val e4 = ev[3]

            perform(MockMvcRequestBuilders.delete("/api/events/$e2?scope=ALL"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            listOf(e1, e2, e3, e4).forEach { exists(it) shouldBe false }
        }

        // ── Season grandfathering across a bulk scope ─────────────────────────

        test("PUT scope=ALL changing only the title grandfathers a whole series that sits outside a shrunk season") {
            seedTeamAndAdmin()
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "GRANDFATHER")
            val e1 = ev[0]
            val e2 = ev[1]
            val e3 = ev[2]
            val e4 = ev[3]
            // Window set AFTER creation, excluding every occurrence.
            setSeason("2027-01-01", "2027-04-30")
            try {
                // Same start as stored (20:30 local = 18:30Z) ⇒ no start moves ⇒ grandfathered.
                perform(
                    MockMvcRequestBuilders.put("/api/events/$e1?scope=ALL")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(editBody(title = "Renamed in place", start = "2026-09-01T18:30:00Z", end = "2026-09-01T20:00:00Z")),
                    ADMIN_USER_ID,
                )
                    .andExpect(MockMvcResultMatchers.status().isOk)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.events.length()").value(4))

                listOf(e1, e2, e3, e4).forEach { titleOf(it) shouldBe "Renamed in place" }
                startAt(e2) shouldBe "2026-09-08 18:30:00+00" // unchanged
            } finally {
                resetSeason()
            }
        }

        test("PUT scope=ALL that moves the time-of-day of an out-of-season series is rejected with 422") {
            seedTeamAndAdmin()
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "GRANDFATHER-move")
            val e1 = ev[0]
            setSeason("2027-01-01", "2027-04-30")
            try {
                // Changing the time-of-day moves every start ⇒ season validation fires ⇒ rejected.
                perform(
                    MockMvcRequestBuilders.put("/api/events/$e1?scope=ALL")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(editBody(title = "Moved time", start = "2026-09-01T17:00:00Z", end = "2026-09-01T18:30:00Z")),
                    ADMIN_USER_ID,
                )
                    .andExpect(MockMvcResultMatchers.status().isUnprocessableContent)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("EVENT_OUTSIDE_SEASON"))

                // All-or-nothing: the rejected transaction left the series untouched.
                titleOf(e1) shouldBe "GRANDFATHER-move"
            } finally {
                resetSeason()
            }
        }

        // ── Auth + missing target ─────────────────────────────────────────────

        test("PUT with a scope by a non-admin member is rejected with 403") {
            seedTeamAndAdmin()
            resetSeason()
            seedMember(MEMBER_USER_ID, "series-member@test.com", role = "USER")
            val group = UUID.randomUUID()
            val ev = seedSeries(group, "AUTH")
            val e2 = ev[1]

            perform(
                MockMvcRequestBuilders.put("/api/events/$e2?scope=ALL")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(editBody(title = "Nope", start = "2026-09-08T17:00:00Z", end = "2026-09-08T18:30:00Z")),
                MEMBER_USER_ID,
            ).andExpect(MockMvcResultMatchers.status().isForbidden)

            titleOf(e2) shouldBe "AUTH" // unchanged
        }

        test("DELETE scope=ALL on an unknown id is a 404") {
            seedTeamAndAdmin()
            perform(MockMvcRequestBuilders.delete("/api/events/${UUID.randomUUID()}?scope=ALL"), ADMIN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun perform(builder: MockHttpServletRequestBuilder, userId: String) =
        mockMvc.perform(builder.header("X-Team-Id", "public").header("X-User-Id", userId))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    // Four weekly occurrences (Tuesdays 2026-09-01, 08, 15, 22) at 20:30 local (18:30Z, CEST),
    // 90 minutes long, sharing [group]. Returned in chronological order.
    private fun seedSeries(group: UUID, title: String): List<UUID> =
        listOf("2026-09-01", "2026-09-08", "2026-09-15", "2026-09-22").map { date ->
            val id = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, recurring_group, created_by, created_at, updated_at)
                VALUES ('$id'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Training'),
                    '$title', '$date 18:30:00+00', '$date 20:00:00+00', '$group'::uuid,
                    '$ADMIN_USER_ID'::uuid, now(), now())
                """,
            )
            id
        }

    private fun editBody(title: String, start: String, end: String): String {
        val eventTypeId = trainingTypeId()
        return """
            {
              "eventTypeId": "$eventTypeId",
              "title": "$title",
              "description": null,
              "startTime": "$start",
              "endTime": "$end",
              "location": null
            }
        """.trimIndent()
    }

    private fun trainingTypeId(): UUID =
        jdbcTemplate.queryForObject("SELECT uuid FROM public.event_types WHERE name = 'Training'", UUID::class.java)!!

    private fun groupOf(id: UUID): UUID? =
        jdbcTemplate.queryForObject("SELECT recurring_group FROM public.events WHERE uuid = ?", UUID::class.java, id)

    private fun titleOf(id: UUID): String =
        jdbcTemplate.queryForObject("SELECT title FROM public.events WHERE uuid = ?", String::class.java, id)!!

    // start_time rendered as a UTC wall-clock string, so date-preservation vs time-propagation is exact.
    private fun startAt(id: UUID): String =
        jdbcTemplate.queryForObject(
            "SELECT to_char(start_time AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') || '+00' FROM public.events WHERE uuid = ?",
            String::class.java,
            id,
        )!!

    private fun exists(id: UUID): Boolean =
        jdbcTemplate.queryForObject("SELECT count(*) FROM public.events WHERE uuid = ?", Long::class.java, id)!! > 0

    private fun setSeason(start: String?, end: String?) {
        jdbcTemplate.update(
            "UPDATE public.team_settings SET season_start = ?::date, season_end = ?::date WHERE id = 1",
            start,
            end,
        )
    }

    private fun resetSeason() = setSeason(null, null)

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
        seedMember(ADMIN_USER_ID, "series-admin@test.com", role = "ADMIN")
    }

    private fun seedMember(userId: String, email: String, role: String) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$userId'::uuid, '$email', '$email')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$userId'::uuid, '$role', 'Setter')")
    }
}
