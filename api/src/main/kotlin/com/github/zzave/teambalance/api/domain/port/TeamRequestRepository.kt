package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.TeamRequestEntry
import com.github.zzave.teambalance.api.domain.model.TeamRequestPurpose
import com.github.zzave.teambalance.api.domain.model.TeamRequestReason
import com.github.zzave.teambalance.api.domain.model.UserId
import java.time.Instant
import java.util.UUID

/** Team requests (ADR-0047). Each method is one transaction. */
interface TeamRequestRepository {
    /** Inserts a PENDING request. Throws `TeamRequestPendingException` if [userId] already has one. */
    fun insertPending(userId: UserId, teamName: TeamName, purpose: TeamRequestPurpose, requestedAt: Instant): TeamRequestEntry

    fun findById(id: UUID): TeamRequestEntry?

    /** The caller's most recently made request, whatever its status. */
    fun findLatestByUser(userId: UserId): TeamRequestEntry?

    /** Every pending request, oldest first, then the [decidedLimit] most recently decided. */
    fun findForAdmin(decidedLimit: Int): List<TeamRequestEntry>

    /**
     * Inserts [code] (expiring at [codeExpiresAt]) and, in the same transaction, marks the request
     * APPROVED and links the code. Throws `TeamRequestNotPendingException` if it is not pending.
     */
    fun approve(id: UUID, decidedBy: UserId, code: CreationCode, now: Instant, codeExpiresAt: Instant): TeamRequestEntry

    /** Marks the request REJECTED. Throws `TeamRequestNotPendingException` if it is not pending. */
    fun reject(id: UUID, decidedBy: UserId, reason: TeamRequestReason?, now: Instant): TeamRequestEntry
}
