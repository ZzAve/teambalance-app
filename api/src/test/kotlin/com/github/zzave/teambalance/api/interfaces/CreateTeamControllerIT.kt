package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

// Spec-dedicated ids/schemas so the one-team-per-user guard and the shared (no-rollback) Testcontainers
// DB don't bleed between specs. Each test that must actually create a team uses a fresh founder + name.
@AutoConfigureMockMvc
class CreateTeamControllerIT : TeamBalanceIT() {

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
            "Founder $email",
        )
    }

    private fun seedCode(code: String, expiresSql: String = "NULL") {
        jdbcTemplate.update(
            "INSERT INTO public.team_creation_codes (code, expires_at) VALUES (?, $expiresSql) " +
                "ON CONFLICT (code) DO NOTHING",
            code,
        )
    }

    private fun createTeam(userId: String, name: String, slug: String, code: String) =
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/teams")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"name":"$name","slug":"$slug","creationCode":"$code"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    /** Versioned tenant migrations applied to [schema] (baseline excluded) — proves migration-to-head. */
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
        test("POST /api/teams provisions the tenant schema, makes the founder ADMIN, and consumes the code") {
            val founder = UUID.randomUUID().toString()
            seedUser(founder, "happy-${founder.take(8)}@test.com")
            seedCode("CT-HAPPY-${founder.take(8)}")

            createTeam(founder, "Create IT Happy", "create-it-happy", "CT-HAPPY-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Create IT Happy"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.slug").value("create-it-happy"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty)
                // schema_name is deliberately not exposed on the DTO.
                .andExpect(MockMvcResultMatchers.jsonPath("$.schema_name").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schemaName").doesNotExist())

            val schema = "team_create_it_happy"

            // Tenant schema provisioned and migrated to head.
            appliedTenantMigrations(schema) shouldBe tenantMigrationsOnClasspath()

            // Founder is the founding ADMIN with onboarding already stamped (skips /welcome), no position.
            val member = jdbcTemplate.queryForMap(
                "SELECT tm.role, tm.onboarded_at, tm.position_id, tm.active FROM public.team_members tm " +
                    "JOIN public.teams t ON t.id = tm.team_id WHERE tm.user_id = ?::uuid",
                founder,
            )
            member["role"] shouldBe "ADMIN"
            member["onboarded_at"].shouldNotBeNull()
            member["position_id"] shouldBe null
            member["active"] shouldBe true

            // Code is consumed by this founder (single-use).
            val consumedBy = jdbcTemplate.queryForObject(
                "SELECT consumed_by_user_id::text FROM public.team_creation_codes WHERE code = ?",
                String::class.java,
                "CT-HAPPY-${founder.take(8)}",
            )
            consumedBy shouldBe founder

            // Routing resolves the new team immediately (the SessionTenantContextFilter lookup).
            val routedSchema = jdbcTemplate.queryForObject(
                "SELECT t.schema_name FROM public.team_members tm JOIN public.teams t ON t.id = tm.team_id " +
                    "WHERE tm.user_id = ?::uuid AND tm.active = true",
                String::class.java,
                founder,
            )
            routedSchema shouldBe schema

            // The consumed code records the team it produced.
            val createdTeamId = jdbcTemplate.queryForObject(
                "SELECT created_team_id::text FROM public.team_creation_codes WHERE code = ?",
                String::class.java,
                "CT-HAPPY-${founder.take(8)}",
            )
            val teamId = jdbcTemplate.queryForObject(
                "SELECT id::text FROM public.teams WHERE schema_name = ?",
                String::class.java,
                schema,
            )
            createdTeamId shouldBe teamId
        }

        test("a consumed code cannot be reused — second use returns opaque 403") {
            val founder = UUID.randomUUID().toString()
            val other = UUID.randomUUID().toString()
            seedUser(founder, "reuse-a-${founder.take(8)}@test.com")
            seedUser(other, "reuse-b-${other.take(8)}@test.com")
            seedCode("CT-REUSE-${founder.take(8)}")

            createTeam(founder, "Create IT Reuse", "create-it-reuse", "CT-REUSE-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isCreated)

            // A different (teamless) user tries the now-consumed code.
            createTeam(other, "Create IT Reuse Two", "create-it-reuse-two", "CT-REUSE-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("an unknown creation code returns opaque 403") {
            val founder = UUID.randomUUID().toString()
            seedUser(founder, "unknown-${founder.take(8)}@test.com")

            createTeam(founder, "Create IT Unknown", "create-it-unknown", "NO-SUCH-CODE-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("an expired creation code returns opaque 403 and provisions nothing") {
            val founder = UUID.randomUUID().toString()
            seedUser(founder, "expired-${founder.take(8)}@test.com")
            seedCode("CT-EXPIRED-${founder.take(8)}", expiresSql = "now() - interval '1 day'")

            createTeam(founder, "Create IT Expired", "create-it-expired", "CT-EXPIRED-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("a founder already in a team gets 409 and the code stays unconsumed") {
            val founder = UUID.randomUUID().toString()
            seedUser(founder, "already-${founder.take(8)}@test.com")
            seedCode("CT-FIRST-${founder.take(8)}")
            seedCode("CT-SECOND-${founder.take(8)}")

            createTeam(founder, "Create IT First", "create-it-first", "CT-FIRST-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isCreated)

            createTeam(founder, "Create IT Second", "create-it-second", "CT-SECOND-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("ALREADY_IN_TEAM"))

            // The one-team guard trips before the code is touched, so the second code is still redeemable.
            val consumedAt = jdbcTemplate.queryForObject(
                "SELECT consumed_at FROM public.team_creation_codes WHERE code = ?",
                java.sql.Timestamp::class.java,
                "CT-SECOND-${founder.take(8)}",
            )
            consumedAt shouldBe null
        }

        test("a blank team name returns 400 INVALID_NAME") {
            val founder = UUID.randomUUID().toString()
            seedUser(founder, "blank-${founder.take(8)}@test.com")
            seedCode("CT-BLANK-${founder.take(8)}")

            createTeam(founder, "   ", "valid-slug", "CT-BLANK-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("INVALID_NAME"))
        }

        test("an invalid slug returns 400 INVALID_SLUG before provisioning") {
            val founder = UUID.randomUUID().toString()
            seedUser(founder, "badslug-${founder.take(8)}@test.com")
            seedCode("CT-BADSLUG-${founder.take(8)}")

            createTeam(founder, "Create IT Bad Slug", "Bad Slug", "CT-BADSLUG-${founder.take(8)}")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("INVALID_SLUG"))
        }

        test("creating a team without an authenticated user returns 401") {
            mockMvc.perform(
                MockMvcRequestBuilders.post("/api/teams")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"name":"Nope","slug":"nope","creationCode":"whatever"}"""),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
                .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
    }
}
