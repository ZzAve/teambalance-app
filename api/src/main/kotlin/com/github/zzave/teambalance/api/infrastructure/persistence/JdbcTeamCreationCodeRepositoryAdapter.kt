package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.Instant

/**
 * Reads/writes `public.team_creation_codes` over the raw datasource (public-qualified, like the sibling
 * platform adapters) so it works with no tenant resolved. The redeemability peek and the codes-admin
 * list/insert/delete live here; the authoritative *consume* is the conditional UPDATE in
 * [JdbcTeamRegistrationAdapter], which must be atomic with the team/member inserts.
 */
@Repository
class JdbcTeamCreationCodeRepositoryAdapter(
    private val jdbcTemplate: JdbcTemplate,
) : TeamCreationCodeRepository {

    override fun isRedeemable(code: CreationCode, now: Instant): Boolean =
        jdbcTemplate.queryForObject(
            """
            SELECT EXISTS(
                SELECT 1 FROM public.team_creation_codes
                WHERE code = ?
                  AND consumed_at IS NULL
                  AND (expires_at IS NULL OR expires_at > ?)
            )
            """.trimIndent(),
            Boolean::class.java,
            code.value,
            Timestamp.from(now),
        ) ?: false

    override fun findAll(): List<TeamCreationCode> =
        jdbcTemplate.query(
            """
            SELECT code, created_at, expires_at, consumed_at, consumed_by_user_id, created_team_id
            FROM public.team_creation_codes
            ORDER BY created_at DESC
            """.trimIndent(),
            ROW_MAPPER,
        )

    override fun findByCode(code: CreationCode): TeamCreationCode? =
        jdbcTemplate.query(
            """
            SELECT code, created_at, expires_at, consumed_at, consumed_by_user_id, created_team_id
            FROM public.team_creation_codes
            WHERE code = ?
            """.trimIndent(),
            ROW_MAPPER,
            code.value,
        ).firstOrNull()

    override fun insert(code: CreationCode, createdAt: Instant, expiresAt: Instant?): TeamCreationCode {
        jdbcTemplate.update(
            "INSERT INTO public.team_creation_codes (code, created_at, expires_at) VALUES (?, ?, ?)",
            code.value,
            Timestamp.from(createdAt),
            expiresAt?.let { Timestamp.from(it) },
        )
        return TeamCreationCode(
            code = code,
            createdAt = createdAt,
            expiresAt = expiresAt,
            consumedAt = null,
            consumedByUserId = null,
            createdTeamId = null,
        )
    }

    override fun delete(code: CreationCode) {
        jdbcTemplate.update("DELETE FROM public.team_creation_codes WHERE code = ?", code.value)
    }

    private companion object {
        private val ROW_MAPPER = RowMapper { rs: ResultSet, _: Int ->
            TeamCreationCode(
                code = CreationCode(rs.getString("code")),
                createdAt = rs.getTimestamp("created_at").toInstant(),
                expiresAt = rs.getTimestamp("expires_at")?.toInstant(),
                consumedAt = rs.getTimestamp("consumed_at")?.toInstant(),
                consumedByUserId = rs.getObject("consumed_by_user_id", java.util.UUID::class.java),
                createdTeamId = rs.getObject("created_team_id", java.util.UUID::class.java),
            )
        }
    }
}
