package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidTeamRequestTextException
import java.time.Instant
import java.util.UUID

enum class TeamRequestStatus { PENDING, APPROVED, REJECTED }

/**
 * A signed-in user's request for a team (ADR-0047), read together with the requester's email and, once
 * approved, the creation code minted for it. [creationCode] is the code row as it is now, so a usable
 * code can be told from a consumed or expired one.
 */
data class TeamRequestEntry(
    val id: UUID,
    val requesterId: UserId,
    val requesterEmail: Email,
    val teamName: TeamName,
    val purpose: TeamRequestPurpose,
    val status: TeamRequestStatus,
    val rejectReason: TeamRequestReason?,
    val requestedAt: Instant,
    val decidedAt: Instant?,
    val creationCode: TeamCreationCode?,
) {
    /** The minted code while it can still be redeemed at [now]; null for any other state. */
    fun usableCode(now: Instant): CreationCode? =
        creationCode?.takeIf { it.consumedAt == null && (it.expiresAt == null || it.expiresAt > now) }?.code

    companion object {
        const val CODE_VALIDITY_DAYS = 30L
    }
}

/** What the requester would use TeamBalance for: trimmed, 1 to 1000 characters. */
@JvmInline
value class TeamRequestPurpose private constructor(val value: String) {
    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 1000

        operator fun invoke(raw: String): TeamRequestPurpose {
            val purpose = raw.trim()
            if (purpose.isEmpty() || purpose.length > MAX_LENGTH) {
                throw InvalidTeamRequestTextException("Purpose must be 1 to $MAX_LENGTH characters", "INVALID_PURPOSE")
            }
            return TeamRequestPurpose(purpose)
        }
    }
}

/** Why an admin rejected a request: trimmed, at most 500 characters. A blank reason is no reason. */
@JvmInline
value class TeamRequestReason private constructor(val value: String) {
    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 500

        fun ofOrNull(raw: String?): TeamRequestReason? {
            val reason = raw?.trim()?.ifEmpty { null } ?: return null
            if (reason.length > MAX_LENGTH) {
                throw InvalidTeamRequestTextException("Reason must be at most $MAX_LENGTH characters", "INVALID_REASON")
            }
            return TeamRequestReason(reason)
        }
    }
}
