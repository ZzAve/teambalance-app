package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import com.github.zzave.teambalance.api.infrastructure.persistence.FAULT_INJECTED_TITLE
import com.github.zzave.teambalance.api.infrastructure.persistence.FaultInjectingEventRepositoryConfig
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

private const val ADMIN_USER_ID = "b0000000-0000-0000-0000-0000000000f1"

// teams.schema_name is UNIQUE, so every IT that routes to the `public` tenant shares this one team.
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

private const val HEALTHY_TITLE = "Healthy Series"

/**
 * The transactional boundary around a multi-step Event write, proven through the REST boundary.
 *
 * `createRecurringEvents` materializes N occurrences with N separate adapter `save` calls. If no
 * transaction spans them, Spring Data's own per-call transaction commits each save individually and
 * a mid-batch failure leaves a half-written series behind — verified: without a boundary this test
 * finds 2 of 4 rows instead of none.
 *
 * Safety net for #20 (framework-free EventService): it must hold identically whether the boundary
 * comes from `@Transactional` on the service or from the transaction-runner port.
 */
@AutoConfigureMockMvc
@Import(FaultInjectingEventRepositoryConfig::class)
class EventTransactionBoundaryIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        test("a recurring-series create that fails midway persists nothing") {
            seedTeamAndAdmin()
            clearSeason()

            // WEEKLY Tue + Thu, 2026-09-01 → 2026-09-10 ⇒ 4 occurrences, so the batch is still
            // running when save #3 blows up and two rows have already been written.
            postRecurringSeries(FAULT_INJECTED_TITLE).andExpect(MockMvcResultMatchers.status().isBadRequest)

            countOfEvents(FAULT_INJECTED_TITLE) shouldBe 0
        }

        test("the same series creates all four occurrences once the injected failure is out of range") {
            seedTeamAndAdmin()
            clearSeason()

            // Same request shape, a title the fault injector ignores — proves the batch really does
            // write four rows, so the zero above is a rollback and not a request that never got going.
            postRecurringSeries(HEALTHY_TITLE).andExpect(MockMvcResultMatchers.status().isCreated)

            countOfEvents(HEALTHY_TITLE) shouldBe 4
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun postRecurringSeries(title: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/recurring-events")
                .header("X-Team-Id", "public")
                .header("X-User-Id", ADMIN_USER_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "eventTypeId": "${trainingTypeId()}",
                      "title": "$title",
                      "description": null,
                      "location": "Gym",
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
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun countOfEvents(title: String): Long =
        jdbcTemplate.queryForObject("SELECT count(*) FROM public.events WHERE title = ?", Long::class.java, title)!!

    private fun trainingTypeId(): UUID =
        jdbcTemplate.queryForObject("SELECT uuid FROM public.event_types WHERE name = 'Training'", UUID::class.java)!!

    private fun clearSeason() =
        jdbcTemplate.update("UPDATE public.team_settings SET season_start = NULL, season_end = NULL WHERE id = 1")

    private fun seedTeamAndAdmin() {
        tenantSchemaManager.provisionPlatformSchema()
        tenantSchemaManager.provisionTenantSchema("public")
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, sport, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$ADMIN_USER_ID'::uuid, 'txn-admin@test.com', 'Txn Admin')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute(
            "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$ADMIN_USER_ID'::uuid, 'ADMIN', 'Setter')",
        )
    }
}
