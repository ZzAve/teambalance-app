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

// Ids dedicated to this spec so its position/roster assertions are isolated from other specs and the
// demo seed migration, which also write to the shared platform tables in the one Testcontainers DB.
private const val ADMIN_USER_ID = "e0000000-0000-0000-0000-0000000000a1"
private const val MEMBER_USER_ID = "e0000000-0000-0000-0000-0000000000a2"
private const val TEAM_ID = "f0000000-0000-0000-0000-0000000000aa"
private const val TEAM_SCHEMA = "team_position_it"

@AutoConfigureMockMvc
class PositionControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private fun seedTeam() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema(TEAM_SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Position IT Team', 'position-it-team', '$TEAM_SCHEMA') " +
                "ON CONFLICT DO NOTHING",
        )
        // Shared DB, no per-test rollback — reset this team's roster and positions to a known state.
        jdbcTemplate.execute("DELETE FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid")
        jdbcTemplate.execute("DELETE FROM public.team_positions WHERE team_id = '$TEAM_ID'::uuid")
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$ADMIN_USER_ID'::uuid, 'pos-admin@test.com', 'Pos Admin') " +
                "ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$MEMBER_USER_ID'::uuid, 'pos-member@test.com', 'Pos Member') " +
                "ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name",
        )
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$ADMIN_USER_ID'::uuid, 'ADMIN', NULL)")
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$MEMBER_USER_ID'::uuid, 'USER', NULL)")
    }

    private fun listAs(userId: String) =
        mockMvc.perform(MockMvcRequestBuilders.get("/api/positions").header("X-User-Id", userId))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun createAs(userId: String, label: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/positions")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"label":"$label"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun renameAs(userId: String, id: String, label: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.put("/api/positions/$id")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"label":"$label"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun deleteAs(userId: String, id: String) =
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/positions/$id").header("X-User-Id", userId))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    // Creates a position via the API and returns its id, so downstream steps have a real id to act on.
    private fun createPositionReturningId(label: String): String =
        createAs(ADMIN_USER_ID, label)
            .andExpect(MockMvcResultMatchers.status().isCreated)
            .andReturn().response.contentAsString
            .let { Regex("\"id\":\"([^\"]+)\"").find(it)!!.groupValues[1] }

    init {
        test("POST /api/positions by an admin creates a position") {
            seedTeam()
            createAs(ADMIN_USER_ID, "Setter")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.label").value("Setter"))
        }

        test("GET /api/positions as a plain member returns the list") {
            seedTeam()
            createPositionReturningId("Setter")
            createPositionReturningId("Libero")

            listAs(MEMBER_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.positions.length()").value(2))
        }

        test("POST /api/positions with a duplicate label (case-insensitive) returns 409") {
            seedTeam()
            createPositionReturningId("Setter")

            createAs(ADMIN_USER_ID, "setter")
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("POSITION_LABEL_TAKEN"))
        }

        test("PUT /api/positions/{id} by an admin renames the position") {
            seedTeam()
            val id = createPositionReturningId("Setter")

            renameAs(ADMIN_USER_ID, id, "Playmaker")
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.label").value("Playmaker"))
        }

        test("DELETE /api/positions/{id} deletes it and resets assigned members to no position") {
            seedTeam()
            val id = createPositionReturningId("Setter")
            // Assign the position to the plain member, then delete it.
            jdbcTemplate.update(
                "UPDATE public.team_members SET position_id = ?::uuid WHERE user_id = ?::uuid",
                id, MEMBER_USER_ID,
            )

            deleteAs(ADMIN_USER_ID, id)
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            val remaining = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_positions WHERE id = ?::uuid", Long::class.java, id,
            )
            remaining shouldBe 0L
            val stillAssigned = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE position_id = ?::uuid", Long::class.java, id,
            )
            stillAssigned shouldBe 0L
        }

        test("POST /api/positions by a non-admin is forbidden") {
            seedTeam()
            createAs(MEMBER_USER_ID, "Setter")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("DELETE /api/positions/{id} by a non-admin is forbidden") {
            seedTeam()
            val id = createPositionReturningId("Setter")
            deleteAs(MEMBER_USER_ID, id)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("GET /api/positions without an authenticated user returns 401") {
            seedTeam()
            mockMvc.perform(MockMvcRequestBuilders.get("/api/positions"))
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
                .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
    }
}
