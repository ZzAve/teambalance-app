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
private const val JOINER_USER_ID = "c0000000-0000-0000-0000-000000000003"
private const val EXPIRED_JOINER_USER_ID = "c0000000-0000-0000-0000-000000000004"
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
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$JAN_USER_ID'::uuid, 'jan-invite@test.com', 'Jan de Vries') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute(
            "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$JAN_USER_ID'::uuid, 'ADMIN', 'Setter')",
        )
    }

    /** Inserts an invitation row directly (bypassing generateInviteLink) so tests control its expiry. */
    private fun seedInvitation(plaintextToken: String, expiresAt: String = "2099-01-01T00:00:00Z") {
        jdbcTemplate.execute(
            "INSERT INTO public.invitations (team_id, token, created_by, expires_at) " +
                "VALUES ('$TEAM_ID'::uuid, '${sha256Hex(TEST_SALT, plaintextToken)}', '$JAN_USER_ID'::uuid, '$expiresAt'::timestamptz)",
        )
    }

    private fun seedJoiner(userId: String, email: String) {
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$userId'::uuid, '$email', 'New Joiner') ON CONFLICT DO NOTHING",
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
                "INSERT INTO public.teams (id, name, slug, schema_name) " +
                    "VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$LISA_USER_ID'::uuid, 'lisa-invite@test.com', 'Lisa Bakker') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')",
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

        test("POST /api/invitations/{token}/accept adds the authenticated user as a team_member") {
            seedAdmin()
            seedJoiner(JOINER_USER_ID, "joiner-accept@test.com")
            seedInvitation("plaintext-accept-token")

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/plaintext-accept-token/accept")
                    .header("X-User-Id", JOINER_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.teamId").value(TEAM_ID))

            val memberRows = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members " +
                    "WHERE team_id = ?::uuid AND user_id = ?::uuid AND role = 'USER' AND active = true",
                Long::class.java,
                TEAM_ID,
                JOINER_USER_ID,
            )
            memberRows shouldBe 1L
        }

        test("POST /api/invitations/{token}/accept with an unknown token is rejected with 404") {
            seedAdmin()
            seedJoiner(JOINER_USER_ID, "joiner-unknown@test.com")

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/does-not-exist/accept")
                    .header("X-User-Id", JOINER_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("POST /api/invitations/{token}/accept with an expired token is rejected with 404") {
            seedAdmin()
            seedJoiner(EXPIRED_JOINER_USER_ID, "joiner-expired@test.com")
            seedInvitation("plaintext-expired-token", expiresAt = "2000-01-01T00:00:00Z")

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/plaintext-expired-token/accept")
                    .header("X-User-Id", EXPIRED_JOINER_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isNotFound)

            val memberRows = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE team_id = ?::uuid AND user_id = ?::uuid",
                Long::class.java,
                TEAM_ID,
                EXPIRED_JOINER_USER_ID,
            )
            memberRows shouldBe 0L
        }

        test("POST /api/invitations/expire by an admin invalidates the team's active invitation") {
            seedAdmin()
            seedJoiner(JOINER_USER_ID, "joiner-expire@test.com")
            seedInvitation("plaintext-expire-token")

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/expire")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            val acceptResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/plaintext-expire-token/accept")
                    .header("X-User-Id", JOINER_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(acceptResult))
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("POST /api/invitations/rotate by an admin rejects the old token and accepts the new one") {
            seedAdmin()
            seedJoiner(JOINER_USER_ID, "joiner-rotate@test.com")
            seedInvitation("plaintext-rotate-old-token")

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/rotate")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            val newToken = objectMapper.readTree(
                mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                    .andExpect(MockMvcResultMatchers.status().isCreated)
                    .andExpect(MockMvcResultMatchers.jsonPath("$.token").isNotEmpty)
                    .andReturn()
                    .response
                    .contentAsString,
            ).get("token").asText()

            val oldTokenResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/plaintext-rotate-old-token/accept")
                    .header("X-User-Id", JOINER_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(oldTokenResult))
                .andExpect(MockMvcResultMatchers.status().isNotFound)

            val newTokenResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/$newToken/accept")
                    .header("X-User-Id", JOINER_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(newTokenResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.teamId").value(TEAM_ID))
        }

        test("POST /api/invitations/rotate by a non-admin team member is rejected with 403") {
            seedAdmin()
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$LISA_USER_ID'::uuid, 'lisa-rotate@test.com', 'Lisa Bakker') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')",
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/rotate")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", LISA_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("POST /api/invitations/expire by a non-admin team member is rejected with 403") {
            seedAdmin()
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$LISA_USER_ID'::uuid, 'lisa-expire@test.com', 'Lisa Bakker') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')",
            )

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/expire")
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
