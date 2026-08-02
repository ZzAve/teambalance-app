package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.port.TeamRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

/**
 * Reads `public.teams` over the raw datasource (via [JdbcTemplate]), not Hibernate. The startup
 * runner queries this with no tenant resolved, when the tenant-routed JPA path fails closed; the
 * explicit `public.` qualification keeps the read reachable regardless of the connection's search_path
 * — the same approach the sibling platform-boot code (TenantSchemaManager) uses.
 */
@Repository
class JdbcTeamRepositoryAdapter(
    private val jdbcTemplate: JdbcTemplate,
) : TeamRepository {
    override fun findAllSchemaNames(): List<String> =
        // schema_name is NOT NULL; filterNotNull only satisfies queryForList's nullable element type.
        jdbcTemplate.queryForList("SELECT schema_name FROM public.teams", String::class.java).filterNotNull()
}
