package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.util.UUID

/**
 * Reads `public.teams` over the raw datasource (via [JdbcTemplate]), not Hibernate. The startup
 * runner queries this with no tenant resolved, when the tenant-routed JPA path fails closed; the
 * explicit `public.` qualification keeps the read reachable regardless of the connection's search_path
 * — the same approach the sibling platform-boot code (TenantSchemaAdapter) uses.
 */
@Repository
class JdbcTeamRepositoryAdapter(
    private val jdbcTemplate: JdbcTemplate,
) : TeamRepository {
    override fun findAllSchemaNames(): List<String> =
        // schema_name is NOT NULL; filterNotNull only satisfies queryForList's nullable element type.
        jdbcTemplate.queryForList("SELECT schema_name FROM public.teams", String::class.java).filterNotNull()

    override fun existsBySlug(slug: String): Boolean =
        jdbcTemplate.queryForObject(
            "SELECT EXISTS(SELECT 1 FROM public.teams WHERE slug = ?)",
            Boolean::class.java,
            slug,
        ) ?: false

    override fun findByUserId(userId: UUID): TeamSummary? =
        jdbcTemplate.query(
            "SELECT t.id, t.name, t.slug FROM public.teams t " +
                "JOIN public.team_members tm ON tm.team_id = t.id " +
                "WHERE tm.user_id = ? AND tm.active = true ORDER BY tm.team_id LIMIT 1",
            { rs, _ ->
                TeamSummary(
                    id = rs.getObject("id", UUID::class.java),
                    name = rs.getString("name"),
                    slug = rs.getString("slug"),
                )
            },
            userId,
        ).firstOrNull()
}
