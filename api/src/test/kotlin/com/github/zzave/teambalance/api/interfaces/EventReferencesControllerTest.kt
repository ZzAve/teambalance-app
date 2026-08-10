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
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

/**
 * References (ADR-0016) end-to-end through the event write path: persistence + ordering, the
 * http/https-only guard surfacing as a 400 (fail-closed, nothing created), and PUT replace-semantics.
 * Kept separate from EventControllerTest so neither class trips detekt's LargeClass rule.
 */
@AutoConfigureMockMvc
class EventReferencesControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private fun seedAdminTeam() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public')
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
    }

    private fun matchEventTypeId(): UUID =
        jdbcTemplate.queryForObject("SELECT uuid FROM public.event_types WHERE name = 'Match'", UUID::class.java)!!

    init {
        test("POST /api/events persists references in order, including a null title") {
            seedAdminTeam()
            val eventTypeId = matchEventTypeId()

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "Refs Order Target",
                          "startTime": "2026-09-26T14:00:00Z",
                          "endTime": "2026-09-26T16:00:00Z",
                          "references": [
                            { "title": "Nevobo", "url": "https://api.nevobo.nl/permalink/wedstrijd/2018133" },
                            { "title": null, "url": "https://dwf.volleybal.nl/match/42" }
                          ]
                        }
                        """.trimIndent()
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.references.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.references[0].title").value("Nevobo"))
                // A blank/absent title is stored as null and serialised as absent, not "".
                .andExpect(MockMvcResultMatchers.jsonPath("$.references[1].title").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.references[1].url").value("https://dwf.volleybal.nl/match/42"))

            // Proof of persistence + ordering in the child table — scoped to this test's event so the
            // shared 'public' schema's other events don't pollute the assertion.
            val rows = jdbcTemplate.queryForList(
                """
                SELECT r.title, r.url, r.position
                FROM public.event_references r
                JOIN public.events e ON e.id = r.event_id
                WHERE e.title = 'Refs Order Target'
                ORDER BY r.position
                """.trimIndent()
            )
            rows.size shouldBe 2
            rows[0]["title"] shouldBe "Nevobo"
            rows[0]["position"] shouldBe 0
            rows[1]["title"] shouldBe null
            rows[1]["url"] shouldBe "https://dwf.volleybal.nl/match/42"
        }

        test("POST /api/events with a non-http reference url is rejected with 400 and creates nothing") {
            seedAdminTeam()
            val eventTypeId = matchEventTypeId()

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/events")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "eventTypeId": "$eventTypeId",
                          "title": "Should not persist refs",
                          "startTime": "2026-09-26T14:00:00Z",
                          "endTime": "2026-09-26T16:00:00Z",
                          "references": [
                            { "title": "xss", "url": "javascript:alert(1)" }
                          ]
                        }
                        """.trimIndent()
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)

            // Fail-closed: the invalid URL is rejected while assembling the request, before the event
            // is ever created — no partial event, no orphaned references.
            val count = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.events WHERE title = 'Should not persist refs'",
                Long::class.java,
            )
            count shouldBe 0L
        }

        test("PUT /api/events/{id} replaces the full reference set") {
            seedAdminTeam()
            val eventTypeId = matchEventTypeId()

            val eventId = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO public.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM public.event_types WHERE name = 'Match'),
                    'Refs Replace Target', '2026-09-26 14:00:00+00', '2026-09-26 16:00:00+00',
                    '$JAN_USER_ID'::uuid, now(), now())
            """
            )
            val techId = jdbcTemplate.queryForObject(
                "SELECT id FROM public.events WHERE uuid = '$eventId'::uuid",
                Long::class.java,
            )
            jdbcTemplate.execute(
                "INSERT INTO public.event_references (event_id, position, title, url) " +
                    "VALUES ($techId, 0, 'Old A', 'https://old-a.example.com/')"
            )
            jdbcTemplate.execute(
                "INSERT INTO public.event_references (event_id, position, title, url) " +
                    "VALUES ($techId, 1, 'Old B', 'https://old-b.example.com/')"
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
                          "title": "Refs Replace Target",
                          "startTime": "2026-09-26T14:00:00Z",
                          "endTime": "2026-09-26T16:00:00Z",
                          "references": [
                            { "title": "New Only", "url": "https://new.example.com/" }
                          ]
                        }
                        """.trimIndent()
                    ),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                // UpdateEvent now returns an EventList of affected occurrences (ADR-0014 Phase 3).
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].references.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].references[0].title").value("New Only"))

            // The two old references are gone; only the new set remains (replace-semantics).
            val rows = jdbcTemplate.queryForList(
                "SELECT title, url FROM public.event_references WHERE event_id = $techId ORDER BY position"
            )
            rows.size shouldBe 1
            rows[0]["title"] shouldBe "New Only"
            rows[0]["url"] shouldBe "https://new.example.com/"
        }
    }
}
