package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.ActAsId
import com.github.zzave.teambalance.api.domain.model.ActorKind
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.ActAsRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import java.sql.Timestamp
import java.util.UUID

/**
 * Reads and writes `public.act_as_sessions` over the raw datasource (via [JdbcTemplate]), not
 * Hibernate — the same reasoning as [JdbcTeamRepositoryAdapter]: the grant is resolved in the request
 * filter, with no tenant set, where the tenant-routed JPA path fails closed. The explicit `public.`
 * qualification keeps the read reachable regardless of the connection's search_path.
 */
@Repository
class JdbcActAsRepositoryAdapter(
    private val jdbcTemplate: JdbcTemplate,
) : ActAsRepository {

    override fun findOpenFor(userId: UserId): ActAs? =
        jdbcTemplate.query(
            "$SELECT_COLUMNS WHERE created_by = ? AND exited_at IS NULL",
            actAsRow,
            userId.value,
        ).firstOrNull()

    override fun findForTeam(teamId: TeamId): List<ActAs> =
        jdbcTemplate.query("$SELECT_COLUMNS WHERE team_id = ? ORDER BY entered_at DESC", actAsRow, teamId.value)

    // Upsert on the id: entering inserts, sliding and exiting update. entered_by/actor_kind/team_id
    // are immutable for the life of an episode, so the DO UPDATE touches only the three that move.
    override fun save(actAs: ActAs) {
        jdbcTemplate.update(
            """
            INSERT INTO public.act_as_sessions
                (id, team_id, created_by, actor_kind, entered_at, last_active_at, expires_at, exited_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (id) DO UPDATE
                SET last_active_at = EXCLUDED.last_active_at,
                    expires_at     = EXCLUDED.expires_at,
                    exited_at      = EXCLUDED.exited_at
            """.trimIndent(),
            actAs.id.value,
            actAs.teamId.value,
            actAs.userId.value,
            actAs.actorKind.name,
            Timestamp.from(actAs.enteredAt),
            Timestamp.from(actAs.lastActiveAt),
            Timestamp.from(actAs.expiresAt),
            actAs.exitedAt?.let { Timestamp.from(it) },
        )
    }

    private val actAsRow = RowMapper { rs, _ ->
        ActAs(
            id = ActAsId(rs.getObject("id", UUID::class.java)),
            teamId = TeamId(rs.getObject("team_id", UUID::class.java)),
            userId = UserId(rs.getObject("created_by", UUID::class.java)),
            actorKind = ActorKind.valueOf(rs.getString("actor_kind")),
            enteredAt = rs.getTimestamp("entered_at").toInstant(),
            lastActiveAt = rs.getTimestamp("last_active_at").toInstant(),
            expiresAt = rs.getTimestamp("expires_at").toInstant(),
            exitedAt = rs.getTimestamp("exited_at")?.toInstant(),
        )
    }

    private companion object {
        const val SELECT_COLUMNS =
            "SELECT id, team_id, created_by, actor_kind, entered_at, last_active_at, expires_at, exited_at " +
                "FROM public.act_as_sessions"
    }
}
