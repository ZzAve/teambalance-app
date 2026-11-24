package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.UserId
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
            SELECT c.code, c.created_at, c.expires_at, c.consumed_at, c.consumed_by_user_id, c.created_team_id,
                   r.team_name AS requested_team_name, u.email AS requested_by
            FROM public.team_creation_codes c
            LEFT JOIN public.team_requests r ON r.creation_code_id = c.id
            LEFT JOIN public.users u ON u.id = r.user_id
            ORDER BY c.created_at DESC
            """.trimIndent(),
        ) { rs, n ->
            ROW_MAPPER.mapRow(rs, n)!!.copy(
                requestedTeamName = rs.getString("requested_team_name")?.let(::TeamName),
                requestedBy = rs.getString("requested_by")?.let { Email(it) },
            )
        }

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
                consumedByUserId = rs.getObject("consumed_by_user_id", java.util.UUID::class.java)?.let(::UserId),
                createdTeamId = rs.getObject("created_team_id", java.util.UUID::class.java)?.let(::TeamId),
            )
        }
    }
}
