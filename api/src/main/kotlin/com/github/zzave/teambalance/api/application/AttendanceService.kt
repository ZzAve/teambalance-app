package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceId
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.EventAttendance
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import java.time.Clock
import java.util.UUID

class AttendanceService(
    private val attendanceRepository: AttendanceRepository,
    private val eventRepository: EventRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val authorizationService: AuthorizationService,
    private val clock: Clock,
) {
    /**
     * Records [userId]'s attendance for [eventId], attributed to [changedBy] (the authenticated
     * caller). Editing is trust-based within a team (ADR-0003), so the gate is membership, not
     * admin: the target [userId] must be an active member of [teamId] — the caller's server-resolved
     * tenant. This closes the write path that previously trusted only schema routing and never
     * checked the path [userId] against the caller's team. Returns null when the event is unknown.
     */
    fun setAttendance(
        teamId: TeamId,
        eventId: EventId,
        userId: UserId,
        state: AttendanceState,
        changedBy: UserId,
    ): Attendance? {
        authorizationService.requireMember(userId, teamId)
        if (eventRepository.findById(eventId) == null) return null

        val existing = attendanceRepository.findByEventIdAndUserId(eventId, userId)
        return if (existing != null) {
            attendanceRepository.save(
                existing.copy(state = state, updatedAt = clock.instant(), changedBy = changedBy),
            )
        } else {
            attendanceRepository.save(
                Attendance(
                    id = AttendanceId.random(),
                    eventId = eventId,
                    userId = userId,
                    state = state,
                    updatedAt = clock.instant(),
                    changedBy = changedBy,
                ),
            )
        }
    }

    /**
     * Bulk Attend (ADR-0020): fills [userId]'s *blanks* across [eventIds] in one go, attributed to
     * [changedBy]. The client names the ids it currently shows; this guard is the whole server job,
     * and it is deliberately one-directional — a row is created **iff**
     *  - the member has no response row for that event (NOT_RESPONDED is the *absence* of a row), and
     *  - the event has not started yet (`startTime >= now`).
     *
     * So it can only ever INSERT, never UPDATE: a deliberate Absent (injury, holiday) is a real row
     * and is passed over untouched, which is what makes the button safe to re-tap. Both reads are
     * batched, so the guard costs two queries regardless of how many ids arrive.
     *
     * The gate is membership, not self: editing is trust-based within a team (ADR-0003), so the
     * target may be any active member of [teamId] — but it must be one. Returns the ids actually
     * created, which is what Undo is handed back.
     */
    fun bulkAttend(
        teamId: TeamId,
        userId: UserId,
        eventIds: List<EventId>,
        state: AttendanceState,
        changedBy: UserId,
    ): List<EventId> {
        authorizationService.requireMember(userId, teamId)
        // A NOT_RESPONDED row would contradict the rule that not-responded *is* the missing row, and
        // would then block the very re-tap this feature exists for. There is no such thing to create.
        if (eventIds.isEmpty() || state == AttendanceState.NOT_RESPONDED) return emptyList()

        val now = clock.instant()
        val answered = attendanceRepository.findByUserIdAndEventIds(userId, eventIds).map { it.eventId }.toSet()
        val creatable = eventRepository.findByIds(eventIds)
            .filter { !it.startTime.isBefore(now) && it.id !in answered }
            .map { it.id }

        // No empty-check needed: saveAll of nothing is nothing.
        return attendanceRepository.saveAll(
            creatable.map { eventId ->
                Attendance(
                    id = AttendanceId.random(),
                    eventId = eventId,
                    userId = userId,
                    state = state,
                    updatedAt = now,
                    changedBy = changedBy,
                )
            },
        ).map { it.eventId }
    }

    /**
     * Undo for [bulkAttend]: deletes [userId]'s rows for [eventIds], returning those actually deleted.
     * It carries no non-destructive guard — that guard is what makes it necessary, since the rows Undo
     * must reach are precisely the ones a second POST would now skip. The caller hands back only the
     * ids [bulkAttend] reported creating, so a deliberate answer is never in range; repeating it finds
     * nothing and is therefore idempotent.
     */
    fun bulkUndo(teamId: TeamId, userId: UserId, eventIds: List<EventId>): List<EventId> {
        authorizationService.requireMember(userId, teamId)
        if (eventIds.isEmpty()) return emptyList()
        return attendanceRepository.deleteByUserIdAndEventIds(userId, eventIds)
    }

    /** Current active roster of a team — fetch once per request and pass into the projections below. */
    fun teamMembers(teamId: TeamId): List<TeamMember> = teamMemberRepository.findByTeamId(teamId)

    // The attendance picture is derived from *current team membership*, not from the rows that existed
    // when the event was made: a member who joined later shows as NOT_RESPONDED (no seeded row needed)
    // and a member who left drops out even with a stale row (#103, #114). EventAttendance concentrates
    // that rule; `members` is passed in so a listing resolves the roster once.

    /** The resolved attendance picture for one event — its response rows fetched once. */
    fun attendanceFor(eventId: EventId, members: List<TeamMember>): EventAttendance =
        EventAttendance.resolve(members, attendanceRepository.findByEventId(eventId))

    /**
     * The resolved picture for many events, keyed by event id, from a single response-row query —
     * kills the per-event N+1 when producing a listing.
     */
    fun attendanceForAll(eventIds: List<EventId>, members: List<TeamMember>): Map<EventId, EventAttendance> {
        val responsesByEvent = attendanceRepository.findByEventIds(eventIds).groupBy { it.eventId }
        return eventIds.associateWith { EventAttendance.resolve(members, responsesByEvent[it] ?: emptyList()) }
    }

    fun findMember(userId: UserId): TeamMember? =
        teamMemberRepository.findMembersByUserIds(setOf(userId)).values.firstOrNull()

    fun findDisplayName(userId: UserId): DisplayName? = teamMemberRepository.findDisplayName(userId)
}
