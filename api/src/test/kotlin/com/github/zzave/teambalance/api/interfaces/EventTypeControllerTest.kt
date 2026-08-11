package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"
private const val USER_ID = "b0000000-0000-0000-0000-000000000001"

/**
 * The only coverage of `GET /api/event-types`, the endpoint whose whole job is to hand an event
 * type's `name` and `color` to the client verbatim. Both come straight off the seed
 * (`V002__seed_event_types.sql`) and travel JPA entity -> domain -> Wirespec untouched, so nothing
 * else in the suite would notice if one of those hops dropped or transposed them — which is exactly
 * the risk when they become value classes (#207).
 *
 * The fixture mirrors the other controller ITs: `X-Team-Id` is the schema-name shim, and the team
 * and user are the ones `V1_1__seed_demo_data.sql` already seeded, so the inserts below are
 * idempotent no-ops that keep the spec runnable on its own. Inventing a fresh team here does not
 * work — the whole suite shares one Postgres, `teams.schema_name` is UNIQUE, and another spec
 * (AttendanceControllerTest) already claims `public` for its own team.
 */
@AutoConfigureMockMvc
class EventTypeControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("GET /api/event-types returns each seeded type's name and colour verbatim") {
            tenantSchemaAdapter.provisionPlatformSchema()
            tenantSchemaAdapter.provisionTenantSchema("public")

            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$USER_ID'::uuid, 'jan@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$USER_ID'::uuid, 'ADMIN', 'Setter')"
            )

            val result = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/event-types")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            // Matched by name rather than by index: the seed's order is not part of the contract,
            // but the name/colour pairing is.
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventTypes[?(@.name=='Training')].color").value("#249E6C"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventTypes[?(@.name=='Match')].color").value("#225C9C"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventTypes[?(@.name=='Other')].color").value("#F4B400"))
        }
    }
}
