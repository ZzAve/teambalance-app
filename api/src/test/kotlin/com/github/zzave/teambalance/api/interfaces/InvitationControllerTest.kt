package com.github.zzave.teambalance.api.interfaces

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
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
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private val objectMapper = ObjectMapper()

    private fun seedAdmin() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
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

    /** An ADMIN-granting handover link (ADR-0024 §5), seeded directly so accept can be exercised. */
    private fun seedAdminInvitation(plaintextToken: String, expiresAt: String = "2099-01-01T00:00:00Z") {
        jdbcTemplate.execute(
            "INSERT INTO public.invitations (team_id, token, created_by, expires_at, role) " +
                "VALUES ('$TEAM_ID'::uuid, '${sha256Hex(TEST_SALT, plaintextToken)}', " +
                "'$JAN_USER_ID'::uuid, '$expiresAt'::timestamptz, 'ADMIN')",
        )
    }

    private fun seedJoiner(userId: String, email: String) {
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$userId'::uuid, '$email', 'New Joiner') ON CONFLICT DO NOTHING",
        )
    }

    // These ITs share one Postgres with no truncation between them, so a link left active by an
    // earlier test would be handed back by the now-idempotent POST. Tests that care start from none.
    private fun expireAllInvitations() {
        jdbcTemplate.update(
            "UPDATE public.invitations SET expires_at = now() WHERE team_id = ?::uuid AND expires_at > now()",
            TEAM_ID,
        )
    }

    private fun activeInvitationCount(): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.invitations WHERE team_id = ?::uuid AND expires_at > now()",
            Long::class.java,
            TEAM_ID,
        )!!

    private fun getActiveInvitationAs(userId: String, expectedStatus: Int): String {
        val mvcResult = mockMvc.perform(
            MockMvcRequestBuilders.get("/api/invitations/active")
                .header("X-Team-Id", "public")
                .header("X-User-Id", userId),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()

        return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
            .andExpect(MockMvcResultMatchers.status().`is`(expectedStatus))
            .andReturn()
            .response
            .contentAsString
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

            // Since ADR-0025 the token is recoverable, but it is still never written down in the
            // clear: `token` holds the salted hash and `token_encrypted` holds ciphertext.
            val plaintextRows = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.invitations WHERE token = ? OR token_encrypted = ?",
                Long::class.java,
                token,
                token,
            )
            plaintextRows shouldBe 0L

            val hashRows = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.invitations WHERE token = ?", Long::class.java, sha256Hex(TEST_SALT, token),
            )
            hashRows shouldBe 1L

            // ...and the row carries the ciphertext that makes the link re-showable.
            val ciphertext = jdbcTemplate.queryForObject(
                "SELECT token_encrypted FROM public.invitations WHERE token = ?",
                String::class.java,
                sha256Hex(TEST_SALT, token),
            )
            ciphertext.isNullOrBlank() shouldBe false
        }

        // Previously each call minted another concurrently-valid link, and since none of them could
        // be read back the team accumulated invisible credentials (ADR-0025). A team has one link.
        test("POST /api/invitations twice returns the same link, and only one is active") {
            seedAdmin()
            expireAllInvitations()

            val first = objectMapper.readTree(createInvitationAs(JAN_USER_ID)).get("token").asText()
            val second = objectMapper.readTree(createInvitationAs(JAN_USER_ID)).get("token").asText()

            first shouldBe second
            activeInvitationCount() shouldBe 1L
        }

        test("GET /api/invitations/active returns the link a previous POST handed out") {
            seedAdmin()
            expireAllInvitations()
            val created = objectMapper.readTree(createInvitationAs(JAN_USER_ID)).get("token").asText()

            val body = getActiveInvitationAs(JAN_USER_ID, expectedStatus = 200)

            objectMapper.readTree(body).get("token").asText() shouldBe created
        }

        test("GET /api/invitations/active is 204 when the team has no link") {
            seedAdmin()
            expireAllInvitations()

            getActiveInvitationAs(JAN_USER_ID, expectedStatus = 204)
        }

        test("GET /api/invitations/active is 204 once the link has been expired") {
            seedAdmin()
            expireAllInvitations()
            createInvitationAs(JAN_USER_ID)

            mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/expire")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
                .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
                .andExpect(MockMvcResultMatchers.status().isNoContent)

            getActiveInvitationAs(JAN_USER_ID, expectedStatus = 204)
        }

        test("GET /api/invitations/active follows a rotate to the replacement link") {
            seedAdmin()
            expireAllInvitations()
            val before = objectMapper.readTree(createInvitationAs(JAN_USER_ID)).get("token").asText()

            val rotated = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/rotate")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
                .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
                .andReturn().response.contentAsString
                .let { objectMapper.readTree(it).get("token").asText() }

            rotated shouldNotBe before
            objectMapper.readTree(getActiveInvitationAs(JAN_USER_ID, expectedStatus = 200))
                .get("token").asText() shouldBe rotated
        }

        test("GET /api/invitations/active by a non-admin team member is rejected with 403") {
            seedAdmin()
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) " +
                    "VALUES ('$LISA_USER_ID'::uuid, 'lisa-invite@test.com', 'Lisa Bakker') ON CONFLICT DO NOTHING",
            )
            jdbcTemplate.execute(
                "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$LISA_USER_ID'::uuid, 'USER', 'Libero')",
            )

            getActiveInvitationAs(LISA_USER_ID, expectedStatus = 403)
        }

        test("POST /api/invitations by a non-admin team member is rejected with 403") {
            tenantSchemaAdapter.provisionPlatformSchema()
            tenantSchemaAdapter.provisionTenantSchema("public")

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

        test("POST /api/invitations/admin by an admin mints an ADMIN-role link") {
            seedAdmin()
            expireAllInvitations()

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/admin")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.token").isNotEmpty)

            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.invitations " +
                    "WHERE team_id = ?::uuid AND role = 'ADMIN' AND consumed_at IS NULL AND expires_at > now()",
                Long::class.java,
                TEAM_ID,
            ) shouldBe 1L
        }

        test("POST /api/invitations/admin by a non-admin is forbidden") {
            seedAdmin()
            seedJoiner(JOINER_USER_ID, "not-admin-handover@test.com")

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/admin")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JOINER_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("accepting an ADMIN link makes the joiner an ADMIN and marks the link consumed") {
            seedAdmin()
            seedJoiner(JOINER_USER_ID, "admin-joiner@test.com")
            seedAdminInvitation("plaintext-admin-token")

            val mvcResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/plaintext-admin-token/accept")
                    .header("X-User-Id", JOINER_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.teamId").value(TEAM_ID))

            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members " +
                    "WHERE team_id = ?::uuid AND user_id = ?::uuid AND role = 'ADMIN' AND active = true",
                Long::class.java,
                TEAM_ID,
                JOINER_USER_ID,
            ) shouldBe 1L

            // Single-use: the link is now spent.
            jdbcTemplate.queryForObject(
                "SELECT consumed_at FROM public.invitations WHERE token = ?",
                java.sql.Timestamp::class.java,
                sha256Hex(TEST_SALT, "plaintext-admin-token"),
            ) shouldNotBe null
        }

        test("rotating the shareable link leaves a live ADMIN handover link untouched") {
            seedAdmin()
            expireAllInvitations()
            seedAdminInvitation("plaintext-admin-survives-rotate")

            // Rotate the (absent) shareable USER link — this mints a new USER link and expires the old
            // USER one, but must not touch the independent single-use ADMIN handover link.
            mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/rotate")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", JAN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
                .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
                .andExpect(MockMvcResultMatchers.status().isCreated)

            // The ADMIN link is still active (unexpired) and unspent.
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.invitations " +
                    "WHERE token = ? AND role = 'ADMIN' AND consumed_at IS NULL AND expires_at > now()",
                Long::class.java,
                sha256Hex(TEST_SALT, "plaintext-admin-survives-rotate"),
            ) shouldBe 1L
        }

        test("an ADMIN link is single-use: a second person accepting it is rejected and joins nobody") {
            seedAdmin()
            seedJoiner(JOINER_USER_ID, "admin-first@test.com")
            seedJoiner(EXPIRED_JOINER_USER_ID, "admin-second@test.com")
            seedAdminInvitation("plaintext-admin-once-token")

            fun accept(userId: String) = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/plaintext-admin-once-token/accept")
                    .header("X-User-Id", userId),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
                .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

            accept(JOINER_USER_ID).andExpect(MockMvcResultMatchers.status().isOk)
            // The second accept of the spent link joins nobody — 404, indistinguishable from unknown.
            accept(EXPIRED_JOINER_USER_ID).andExpect(MockMvcResultMatchers.status().isNotFound)

            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE team_id = ?::uuid AND user_id = ?::uuid",
                Long::class.java,
                TEAM_ID,
                EXPIRED_JOINER_USER_ID,
            ) shouldBe 0L
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
