package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

private const val JAN_USER_ID = "c0000000-0000-0000-0000-000000000001"
private const val LISA_USER_ID = "c0000000-0000-0000-0000-000000000002"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

@AutoConfigureMockMvc
class InvitationControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        test("POST /api/invitations by an admin returns a reusable invite token") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan-invite@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')
                ON CONFLICT DO NOTHING
            """
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.token").isNotEmpty)
                .andExpect(MockMvcResultMatchers.jsonPath("$.expiresAt").isNotEmpty)
        }

        test("POST /api/invitations twice by the same admin returns the same reusable token") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$JAN_USER_ID'::uuid, 'jan-invite@test.com', 'Jan de Vries')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')
                ON CONFLICT DO NOTHING
            """
            )

            fun createInvitation(): String {
                val mvcResult = mockMvc.perform(
                    MockMvcRequestBuilders.post("/api/invitations")
                        .header("X-Team-Id", "public")
                        .header("X-User-Id", JAN_USER_ID),
                )
                    .andExpect(MockMvcResultMatchers.request().asyncStarted())
                    .andReturn()

                return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                    .andExpect(MockMvcResultMatchers.status().isCreated)
                    .andReturn()
                    .response
                    .contentAsString
            }

            val first = createInvitation()
            val second = createInvitation()

            first shouldBe second
        }

        test("POST /api/invitations by a non-admin team member is rejected with 403") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute(
                """
                INSERT INTO public.teams (id, name, slug, sport, schema_name)
                VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.users (id, email, display_name)
                VALUES ('$LISA_USER_ID'::uuid, 'lisa-invite@test.com', 'Lisa Bakker')
                ON CONFLICT DO NOTHING
            """
            )
            jdbcTemplate.execute(
                """
                INSERT INTO public.team_members (team_id, user_id, role, team_role)
                VALUES ('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')
                ON CONFLICT DO NOTHING
            """
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", LISA_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }
    }
}
