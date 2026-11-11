package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.TeamRequestNotPendingException
import com.github.zzave.teambalance.api.domain.exception.TeamRequestPendingException
import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.TeamRequestEntry
import com.github.zzave.teambalance.api.domain.model.TeamRequestPurpose
import com.github.zzave.teambalance.api.domain.model.TeamRequestReason
import com.github.zzave.teambalance.api.domain.model.TeamRequestStatus
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import com.github.zzave.teambalance.api.domain.port.TeamRequestRepository
import org.springframework.dao.DuplicateKeyException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

/**
 * Reads/writes `public.team_requests` over the raw datasource, public-qualified like the sibling
 * platform adapters, so it works with no tenant resolved. [approve] inserts the creation code through
 * [TeamCreationCodeRepository] inside its own transaction, so the code, the link and the status commit together.
 */
@Repository
class JdbcTeamRequestRepositoryAdapter(
    private val jdbcTemplate: JdbcTemplate,
    private val creationCodeRepository: TeamCreationCodeRepository,
) : TeamRequestRepository {

    @Transactional
    override fun insertPending(userId: UserId, teamName: TeamName, purpose: TeamRequestPurpose, requestedAt: Instant): TeamRequestEntry {
        val id = UUID.randomUUID()
        try {
            jdbcTemplate.update(
                "INSERT INTO public.team_requests (id, user_id, team_name, purpose, status, requested_at) " +
                    "VALUES (?, ?, ?, ?, 'PENDING', ?)",
                id,
                userId.value,
                teamName.value,
                purpose.value,
                Timestamp.from(requestedAt),
            )
        } catch (_: DuplicateKeyException) {
            throw TeamRequestPendingException()
        }
        return checkNotNull(findById(id))
    }

    override fun findById(id: UUID): TeamRequestEntry? =
        jdbcTemplate.query("$SELECT WHERE r.id = ?", ROW_MAPPER, id).firstOrNull()

    override fun findLatestByUser(userId: UserId): TeamRequestEntry? =
        jdbcTemplate.query(
            "$SELECT WHERE r.user_id = ? ORDER BY r.requested_at DESC LIMIT 1",
            ROW_MAPPER,
            userId.value,
        ).firstOrNull()

    override fun findForAdmin(decidedLimit: Int): List<TeamRequestEntry> =
        jdbcTemplate.query("$SELECT WHERE r.status = 'PENDING' ORDER BY r.requested_at", ROW_MAPPER) +
            jdbcTemplate.query(
                "$SELECT WHERE r.status <> 'PENDING' ORDER BY r.decided_at DESC LIMIT ?",
                ROW_MAPPER,
                decidedLimit,
            )

    @Transactional
    override fun approve(
        id: UUID,
        decidedBy: UserId,
        code: CreationCode,
        now: Instant,
        codeExpiresAt: Instant,
    ): TeamRequestEntry {
        creationCodeRepository.insert(code, now, codeExpiresAt)
        val updated = jdbcTemplate.update(
            "UPDATE public.team_requests SET status = 'APPROVED', decided_at = ?, decided_by_user_id = ?, " +
                "creation_code_id = (SELECT id FROM public.team_creation_codes WHERE code = ?) " +
                "WHERE id = ? AND status = 'PENDING'",
            Timestamp.from(now),
            decidedBy.value,
            code.value,
            id,
        )
        // Throwing rolls the code insert back too: a request decided in the meantime mints nothing.
        if (updated != 1) throw TeamRequestNotPendingException(id)
        return checkNotNull(findById(id))
    }

    @Transactional
    override fun reject(id: UUID, decidedBy: UserId, reason: TeamRequestReason?, now: Instant): TeamRequestEntry {
        val updated = jdbcTemplate.update(
            "UPDATE public.team_requests SET status = 'REJECTED', decided_at = ?, decided_by_user_id = ?, " +
                "reject_reason = ? WHERE id = ? AND status = 'PENDING'",
            Timestamp.from(now),
            decidedBy.value,
            reason?.value,
            id,
        )
        if (updated != 1) throw TeamRequestNotPendingException(id)
        return checkNotNull(findById(id))
    }

    private companion object {
        private const val SELECT = """
            SELECT r.id, r.user_id, u.email, r.team_name, r.purpose, r.status, r.reject_reason, r.requested_at,
                   r.decided_at, c.code, c.created_at AS code_created_at, c.expires_at AS code_expires_at,
                   c.consumed_at AS code_consumed_at, c.consumed_by_user_id, c.created_team_id
            FROM public.team_requests r
            JOIN public.users u ON u.id = r.user_id
            LEFT JOIN public.team_creation_codes c ON c.id = r.creation_code_id
        """

        private val ROW_MAPPER = RowMapper { rs: ResultSet, _: Int ->
            TeamRequestEntry(
                id = rs.getObject("id", UUID::class.java),
                requesterId = UserId(rs.getObject("user_id", UUID::class.java)),
                requesterEmail = Email(rs.getString("email")),
                teamName = TeamName(rs.getString("team_name")),
                purpose = TeamRequestPurpose(rs.getString("purpose")),
                status = TeamRequestStatus.valueOf(rs.getString("status")),
                rejectReason = rs.getString("reject_reason")?.let(TeamRequestReason::ofOrNull),
                requestedAt = rs.getTimestamp("requested_at").toInstant(),
                decidedAt = rs.getTimestamp("decided_at")?.toInstant(),
                creationCode = rs.getString("code")?.let {
                    TeamCreationCode(
                        code = CreationCode(it),
                        createdAt = rs.getTimestamp("code_created_at").toInstant(),
                        expiresAt = rs.getTimestamp("code_expires_at")?.toInstant(),
                        consumedAt = rs.getTimestamp("code_consumed_at")?.toInstant(),
                        consumedByUserId = rs.getObject("consumed_by_user_id", UUID::class.java)?.let(::UserId),
                        createdTeamId = rs.getObject("created_team_id", UUID::class.java)?.let(::TeamId),
                    )
                },
            )
        }
    }
}
