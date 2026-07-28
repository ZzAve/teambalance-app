package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/** Bucket label for attendees who have no position assigned. */
const val UNASSIGNED = "Unassigned"

/**
 * One member's resolved attendance for an event: their response-row state, or NOT_RESPONDED when
 * they have no row. [responseId] is the attendance row's id when they responded, null otherwise —
 * so a view can key off the real row while a not-responded member falls back to their user id.
 */
data class MemberAttendance(
    val member: TeamMember,
    val state: AttendanceState,
    val responseId: UUID?,
)

/**
 * The resolved attendance picture of a single event, computed once from the current roster and the
 * event's response rows. Summary, roster ([entries]) and role breakdown are pure folds over the
 * projection — the "response-row-state, else NOT_RESPONDED" rule lives here and only here, and the
 * response rows are fetched once. Delete this and that rule scatters back across three services and
 * the per-event listing N+1 returns.
 */
class EventAttendance private constructor(
    val entries: List<MemberAttendance>,
) {
    /** Count of current members in each state (every state present, zero when none). */
    fun summary(): Map<AttendanceState, Int> =
        AttendanceState.entries.associateWith { state -> entries.count { it.state == state } }

    /**
     * Attending members grouped by position (unpositioned in the [UNASSIGNED] bucket), ordered by
     * count descending then position label ascending.
     */
    fun attendingRoleBreakdown(): List<Pair<String, Int>> =
        entries
            .filter { it.state == AttendanceState.ATTENDING }
            .groupBy { it.member.position ?: UNASSIGNED }
            .map { (position, grouped) -> position to grouped.size }
            .sortedWith(compareByDescending<Pair<String, Int>> { it.second }.thenBy { it.first })

    companion object {
        /**
         * Resolve the picture for [members] (the current roster) against the event's [responses].
         * A member's state is their response row's state, or NOT_RESPONDED when they have no row;
         * a stale row for someone no longer on the roster is ignored (never counted or listed).
         */
        fun resolve(members: List<TeamMember>, responses: List<Attendance>): EventAttendance {
            val responseByUser = responses.associateBy { it.userId }
            return EventAttendance(
                members.map { member ->
                    val response = responseByUser[member.userId]
                    MemberAttendance(
                        member = member,
                        state = response?.state ?: AttendanceState.NOT_RESPONDED,
                        responseId = response?.id,
                    )
                },
            )
        }
    }
}
