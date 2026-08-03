package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Timestamp
import java.time.Instant

/**
 * Reads `public.team_creation_codes` over the raw datasource (public-qualified, like the sibling
 * platform adapters) so it works with no tenant resolved. Only the peek lives here; the authoritative
 * consume is the conditional UPDATE in [JdbcTeamRegistrationAdapter], which must be atomic with the
 * team/member inserts.
 */
@Repository
class JdbcTeamCreationCodeRepositoryAdapter(
    private val jdbcTemplate: JdbcTemplate,
) : TeamCreationCodeRepository {

    override fun isRedeemable(code: String, now: Instant): Boolean =
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
            code,
            Timestamp.from(now),
        ) ?: false
}
