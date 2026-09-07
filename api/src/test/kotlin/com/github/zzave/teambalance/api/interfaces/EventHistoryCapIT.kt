package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import io.kotest.matchers.shouldBe
import jakarta.persistence.EntityManagerFactory
import org.hibernate.SessionFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

// Spec-dedicated ids and, unusually, a spec-dedicated tenant schema: this spec asserts an EXACT row
// count for the whole tenant, which no spec sharing `public` could ever do.
private const val TEAM_ID = "a0000000-0000-0000-0000-0000000000ca"
private const val USER_ID = "b0000000-0000-0000-0000-0000000000ca"
private const val SCHEMA = "team_event_cap"

private val CAP = EventService.EVENT_HISTORY_CAP

// Comfortably past the cap, and past CAP + 1 as well. The margin is the point: with the limit in
// SQL, Hibernate loads CAP + 1 rows however many are in the table; with a `.take(CAP)` applied after
// `findAllByOrderByStartTimeDesc()` it would load all of them. Seeding only CAP + 1 would make both
// implementations load the same number of rows and the assertion below would prove nothing.
private const val SEEDED_EVENTS = 510

/**
 * The cap on `include-past=true` (#310), against real Postgres.
 *
 * Two claims, and the second is the one that is easy to fake: the endpoint returns the CAP most
 * recent events, **and** the bound reached SQL. Nothing about a truncated response distinguishes a
 * `LIMIT` from a Kotlin `.take()` after the fact — the latter has already paid the cost the cap
 * exists to avoid — so the load count is asserted directly.
 */
@AutoConfigureMockMvc
class EventHistoryCapIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var entityManagerFactory: EntityManagerFactory

    init {
        test("include-past returns the cap's worth of events, newest first, dropping the oldest history") {
            seedEvents()

            listPastEvents()
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.events.length()").value(CAP))
                // Event 0 is the newest and Event ${SEEDED_EVENTS - 1} the oldest, so this pins both
                // the ordering and which end of the history the cap cuts off.
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[0].title").value("Event 0"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[${CAP - 1}].title").value("Event ${CAP - 1}"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[?(@.title == 'Event $CAP')]").doesNotExist())
        }

        test("the cap is applied in SQL: only CAP + 1 event rows are ever loaded") {
            seedEvents()

            val rowsLoaded = countingEventRowLoads { listPastEvents() }

            // CAP + 1, not CAP: the extra row is what tells "exactly at the cap" from "over it"
            // without a second count() query. And not $SEEDED_EVENTS, which is what a post-fetch
            // `.take()` would have loaded.
            rowsLoaded shouldBe (CAP + 1).toLong()
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun listPastEvents() =
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/events?include-past=true")
                .header("X-Team-Id", SCHEMA)
                .header("X-User-Id", USER_ID),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    /** Event rows Hibernate actually materialized while [block] ran — the whole point of the fix. */
    private fun countingEventRowLoads(block: () -> Unit): Long {
        val statistics = entityManagerFactory.unwrap(SessionFactory::class.java).statistics
        val wasEnabled = statistics.isStatisticsEnabled
        statistics.isStatisticsEnabled = true
        statistics.clear()
        try {
            block()
            return statistics.getEntityStatistics(EventJpaEntity::class.java.name).loadCount
        } finally {
            statistics.isStatisticsEnabled = wasEnabled
        }
    }

    private fun seedEvents() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema(SCHEMA)
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Cap Team', 'cap-team', '$SCHEMA')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$USER_ID'::uuid, 'cap-member@test.com', 'Cap Member')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$USER_ID'::uuid, 'ADMIN', 'Setter')")

        // Rebuilt every test so the exact counts below hold whichever tests ran before.
        jdbcTemplate.update("DELETE FROM $SCHEMA.events")
        jdbcTemplate.update(
            """
            INSERT INTO $SCHEMA.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
            SELECT gen_random_uuid(),
                   (SELECT id FROM $SCHEMA.event_types WHERE name = 'Training'),
                   'Event ' || i,
                   TIMESTAMPTZ '2026-01-01 20:00:00+00' - (i || ' days')::interval,
                   TIMESTAMPTZ '2026-01-01 22:00:00+00' - (i || ' days')::interval,
                   '$USER_ID'::uuid, now(), now()
            FROM generate_series(0, ${SEEDED_EVENTS - 1}) AS i
            """,
        )
    }
}
