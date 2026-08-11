package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.InvalidCreationCodeException
import com.github.zzave.teambalance.api.domain.exception.TeamSlugTakenException
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.port.TeamRegistrationGateway
import org.springframework.dao.DuplicateKeyException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

/**
 * The atomic write of create-team. `@Transactional` puts the transaction boundary in the adapter: the
 * code consume and both inserts commit together or not at all — a race that loses the code, or a slug
 * collision, rolls everything back so no team is half-created.
 *
 * All statements are public-qualified and use [JdbcTemplate] (not Hibernate), matching the sibling
 * platform adapters: create-team runs with no tenant resolved, where the tenant-routed JPA path fails
 * closed.
 */
@Repository
class JdbcTeamRegistrationAdapter(
    private val jdbcTemplate: JdbcTemplate,
) : TeamRegistrationGateway {

    @Transactional
    override fun register(
        creationCode: String,
        founderId: UUID,
        name: TeamName,
        slug: String,
        schemaName: String,
        now: Instant,
    ): UUID {
        val at = Timestamp.from(now)

        // Consume the code conditionally: exactly one row updates iff it is still redeemable. Zero rows
        // means it was consumed/expired between the pre-check and now — opaque 403, whole tx rolls back.
        val consumed = jdbcTemplate.update(
            """
            UPDATE public.team_creation_codes
            SET consumed_at = ?, consumed_by_user_id = ?
            WHERE code = ?
              AND consumed_at IS NULL
              AND (expires_at IS NULL OR expires_at > ?)
            """.trimIndent(),
            at,
            founderId,
            creationCode,
            at,
        )
        if (consumed != 1) {
            throw InvalidCreationCodeException()
        }

        val teamId = insertTeam(name, slug, schemaName)

        // Link the consumed code to the team it produced (same transaction), so the codes-admin
        // surface can show which team a code was redeemed into.
        jdbcTemplate.update(
            "UPDATE public.team_creation_codes SET created_team_id = ? WHERE code = ?",
            teamId,
            creationCode,
        )

        // Founding admin: ADMIN role, onboarding already complete (skips /welcome), no position yet.
        jdbcTemplate.update(
            "INSERT INTO public.team_members (team_id, user_id, role, onboarded_at) VALUES (?, ?, ?, ?)",
            teamId,
            founderId,
            Role.ADMIN.name,
            at,
        )

        return teamId
    }

    // The DuplicateKeyException is intentionally translated (not chained) into a clean domain 409:
    // the slug / schema_name UNIQUE constraint tripped because a team was created under this name in
    // the window after the pre-check. The driver-level cause carries no caller-actionable detail.
    @Suppress("SwallowedException")
    private fun insertTeam(name: TeamName, slug: String, schemaName: String): UUID =
        try {
            jdbcTemplate.queryForObject(
                "INSERT INTO public.teams (name, slug, schema_name) VALUES (?, ?, ?) RETURNING id",
                UUID::class.java,
                name.value,
                slug,
                schemaName,
            )!!
        } catch (e: DuplicateKeyException) {
            throw TeamSlugTakenException(slug)
        }
}
