package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantContext
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.util.UUID

// Fixture ids namespaced to this spec: every IT shares one database, and a colliding id silently
// shares a member with whichever spec seeded first.
private const val ALPHA_TEAM = "a2500000-0000-0000-0000-000000000001"
private const val BETA_TEAM = "a2500000-0000-0000-0000-000000000002"
private const val ALPHA_SCHEMA = "team_profile_iso_alpha"
private const val BETA_SCHEMA = "team_profile_iso_beta"
private const val SHARED_USER = "b2500000-0000-0000-0000-000000000001"

/**
 * The point of ADR-0026, proven where it can only be proven: against two real tenant schemas.
 *
 * A member's display name and position used to live on `public.users` and `public.team_members`, so
 * once ADR-0023 made multi-team membership real, renaming yourself in one team renamed you in every
 * team you belonged to. These are the tests that would have caught that, and that stop it coming
 * back — no amount of in-memory faking can, because the isolation IS the schema.
 */
class MemberProfileTenantIsolationIT : TeamBalanceIT() {

    @Autowired
    lateinit var teamMemberRepository: TeamMemberRepository

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("a rename in one team leaves the same member's name in another team untouched") {
            seedBothTeams()

            inTenant(ALPHA_SCHEMA) {
                teamMemberRepository.applyMemberEdit(
                    teamId = TeamId(UUID.fromString(ALPHA_TEAM)),
                    userId = UserId(UUID.fromString(SHARED_USER)),
                    displayName = DisplayName("Alpha Name"),
                    role = Role.USER,
                    positionId = null,
                    markOnboardedAt = null,
                )
            }

            inTenant(ALPHA_SCHEMA) { nameIn(ALPHA_TEAM) } shouldBe "Alpha Name"
            inTenant(BETA_SCHEMA) { nameIn(BETA_TEAM) } shouldBe "Original Name"
        }

        test("a team-scoped rename does not touch the platform name, which stays the teamless fallback") {
            seedBothTeams()

            inTenant(ALPHA_SCHEMA) {
                teamMemberRepository.applyMemberEdit(
                    teamId = TeamId(UUID.fromString(ALPHA_TEAM)),
                    userId = UserId(UUID.fromString(SHARED_USER)),
                    displayName = DisplayName("Only Here"),
                    role = Role.USER,
                    positionId = null,
                    markOnboardedAt = null,
                )
            }

            // /auth/me serves this to a caller with no Active Team, so a team edit reaching it would
            // be the same cross-team leak by another route.
            jdbcTemplate.queryForObject(
                "SELECT display_name FROM public.users WHERE id = ?::uuid",
                String::class.java,
                SHARED_USER,
            ) shouldBe "Original Name"
        }
    }

    private fun <T> inTenant(schema: String, block: () -> T): T {
        TenantContext.set(schema)
        try {
            return block()
        } finally {
            TenantContext.clear()
        }
    }

    private fun nameIn(teamId: String): String? =
        teamMemberRepository.findByTeamId(TeamId(UUID.fromString(teamId)))
            .firstOrNull { it.userId.value.toString() == SHARED_USER }
            ?.displayName?.value

    private fun seedBothTeams() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema(ALPHA_SCHEMA)
        tenantSchemaAdapter.provisionTenantSchema(BETA_SCHEMA)
        seedTeam(ALPHA_TEAM, "Profile Iso Alpha", "profile-iso-alpha", ALPHA_SCHEMA)
        seedTeam(BETA_TEAM, "Profile Iso Beta", "profile-iso-beta", BETA_SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.users (id, email, display_name) " +
                "VALUES ('$SHARED_USER'::uuid, 'profile-iso@test.com', 'Original Name') " +
                "ON CONFLICT (id) DO UPDATE SET display_name = 'Original Name'",
        )
        // The same human in both teams — the case that made the old model wrong.
        listOf(ALPHA_TEAM to ALPHA_SCHEMA, BETA_TEAM to BETA_SCHEMA).forEach { (team, schema) ->
            jdbcTemplate.execute("SELECT public.tb_add_member('$team'::uuid, '$SHARED_USER'::uuid, 'USER', NULL)")
            jdbcTemplate.update(
                "INSERT INTO $schema.member_profiles (user_id, display_name) VALUES (?::uuid, 'Original Name') " +
                    "ON CONFLICT (user_id) DO UPDATE SET display_name = 'Original Name'",
                SHARED_USER,
            )
        }
    }

    private fun seedTeam(id: String, name: String, slug: String, schema: String) {
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$id'::uuid, '$name', '$slug', '$schema') ON CONFLICT DO NOTHING",
        )
    }
}
