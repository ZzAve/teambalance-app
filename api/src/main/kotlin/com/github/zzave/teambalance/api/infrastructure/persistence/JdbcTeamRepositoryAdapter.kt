package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
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
    override fun findAllSchemaNames(): List<SchemaName> =
        // schema_name is NOT NULL; filterNotNull only satisfies queryForList's nullable element type.
        jdbcTemplate.queryForList("SELECT schema_name FROM public.teams", String::class.java)
            .filterNotNull()
            .map(::SchemaName)

    override fun existsBySlug(slug: Slug): Boolean =
        jdbcTemplate.queryForObject(
            "SELECT EXISTS(SELECT 1 FROM public.teams WHERE slug = ?)",
            Boolean::class.java,
            slug.value,
        ) ?: false

    // A presentation order for the switcher, nothing more. `t.id` breaks ties because team names are
    // deliberately not unique (ADR-0019 §2), so two Teams called "Heren 3" would otherwise reshuffle.
    override fun findTeamsOf(userId: UUID): List<TeamSummary> =
        jdbcTemplate.query(
            "SELECT t.id, t.name, t.slug FROM public.teams t " +
                "JOIN public.team_members tm ON tm.team_id = t.id " +
                "WHERE tm.user_id = ? AND tm.active = true ORDER BY t.name, t.id",
            teamSummaryRow,
            userId,
        )

    override fun findBySlug(slug: Slug): TeamSummary? =
        jdbcTemplate.query(
            "SELECT t.id, t.name, t.slug FROM public.teams t WHERE t.slug = ?",
            teamSummaryRow,
            slug.value,
        ).firstOrNull()

    override fun findById(teamId: TeamId): TeamSummary? =
        jdbcTemplate.query("SELECT t.id, t.name, t.slug FROM public.teams t WHERE t.id = ?", teamSummaryRow, teamId.value)
            .firstOrNull()

    // No `team_members` in the FROM clause at all — the membership check is not omitted here, it is
    // inexpressible, which is what makes the name honest. Act-as only (ADR-0024); see the port.
    override fun findTenantRoutingUnchecked(teamId: TeamId): TenantRouting? =
        jdbcTemplate.query(
            "SELECT t.id, t.schema_name FROM public.teams t WHERE t.id = ?",
            { rs, _ ->
                TenantRouting(
                    teamId = TeamId(rs.getObject("id", UUID::class.java)),
                    schemaName = SchemaName(rs.getString("schema_name")),
                )
            },
            teamId.value,
        ).firstOrNull()

    // Same tie-break as findTeamsOf, for the same reason: team names are deliberately not unique.
    override fun findAll(): List<TeamSummary> =
        jdbcTemplate.query("SELECT t.id, t.name, t.slug FROM public.teams t ORDER BY t.name, t.id", teamSummaryRow)

    private val teamSummaryRow = RowMapper { rs, _ ->
        TeamSummary(
            id = TeamId(rs.getObject("id", UUID::class.java)),
            name = TeamName(rs.getString("name")),
            slug = Slug(rs.getString("slug")),
        )
    }
}
