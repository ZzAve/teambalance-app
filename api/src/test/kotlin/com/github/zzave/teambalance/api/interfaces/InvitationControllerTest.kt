package com.github.zzave.teambalance.api.interfaces

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.security.MessageDigest

private const val JAN_USER_ID = "c0000000-0000-0000-0000-000000000001"
private const val LISA_USER_ID = "c0000000-0000-0000-0000-000000000002"
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

// Must match application-test.yml (teambalance.invitation.token-salt).
private const val TEST_SALT = "test-invitation-salt"

private fun sha256Hex(salt: String, token: String): String =
    MessageDigest.getInstance("SHA-256").digest((salt + token).toByteArray()).joinToString("") { "%02x".format(it) }

@AutoConfigureMockMvc
class InvitationControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    private val objectMapper = ObjectMapper()

    private fun seedAdmin() {
        tenantSchemaManager.provisionPlatformSchema()
        tenantSchemaManager.provisionTenantSchema("public")
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, sport, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$JAN_USER_ID'::uuid, 'jan-invite@test.com', 'Jan de Vries') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.team_members (team_id, user_id, role, team_role) " +
                "VALUES ('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter') ON CONFLICT DO NOTHING",
        )
    }

    private fun createInvitationAs(userId: String): String {
        val mvcResult = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/invitations")
                .header("X-Team-Id", "public")
                .header("X-User-Id", userId),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()

        return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
            .andExpect(MockMvcResultMatchers.status().isCreated)
            .andExpect(MockMvcResultMatchers.jsonPath("$.token").isNotEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.expiresAt").isNotEmpty)
            .andReturn()
            .response
            .contentAsString
    }

    init {
        test("POST /api/invitations by an admin returns a token whose SALTED HASH is what gets stored") {
            seedAdmin()

            val token = objectMapper.readTree(createInvitationAs(JAN_USER_ID)).get("token").asText()

            // The plaintext token is never persisted; only its salted SHA-256 hash is.
            val plaintextRows = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.invitations WHERE token = ?", Long::class.java, token,
            )
            plaintextRows shouldBe 0L

            val hashRows = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.invitations WHERE token = ?", Long::class.java, sha256Hex(TEST_SALT, token),
            )
            hashRows shouldBe 1L
        }

        test("POST /api/invitations twice mints distinct tokens (fresh each call, no plaintext to reuse)") {
            seedAdmin()

            val first = objectMapper.readTree(createInvitationAs(JAN_USER_ID)).get("token").asText()
            val second = objectMapper.readTree(createInvitationAs(JAN_USER_ID)).get("token").asText()

            first shouldNotBe second
        }

        test("POST /api/invitations by a non-admin team member is rejected with 403") {
            tenantSchemaManager.provisionPlatformSchema()
            tenantSchemaManager.provisionTenantSchema("public")

            jdbcTemplate.execute(
                "INSERT INTO public.teams (id, name, slug, sport, schema_name) " +
                    "VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'Volleyball', 'public') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$LISA_USER_ID'::uuid, 'lisa-invite@test.com', 'Lisa Bakker') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.execute(
                "INSERT INTO public.team_members (team_id, user_id, role, team_role) " +
                    "VALUES ('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero') ON CONFLICT DO NOTHING",
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
