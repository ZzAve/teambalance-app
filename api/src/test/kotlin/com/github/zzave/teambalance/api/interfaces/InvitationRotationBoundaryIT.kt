package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.infrastructure.persistence.FaultInjectingInvitationRepositoryConfig
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.Instant
import java.util.UUID

private const val ADMIN_USER_ID = "b0000000-0000-0000-0000-0000000000f2"

// teams.schema_name is UNIQUE, so every IT that routes to the `public` tenant shares this one team.
private const val TEAM_ID = "a0000000-0000-0000-0000-000000000001"

/**
 * The one operation in the codebase whose atomicity spans two distinct writes: rotating an invite
 * link expires the team's active links and mints a replacement. `InvitationService` documents the
 * requirement — "a failure to mint rolls the expire back rather than leaving the team with no usable
 * link" — and since the service no longer names a transaction, that guarantee now rests entirely on
 * `InvitationRepository.rotate` being a single, `@Transactional` adapter call.
 *
 * The mint is made to fail; the pre-existing link must still be active afterwards. Verified to be
 * load-bearing by deleting `@Transactional` from `JpaInvitationRepositoryAdapter.rotate`, which
 * leaves the team with an expired link and no replacement — exactly the state the guarantee forbids.
 */
@AutoConfigureMockMvc
@Import(FaultInjectingInvitationRepositoryConfig::class)
class InvitationRotationBoundaryIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("a rotate whose mint fails leaves the existing invite link usable") {
            seedTeamAndAdmin()
            val existing = seedActiveInvitation()
            // Relative to what's already there: the Testcontainers Postgres is shared by every IT
            // class with no truncation between them, so an absolute count would be pollutable.
            val activeBefore = activeInvitationCount()

            mockMvc.perform(
                MockMvcRequestBuilders.post("/api/invitations/rotate")
                    .header("X-Team-Id", "public")
                    .header("X-User-Id", ADMIN_USER_ID),
            )
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andReturn()
                .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

            // The expire must have rolled back with the failed mint: nothing expired, nothing minted,
            // and the link the team already had is still usable.
            activeInvitationCount() shouldBe activeBefore
            isStillActive(existing) shouldBe true
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    private fun activeInvitationCount(): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM public.invitations WHERE team_id = ?::uuid AND expires_at > now()",
            Long::class.java,
            TEAM_ID,
        )!!

    private fun isStillActive(id: UUID): Boolean =
        jdbcTemplate.queryForObject(
            "SELECT expires_at > now() FROM public.invitations WHERE id = ?",
            Boolean::class.java,
            id,
        )!!

    private fun seedActiveInvitation(): UUID {
        val id = UUID.randomUUID()
        jdbcTemplate.update(
            """
            INSERT INTO public.invitations (id, team_id, token, created_by, expires_at, created_at)
            VALUES (?, ?::uuid, 'pre-existing-hash', ?::uuid, ?, ?)
            """,
            id,
            TEAM_ID,
            ADMIN_USER_ID,
            java.sql.Timestamp.from(Instant.now().plusSeconds(86_400)),
            java.sql.Timestamp.from(Instant.now()),
        )
        return id
    }

    private fun seedTeamAndAdmin() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema("public")
        jdbcTemplate.execute(
            """
            INSERT INTO public.teams (id, name, slug, schema_name)
            VALUES ('$TEAM_ID'::uuid, 'Test Team', 'test-team', 'public')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute(
            """
            INSERT INTO public.users (id, email, display_name)
            VALUES ('$ADMIN_USER_ID'::uuid, 'rotate-admin@test.com', 'Rotate Admin')
            ON CONFLICT DO NOTHING
            """,
        )
        jdbcTemplate.execute(
            "SELECT public.tb_add_member('$TEAM_ID'::uuid, '$ADMIN_USER_ID'::uuid, 'ADMIN', 'Setter')",
        )
    }
}
