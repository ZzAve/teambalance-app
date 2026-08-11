package com.github.zzave.teambalance.api.interfaces

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

// The codes-admin CRUD (#154 Slice 4) is gated on the platform-admin allowlist. The test profile's
// default allowlist is empty (fail-closed), so pin one email here; the admin user is seeded with it.
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.platform-admins=codes-admin@test.com"])
class CreationCodeAdminControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private fun seedUser(id: String, email: String) {
        tenantSchemaAdapter.provisionPlatformSchema()
        jdbcTemplate.update(
            "INSERT INTO public.users (id, email, display_name) VALUES (?::uuid, ?, ?) " +
                "ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email",
            id,
            email,
            "User $email",
        )
    }

    // The Wirespec handlers are suspend → the request dispatches asynchronously; complete it.
    private fun dispatch(builder: MockHttpServletRequestBuilder): ResultActions =
        mockMvc.perform(builder)
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun listAs(userId: String) =
        dispatch(MockMvcRequestBuilders.get("/api/admin/creation-codes").header("X-User-Id", userId))

    private fun createAs(userId: String, body: String = "{}") =
        dispatch(
            MockMvcRequestBuilders.post("/api/admin/creation-codes")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body),
        )

    private fun revokeAs(userId: String, code: String) =
        dispatch(MockMvcRequestBuilders.delete("/api/admin/creation-codes/$code").header("X-User-Id", userId))

    private fun seedCode(code: String, consumedByUserId: String? = null, createdTeamId: String? = null) {
        tenantSchemaAdapter.provisionPlatformSchema()
        jdbcTemplate.update(
            "INSERT INTO public.team_creation_codes (code, consumed_at, consumed_by_user_id, created_team_id) " +
                "VALUES (?, ${if (consumedByUserId != null) "now()" else "NULL"}, ?::uuid, ?::uuid) " +
                "ON CONFLICT (code) DO NOTHING",
            code,
            consumedByUserId,
            createdTeamId,
        )
    }

    /** A memberless `public.teams` row, only ever used as the `created_team_id` FK target. */
    private fun seedTeam(id: String) {
        tenantSchemaAdapter.provisionPlatformSchema()
        jdbcTemplate.update(
            "INSERT INTO public.teams (id, name, slug, schema_name) VALUES (?::uuid, ?, ?, ?) " +
                "ON CONFLICT (id) DO NOTHING",
            id,
            "Codes IT Team",
            "codes-it-team",
            "team_codes_it",
        )
    }

    init {
        // Fixed ids + spec-namespaced emails so the seed is idempotent and can't clash with other
        // specs' fixtures: public.users.email is UNIQUE and seedUser's ON CONFLICT (id) doesn't
        // cover it, so a plain `outsider@test.com` collides with AttendanceAuthorizationIT's user.
        val admin = "cc000000-0000-0000-0000-000000000001"
        val outsider = "cc000000-0000-0000-0000-000000000002"
        beforeTest {
            seedUser(admin, "codes-admin@test.com")
            seedUser(outsider, "codes-outsider@test.com")
        }

        test("a platform admin creates a code, then sees it in the list — redeemable in the DB") {
            val result = createAs(admin)
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").isString)
                .andExpect(MockMvcResultMatchers.jsonPath("$.consumedAt").doesNotExist())
                .andReturn()
            val code = ObjectMapper().readTree(result.response.contentAsString)["code"].asText()

            // Persisted, unconsumed, non-expiring → redeemable.
            val redeemable = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_creation_codes " +
                    "WHERE code = ? AND consumed_at IS NULL AND expires_at IS NULL",
                Int::class.java,
                code,
            )
            redeemable shouldBe 1

            listAs(admin)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.codes[?(@.code == '$code')]").exists())
        }

        test("a platform admin can create a code with an explicit expiry") {
            createAs(admin, """{"expiresAt":"2099-01-01T00:00:00Z"}""")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.expiresAt").value("2099-01-01T00:00:00Z"))
        }

        test("a non-admin is forbidden from listing or creating codes") {
            listAs(outsider).andExpect(MockMvcResultMatchers.status().isForbidden)
            createAs(outsider).andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("an unauthenticated caller is unauthorized") {
            dispatch(MockMvcRequestBuilders.get("/api/admin/creation-codes"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }

        test("revoking an unconsumed code deletes it (204)") {
            val code = "REVOKE-ME-${UUID.randomUUID().toString().take(8)}"
            seedCode(code)

            revokeAs(admin, code).andExpect(MockMvcResultMatchers.status().isNoContent)

            val remaining = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_creation_codes WHERE code = ?",
                Int::class.java,
                code,
            )
            remaining shouldBe 0
        }

        test("revoking an unknown code returns 404") {
            revokeAs(admin, "NO-SUCH-CODE-${UUID.randomUUID().toString().take(8)}")
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("revoking an already-consumed code returns 409 and leaves it in place") {
            val code = "CONSUMED-${UUID.randomUUID().toString().take(8)}"
            seedCode(code, consumedByUserId = admin)

            revokeAs(admin, code)
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("CREATION_CODE_CONSUMED"))

            val remaining = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_creation_codes WHERE code = ?",
                Int::class.java,
                code,
            )
            remaining shouldBe 1
        }

        // The two spent-code columns (who redeemed it, which team it produced) are read back through
        // the row mapper and out through the DTO; nothing asserted either value end to end before.
        test("a spent code reports its consumer and the team it produced") {
            val teamId = "cc000000-0000-0000-0000-0000000000a1"
            seedTeam(teamId)
            val code = "SPENT-${UUID.randomUUID().toString().take(8)}"
            seedCode(code, consumedByUserId = admin, createdTeamId = teamId)

            listAs(admin)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(
                    MockMvcResultMatchers.jsonPath("$.codes[?(@.code == '$code')].consumedByUserId").value(admin),
                )
                .andExpect(
                    MockMvcResultMatchers.jsonPath("$.codes[?(@.code == '$code')].createdTeamId").value(teamId),
                )
        }

        test("a non-admin cannot revoke a code") {
            val code = "GUARDED-${UUID.randomUUID().toString().take(8)}"
            seedCode(code)
            revokeAs(outsider, code).andExpect(MockMvcResultMatchers.status().isForbidden)
        }
    }
}
