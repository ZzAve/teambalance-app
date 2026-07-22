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

// Ids dedicated to this spec so the roster/admin-count assertions are isolated from other specs and the
// demo seed migration, which also write to the shared platform tables in the one Testcontainers DB.
private const val JAN_USER_ID = "d0000000-0000-0000-0000-0000000000a1"
private const val LISA_USER_ID = "d0000000-0000-0000-0000-0000000000a2"
private const val TEAM_ID = "b0000000-0000-0000-0000-0000000000aa"
private const val TEAM_SCHEMA = "team_member_it"

@AutoConfigureMockMvc
class MemberControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    // Jan defaults to ADMIN so the admin-management flows have an authorized caller; individual tests
    // override roles via [janRole]/[lisaRole] to exercise the non-admin and last-admin paths.
    private fun seedTeam(janRole: String = "ADMIN", lisaRole: String = "USER") {
        tenantSchemaManager.provisionPlatformSchema()
        tenantSchemaManager.provisionTenantSchema(TEAM_SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, sport, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Member IT Team', 'member-it-team', 'Volleyball', '$TEAM_SCHEMA') " +
                "ON CONFLICT DO NOTHING",
        )
        // The Testcontainers DB is shared across all tests with no per-test rollback, so reset this
        // team's roster to exactly the two known members — roster/admin-count assertions must be exact.
        jdbcTemplate.execute("DELETE FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid")
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$JAN_USER_ID'::uuid, 'jan-member@test.com', 'Jan de Vries') " +
                "ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$LISA_USER_ID'::uuid, 'lisa-member@test.com', 'Lisa Bakker') " +
                "ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name",
        )
        jdbcTemplate.execute(
            "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, '$janRole', 'Setter')",
        )
        jdbcTemplate.execute(
            "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, '$lisaRole', 'Libero')",
        )
    }

    private fun listMembersAs(userId: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/members").header("X-User-Id", userId),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun updateMemberAs(userId: String, pathUserId: String, displayName: String, role: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.put("/api/members/$pathUserId")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"displayName":"$displayName","role":"$role"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun removeMemberAs(userId: String, pathUserId: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.delete("/api/members/$pathUserId").header("X-User-Id", userId),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

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

    private fun completeOnboardingAs(userId: String, displayName: String, positionId: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.put("/api/members/me/onboarding")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"displayName":"$displayName","role":"USER","positionId":"$positionId"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun positionId(label: String): String =
        jdbcTemplate.queryForObject(
            "SELECT id::text FROM public.team_positions WHERE team_id = ?::uuid AND label = ?",
            String::class.java,
            TEAM_ID,
            label,
        )!!

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
            seedTeam(janRole = "USER") // plain member renaming themselves — updateNameAs keeps role USER

            updateNameAs(JAN_USER_ID, JAN_USER_ID, "Jan Janssen")
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.displayName").value("Jan Janssen"))

            getMeAs(JAN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.displayName").value("Jan Janssen"))
        }

        test("PUT /api/members/{ownId} with a name another member already uses returns 409 NAME_TAKEN") {
            seedTeam(janRole = "USER")

            updateNameAs(JAN_USER_ID, JAN_USER_ID, "Lisa Bakker")
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("NAME_TAKEN"))
        }

        test("PUT /api/members/{otherUserId} by a non-admin is rejected with 403") {
            seedTeam(janRole = "USER")

            updateNameAs(JAN_USER_ID, LISA_USER_ID, "Hijacked Name")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("GET /api/members as an admin returns the roster") {
            seedTeam()

            listMembersAs(JAN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.members.length()").value(2))
        }

        test("GET /api/members as a non-admin returns 403") {
            seedTeam(janRole = "USER")

            listMembersAs(JAN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("PUT /api/members/{otherUserId} by an admin promotes the target") {
            seedTeam()

            updateMemberAs(JAN_USER_ID, LISA_USER_ID, "Lisa Bakker", "ADMIN")
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.role").value("ADMIN"))
        }

        test("PUT demoting the last admin returns 409 LAST_ADMIN") {
            seedTeam()

            updateMemberAs(JAN_USER_ID, JAN_USER_ID, "Jan de Vries", "USER")
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("LAST_ADMIN"))
        }

        test("PUT self-promote by a non-admin returns 403 CANNOT_SELF_PROMOTE") {
            seedTeam(janRole = "USER", lisaRole = "ADMIN")

            updateMemberAs(JAN_USER_ID, JAN_USER_ID, "Jan de Vries", "ADMIN")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("CANNOT_SELF_PROMOTE"))
        }

        test("DELETE /api/members/{id} by an admin soft-removes the member from the roster") {
            seedTeam()

            removeMemberAs(JAN_USER_ID, LISA_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            listMembersAs(JAN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.members.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.members[0].userId").value(JAN_USER_ID))
        }

        test("DELETE of the last admin returns 409 LAST_ADMIN") {
            seedTeam()

            removeMemberAs(JAN_USER_ID, JAN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("LAST_ADMIN"))
        }

        test("a freshly-seeded member is not yet onboarded via GET /api/members/me") {
            seedTeam()

            getMeAs(JAN_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.onboarded").value(false))
        }

        test("PUT /api/members/me/onboarding applies name+position and marks the member onboarded") {
            seedTeam(janRole = "USER") // Lisa (USER) onboards herself; a Setter position exists on the team

            completeOnboardingAs(LISA_USER_ID, "Lisa Onboarded", positionId("Setter"))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.onboarded").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.displayName").value("Lisa Onboarded"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.position.label").value("Setter"))

            getMeAs(LISA_USER_ID)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.onboarded").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.displayName").value("Lisa Onboarded"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.position.label").value("Setter"))
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
