package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import com.github.zzave.teambalance.api.infrastructure.persistence.FAULT_MEMBER_USER_ID
import com.github.zzave.teambalance.api.infrastructure.persistence.FaultInjectingTeamMemberRepositoryConfig
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

private const val ADMIN_USER_ID = "c1000000-0000-0000-0000-0000000000a0"
private const val HEALTHY_USER_ID = "c1000000-0000-0000-0000-0000000000a2"
private const val TEAM_ID = "c1000000-0000-0000-0000-0000000000bb"
private const val TEAM_SCHEMA = "member_boundary_it"

private const val ORIGINAL_FAULT_NAME = "Original Fault"

/**
 * A member edit writes across two aggregates: the display name lands on `users`, while role and
 * position land on `team_members`. `MemberService` checks every guard before any write and names no
 * transaction, so the all-or-nothing guarantee rests on `TeamMemberRepository.applyMemberEdit` being
 * a single, `@Transactional` adapter call.
 *
 * The team-member half is made to fail; the display name (written first) must be unchanged
 * afterwards, and onboarding must not be marked. Verified to be load-bearing by deleting
 * `@Transactional` from the adapter method, which leaves the name changed while the role/position
 * write is lost — exactly the partial edit the guarantee forbids.
 */
@AutoConfigureMockMvc
@Import(FaultInjectingTeamMemberRepositoryConfig::class)
class MemberEditBoundaryIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    init {
        test("an admin edit whose team-member write fails leaves the display name unchanged") {
            seedTeam()

            editMemberAs(ADMIN_USER_ID, FAULT_MEMBER_USER_ID, "Renamed")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)

            displayNameOf(FAULT_MEMBER_USER_ID) shouldBe ORIGINAL_FAULT_NAME
        }

        test("an onboarding whose team-member write fails leaves the member un-onboarded and unrenamed") {
            seedTeam()

            onboardAs(FAULT_MEMBER_USER_ID, "Onboard Name", positionId("Setter"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)

            displayNameOf(FAULT_MEMBER_USER_ID) shouldBe ORIGINAL_FAULT_NAME
            isOnboarded(FAULT_MEMBER_USER_ID) shouldBe false
        }

        test("a healthy admin edit renames the member") {
            seedTeam()

            editMemberAs(ADMIN_USER_ID, HEALTHY_USER_ID, "Healthy Renamed")
                .andExpect(MockMvcResultMatchers.status().isOk)

            displayNameOf(HEALTHY_USER_ID) shouldBe "Healthy Renamed"
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun editMemberAs(callerId: String, targetUserId: String, newName: String): ResultActions =
        mockMvc.perform(
            MockMvcRequestBuilders.put("/api/members/$targetUserId")
                .header("X-User-Id", callerId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"displayName":"$newName","role":"USER"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun onboardAs(userId: String, newName: String, positionId: String): ResultActions =
        mockMvc.perform(
            MockMvcRequestBuilders.put("/api/members/me/onboarding")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"displayName":"$newName","role":"USER","positionId":"$positionId"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun displayNameOf(userId: String): String =
        jdbcTemplate.queryForObject(
            "SELECT display_name FROM public.users WHERE id = ?::uuid",
            String::class.java,
            userId,
        )!!

    private fun isOnboarded(userId: String): Boolean =
        jdbcTemplate.queryForObject(
            "SELECT onboarded_at IS NOT NULL FROM public.team_members WHERE user_id = ?::uuid AND active = true",
            Boolean::class.java,
            userId,
        )!!

    private fun positionId(label: String): String =
        jdbcTemplate.queryForObject(
            "SELECT id::text FROM public.team_positions WHERE team_id = ?::uuid AND label = ?",
            String::class.java,
            TEAM_ID,
            label,
        )!!

    // The Testcontainers DB is shared across specs with no per-test rollback, so reset this team's
    // roster and its members' names/onboarding to a known baseline at the start of every test.
    private fun seedTeam() {
        tenantSchemaManager.provisionPlatformSchema()
        tenantSchemaManager.provisionTenantSchema(TEAM_SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Boundary IT Team', 'boundary-it-team', '$TEAM_SCHEMA') " +
                "ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("DELETE FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid")
        upsertUser(ADMIN_USER_ID, "boundary-admin@test.com", "Boundary Admin")
        upsertUser(FAULT_MEMBER_USER_ID, "boundary-fault@test.com", ORIGINAL_FAULT_NAME)
        upsertUser(HEALTHY_USER_ID, "boundary-healthy@test.com", "Healthy Original")
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$ADMIN_USER_ID'::uuid, 'ADMIN', 'Setter')")
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$FAULT_MEMBER_USER_ID'::uuid, 'USER', 'Libero')")
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$HEALTHY_USER_ID'::uuid, 'USER', 'Middle')")
    }

    private fun upsertUser(id: String, email: String, displayName: String) {
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$id'::uuid, '$email', '$displayName') " +
                "ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name",
        )
    }
}
