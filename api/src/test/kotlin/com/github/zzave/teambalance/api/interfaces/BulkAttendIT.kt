package com.github.zzave.teambalance.api.interfaces

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

/**
 * Bulk Attend (ADR-0020) is defined entirely by what the server *refuses* to touch, so the guard is
 * what these tests pin down: it may only ever INSERT — never UPDATE — and only for events that have
 * not started. The client names the ids ("currently shown"); everything else is the server's job.
 *
 * Follows AttendanceAuthorizationIT's cross-team pattern: the caller's team id comes from their own
 * membership while the events live in the `public`-pinned schema (the X-Team-Id test shim), so the
 * membership gate can be exercised independently of tenant routing.
 */
@AutoConfigureMockMvc
class BulkAttendIT : TeamBalanceIT() {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var jdbcTemplate: JdbcTemplate
    @Autowired lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private val mapper = ObjectMapper()

    init {
        test("creates rows only for unanswered future events and returns exactly those ids") {
            provision()
            val teamId = UUID.randomUUID()
            val caller = newTeamMember(teamId, "bulk-caller@test.com", "Bea Bulk")

            val futureBlankA = insertEvent(caller, FUTURE)
            val futureBlankB = insertEvent(caller, FUTURE)
            // A deliberate Absent (injury, holiday) — a real row, so it must survive untouched.
            val futureAnswered = insertEvent(caller, FUTURE)
            insertAttendance(futureAnswered, caller, "ABSENT")
            // Already started: skipped even though the member never responded.
            val pastBlank = insertEvent(caller, PAST)

            val created = bulkAttend(
                caller,
                caller,
                listOf(futureBlankA, futureBlankB, futureAnswered, pastBlank),
            )

            created shouldBe setOf(futureBlankA.toString(), futureBlankB.toString())

            stateOf(futureBlankA, caller) shouldBe "ATTENDING"
            stateOf(futureBlankB, caller) shouldBe "ATTENDING"
            // Non-destructive: the deliberate Absent was never overwritten.
            stateOf(futureAnswered, caller) shouldBe "ABSENT"
            // Future-only: nothing written for an event that already started.
            stateOf(pastBlank, caller) shouldBe null
        }

        test("a re-tap creates nothing when every shown event is already answered") {
            provision()
            val teamId = UUID.randomUUID()
            val caller = newTeamMember(teamId, "bulk-retap@test.com", "Rex Retap")
            val event = insertEvent(caller, FUTURE)

            bulkAttend(caller, caller, listOf(event)) shouldBe setOf(event.toString())
            // The button stays safe to re-tap: the second pass finds a row and skips it.
            bulkAttend(caller, caller, listOf(event)) shouldBe emptySet()
            attendanceRowCount(event, caller) shouldBe 1
        }

        test("undo deletes exactly the rows just created and repeats idempotently") {
            provision()
            val teamId = UUID.randomUUID()
            val caller = newTeamMember(teamId, "bulk-undo@test.com", "Ursula Undo")

            val blank = insertEvent(caller, FUTURE)
            val answered = insertEvent(caller, FUTURE)
            insertAttendance(answered, caller, "MAYBE")

            val created = bulkAttend(caller, caller, listOf(blank, answered))
            created shouldBe setOf(blank.toString())

            // Undo carries back only what was created, so the pre-existing Maybe is out of its reach.
            bulkUndo(caller, caller, created.map(UUID::fromString)) shouldBe setOf(blank.toString())
            stateOf(blank, caller) shouldBe null
            stateOf(answered, caller) shouldBe "MAYBE"

            // Idempotent: a repeated Undo deletes nothing and still succeeds.
            bulkUndo(caller, caller, created.map(UUID::fromString)) shouldBe emptySet()
            stateOf(blank, caller) shouldBe null
            stateOf(answered, caller) shouldBe "MAYBE"
        }

        test("bulk attend for a fellow team member succeeds (trust-based, ADR-0003)") {
            provision()
            val teamId = UUID.randomUUID()
            val caller = newTeamMember(teamId, "bulk-editor@test.com", "Ed Editor")
            val teammate = joinTeam(teamId, "bulk-mate@test.com", "Tina Teammate")
            val event = insertEvent(caller, FUTURE)

            // No self-only check: the target may be any active member of the caller's team.
            bulkAttend(caller, teammate, listOf(event)) shouldBe setOf(event.toString())
            stateOf(event, teammate) shouldBe "ATTENDING"
            // Attribution stays with the caller who pressed the button.
            changedByOf(event, teammate) shouldBe caller
        }

        test("bulk attend for a user outside the caller's team is rejected with 403") {
            provision()
            val callerTeam = UUID.randomUUID()
            val caller = newTeamMember(callerTeam, "bulk-in@test.com", "Ivy Insider")
            val outsider = newTeamMember(UUID.randomUUID(), "bulk-out@test.com", "Otto Outsider")
            val event = insertEvent(caller, FUTURE)

            // Trust-based stops at the team boundary — requireMember still gates the batch path.
            val result = perform(
                MockMvcRequestBuilders.post(BATCH_PATH),
                caller,
                """{"userId":"$outsider","eventIds":["$event"],"state":"ATTENDING"}""",
            )
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("NO_TEAM_MEMBERSHIP"))

            attendanceRowCount(event, outsider) shouldBe 0
        }
    }

    private fun bulkAttend(caller: String, target: String, eventIds: List<UUID>): Set<String> =
        eventIdsOf(
            perform(
                MockMvcRequestBuilders.post(BATCH_PATH),
                caller,
                """{"userId":"$target","eventIds":${eventIds.jsonArray()},"state":"ATTENDING"}""",
            ),
        )

    private fun bulkUndo(caller: String, target: String, eventIds: List<UUID>): Set<String> =
        eventIdsOf(
            perform(
                MockMvcRequestBuilders.delete(BATCH_PATH),
                caller,
                """{"userId":"$target","eventIds":${eventIds.jsonArray()}}""",
            ),
        )

    private fun perform(
        builder: org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder,
        caller: String,
        body: String,
    ): MvcResult = mockMvc.perform(
        builder
            .contentType(MediaType.APPLICATION_JSON)
            .content(body)
            .header("X-Team-Id", "public")
            .header("X-User-Id", caller),
    ).andExpect(MockMvcResultMatchers.request().asyncStarted()).andReturn()

    private fun eventIdsOf(result: MvcResult): Set<String> {
        val response = mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn().response.contentAsString
        return mapper.readTree(response)["eventIds"].map { it.asText() }.toSet()
    }

    private fun List<UUID>.jsonArray() = joinToString(prefix = "[", postfix = "]") { "\"$it\"" }

    private fun provision() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
    }

    private fun newTeamMember(teamId: UUID, email: String, name: String): String {
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$teamId'::uuid, 'Team $teamId', 'bulk-$teamId', 'bulk-$teamId')
            ON CONFLICT DO NOTHING
            """,
        )
        return joinTeam(teamId, email, name)
    }

    private fun joinTeam(teamId: UUID, email: String, name: String): String {
        val userId = UUID.randomUUID().toString()
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) VALUES ('$userId'::uuid, '$email', '$name') " +
                "ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$teamId'::uuid, '$userId'::uuid, 'USER', 'Setter')")
        return userId
    }

    private fun insertEvent(createdBy: String, startTime: String): UUID {
        val eventId = UUID.randomUUID()
        jdbcTemplate.execute(
            """
            INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
            VALUES ('$eventId'::uuid,
                (SELECT id FROM public.event_types WHERE name = 'Training'),
                'Bulk Test', '$startTime', '$startTime', '$createdBy'::uuid, now(), now())
            """,
        )
        return eventId
    }

    private fun insertAttendance(eventId: UUID, userId: String, state: String) {
        jdbcTemplate.execute(
            """
            INSERT INTO public.attendances (uuid, event_id, user_id, state, updated_at, changed_by)
            VALUES (gen_random_uuid(),
                (SELECT id FROM public.events WHERE uuid = '$eventId'::uuid),
                '$userId'::uuid, '$state', now(), '$userId'::uuid)
            """,
        )
    }

    private fun stateOf(eventId: UUID, userId: String): String? =
        jdbcTemplate.queryForList(
            "SELECT a.state FROM public.attendances a JOIN public.events e ON e.id = a.event_id " +
                "WHERE e.uuid = '$eventId'::uuid AND a.user_id = '$userId'::uuid",
            String::class.java,
        ).firstOrNull()

    private fun changedByOf(eventId: UUID, userId: String): String? =
        jdbcTemplate.queryForList(
            "SELECT a.changed_by FROM public.attendances a JOIN public.events e ON e.id = a.event_id " +
                "WHERE e.uuid = '$eventId'::uuid AND a.user_id = '$userId'::uuid",
            String::class.java,
        ).firstOrNull()

    private fun attendanceRowCount(eventId: UUID, userId: String): Int =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.attendances a JOIN public.events e ON e.id = a.event_id " +
                "WHERE e.uuid = '$eventId'::uuid AND a.user_id = '$userId'::uuid",
            Long::class.java,
        )!!.toInt()

    private companion object {
        const val BATCH_PATH = "/api/attendances/batch"
        const val FUTURE = "2050-07-01 20:00:00+00"
        const val PAST = "2020-07-01 20:00:00+00"
    }
}
