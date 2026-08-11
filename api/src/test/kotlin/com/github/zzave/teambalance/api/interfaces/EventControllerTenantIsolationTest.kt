package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

private const val ALPHA_SCHEMA = "team_iso_alpha"
private const val BETA_SCHEMA = "team_iso_beta"
private const val ALPHA_TEAM_ID = "a0000000-0000-0000-0000-0000000000a1"
private const val BETA_TEAM_ID = "a0000000-0000-0000-0000-0000000000b1"
private const val ALPHA_USER_ID = "b0000000-0000-0000-0000-0000000000a1"
private const val BETA_USER_ID = "b0000000-0000-0000-0000-0000000000b1"

/**
 * EventController-level (HTTP) proof of #49's tenant isolation, complementing
 * TenantSchemaRoutingTest's repo-level proof: an event created in team A's schema must be
 * invisible through the real REST endpoints when the request resolves to team B's schema,
 * and visible again when it resolves back to team A's.
 */
@AutoConfigureMockMvc
class EventControllerTenantIsolationTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("event created in team A's schema is invisible via HTTP under team B, visible again under team A") {
            tenantSchemaAdapter.provisionPlatformSchema()
            tenantSchemaAdapter.provisionTenantSchema(ALPHA_SCHEMA)
            tenantSchemaAdapter.provisionTenantSchema(BETA_SCHEMA)

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, schema_name)
                VALUES ('$ALPHA_TEAM_ID'::uuid, 'Team Alpha', 'team-alpha-iso', '$ALPHA_SCHEMA')
                ON CONFLICT DO NOTHING
                """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, schema_name)
                VALUES ('$BETA_TEAM_ID'::uuid, 'Team Beta', 'team-beta-iso', '$BETA_SCHEMA')
                ON CONFLICT DO NOTHING
                """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$ALPHA_USER_ID'::uuid, 'alpha@iso-test.com', 'Alpha User')
                ON CONFLICT DO NOTHING
                """
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$ALPHA_TEAM_ID'::uuid, '$ALPHA_USER_ID'::uuid, 'ADMIN', 'Setter')"
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$BETA_USER_ID'::uuid, 'beta@iso-test.com', 'Beta User')
                ON CONFLICT DO NOTHING
                """
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$BETA_TEAM_ID'::uuid, '$BETA_USER_ID'::uuid, 'ADMIN', 'Setter')"
            )

            // Event lives ONLY in team A's tenant schema.
            val eventId = UUID.randomUUID()
            jdbcTemplate.execute(
                """
                INSERT INTO $ALPHA_SCHEMA.events (uuid, event_type_id, title, start_time, end_time, created_by, created_at, updated_at)
                VALUES ('$eventId'::uuid,
                    (SELECT id FROM $ALPHA_SCHEMA.event_types WHERE name = 'Training'),
                    'Alpha-only Match', '2026-07-01 20:00:00+00', '2026-07-01 22:00:00+00',
                    '$ALPHA_USER_ID'::uuid, now(), now())
                """
            )

            // Team B's request resolves to BETA_SCHEMA — alpha's event must not be reachable.
            val notFound = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", BETA_SCHEMA)
                    .header("X-User-Id", BETA_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(notFound))
                .andExpect(MockMvcResultMatchers.status().isNotFound)

            // Same event, resolved via team A's own schema — must be visible.
            val found = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events/$eventId")
                    .header("X-Team-Id", ALPHA_SCHEMA)
                    .header("X-User-Id", ALPHA_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(found))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(eventId.toString()))

            // The list endpoint must follow the same isolation: absent under team B, present under team A.
            val listUnderBeta = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events?include-past=true")
                    .header("X-Team-Id", BETA_SCHEMA)
                    .header("X-User-Id", BETA_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(listUnderBeta))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[?(@.id=='$eventId')]").isEmpty)

            val listUnderAlpha = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/events?include-past=true")
                    .header("X-Team-Id", ALPHA_SCHEMA)
                    .header("X-User-Id", ALPHA_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(listUnderAlpha))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.events[?(@.id=='$eventId')]").isNotEmpty)
        }
    }
}
