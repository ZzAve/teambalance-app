package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

/**
 * The identity of a [Substitute]. Same shape and the same edges-only conversion as [EventId], which
 * documents the pattern. Like [PositionId], it has no `random()`: the persistence adapter generates it
 * when the row is created.
 */
@JvmInline
value class SubstituteId(val value: UUID) {
    override fun toString(): String = value.toString()
}

/**
 * A person outside the Team whom the Team keeps on a list and can call in for an Event (ADR-0033).
 * Not a [TeamMember]: no account, no [Role], not on the Roster. Shaped like a member where the two
 * are shown side by side: [positionId] joins the Event Roster, [position] is the label for display.
 */
data class Substitute(
    val id: SubstituteId,
    val name: DisplayName,
    val positionId: PositionId?,
    val position: PositionLabel?,
)

/**
 * A [Substitute]'s state on one Event. The row exists only once a Member has added them, so a
 * Substitute is never Not Responded: that state means "expected to answer and has not", which a
 * Substitute never is.
 */
data class SubstituteAttendance(
    val substitute: Substitute,
    val state: AttendanceState,
    val changedBy: UserId,
    val updatedAt: Instant,
) {
    init {
        require(state != AttendanceState.NOT_RESPONDED) { "A substitute is never Not Responded" }
    }
}
