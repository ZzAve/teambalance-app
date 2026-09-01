package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

// Memberless creation (ADR-0024 §5, #240) is gated on the platform-admin allowlist, empty by default
// (fail-closed) in the test profile. Pin one admin email here; the admin user is seeded with it.
//
// The admin identity is a FIXED (id, email) pair, not a per-test random id: the allowlist matches a
// fixed email, and `public.users.email` is UNIQUE, so a fresh id with that same email would collide.
// One stable admin, seeded idempotently, is the honest shape — it is the same operator every test.
private const val ADMIN_ID = "d0000000-0000-0000-0000-000000000240"
private const val ADMIN_EMAIL = "memberless-admin@test.com"

@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.platform-admins=" + ADMIN_EMAIL])
class CreateMemberlessTeamControllerIT : TeamBalanceIT() {

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

    private fun createMemberless(userId: String?, name: String, slug: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/admin/teams")
                .apply { if (userId != null) header("X-User-Id", userId) }
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"name":"$name","slug":"$slug"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun appliedTenantMigrations(schema: String): Int = jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM \"$schema\".flyway_tenant_schema_history " +
            "WHERE success = true AND version IS NOT NULL AND \"type\" <> 'BASELINE'",
        Int::class.java,
    ) ?: 0

    private fun tenantMigrationsOnClasspath(): Int =
        PathMatchingResourcePatternResolver()
            .getResources("classpath*:db/tenant-migration/V*__*.sql")
            .size

    init {
        test("POST /api/admin/teams provisions the schema with NO members and records the creator") {
            val admin = ADMIN_ID
            seedUser(admin, ADMIN_EMAIL)

            createMemberless(admin, "Dames 5", "ml-dames-5")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Dames 5"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.slug").value("ml-dames-5"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty)
                // schema_name is never exposed.
                .andExpect(MockMvcResultMatchers.jsonPath("$.schema_name").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schemaName").doesNotExist())

            val schema = "team_ml_dames_5"

            // Tenant schema provisioned and migrated to head — a real, usable team, just empty.
            appliedTenantMigrations(schema) shouldBe tenantMigrationsOnClasspath()

            val teamId = jdbcTemplate.queryForObject(
                "SELECT id::text FROM public.teams WHERE schema_name = ?",
                String::class.java,
                schema,
            )

            // The teamless invariant (ADR-0024 §3): not one team_members row exists for this team.
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE team_id = ?::uuid",
                Long::class.java,
                teamId,
            ) shouldBe 0L

            // Provenance: the creating admin is recorded on the team row.
            jdbcTemplate.queryForObject(
                "SELECT created_by::text FROM public.teams WHERE id = ?::uuid",
                String::class.java,
                teamId,
            ) shouldBe admin

            // The admin holds no membership and the new team is NOT their Active Team — they enter via
            // act-as, never as a member.
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.team_members WHERE user_id = ?::uuid",
                Long::class.java,
                admin,
            ) shouldBe 0L
            jdbcTemplate.queryForObject(
                "SELECT last_active_team_id::text FROM public.users WHERE id = ?::uuid",
                String::class.java,
                admin,
            ) shouldBe null
        }

        test("POST /api/admin/teams by a non-platform-admin is forbidden (403)") {
            val notAdmin = UUID.randomUUID().toString()
            seedUser(notAdmin, "not-admin-${notAdmin.take(8)}@test.com")

            createMemberless(notAdmin, "Nope", "ml-nope")
                .andExpect(MockMvcResultMatchers.status().isForbidden)

            // Nothing was created.
            jdbcTemplate.queryForObject(
                "SELECT count(*) FROM public.teams WHERE slug = ?",
                Long::class.java,
                "ml-nope",
            ) shouldBe 0L
        }

        test("POST /api/admin/teams with a taken slug returns 409 TEAM_SLUG_TAKEN") {
            val admin = ADMIN_ID
            seedUser(admin, ADMIN_EMAIL)

            createMemberless(admin, "First", "ml-dupe")
                .andExpect(MockMvcResultMatchers.status().isCreated)
            createMemberless(admin, "Second", "ml-dupe")
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("TEAM_SLUG_TAKEN"))
        }

        test("POST /api/admin/teams without an authenticated user returns 401") {
            createMemberless(null, "Nope", "ml-unauth")
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
    }
}
