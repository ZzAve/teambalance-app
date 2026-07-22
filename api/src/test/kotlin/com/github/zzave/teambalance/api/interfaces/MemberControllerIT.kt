package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

private const val JAN_USER_ID = "d0000000-0000-0000-0000-000000000001"
private const val LISA_USER_ID = "d0000000-0000-0000-0000-000000000002"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

@AutoConfigureMockMvc
class MemberControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    private fun seedTeam() {
        tenantSchemaManager.provisionPlatformSchema()
        tenantSchemaManager.provisionTenantSchema("public")
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, sport, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$JAN_USER_ID'::uuid, 'jan-member@test.com', 'Jan de Vries') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$LISA_USER_ID'::uuid, 'lisa-member@test.com', 'Lisa Bakker') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.team_members (team_id, user_id, role, team_role) " +
                "VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'USER', 'Setter') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.team_members (team_id, user_id, role, team_role) " +
                "VALUES ('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero') ON CONFLICT DO NOTHING",
        )
    }

    private fun updateNameAs(userId: String, pathUserId: String, displayName: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.put("/api/members/$pathUserId")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"displayName":"$displayName","role":"USER"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun getMeAs(userId: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/members/me").header("X-User-Id", userId),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    init {
        test("GET /api/members/me returns the authenticated member") {
            seedTeam()

            getMeAs(JAN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").value(JAN_USER_ID))
                .andExpect(MockMvcResultMatchers.jsonPath("$.displayName").value("Jan de Vries"))
        }

        test("PUT /api/members/{ownId} with a new valid name succeeds and GET /me reflects it") {
            seedTeam()

            updateNameAs(JAN_USER_ID, JAN_USER_ID, "Jan Janssen")
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.displayName").value("Jan Janssen"))

            getMeAs(JAN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.displayName").value("Jan Janssen"))
        }

        test("PUT /api/members/{ownId} with a name another member already uses returns 409 NAME_TAKEN") {
            seedTeam()

            updateNameAs(JAN_USER_ID, JAN_USER_ID, "Lisa Bakker")
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("NAME_TAKEN"))
        }

        test("PUT /api/members/{otherUserId} is rejected with 403 (self-only)") {
            seedTeam()

            updateNameAs(JAN_USER_ID, LISA_USER_ID, "Hijacked Name")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("GET /api/members/me without an authenticated user returns 401") {
            seedTeam()

            mockMvc.perform(MockMvcRequestBuilders.get("/api/members/me"))
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
                .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
    }
}
