package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.model.UserId
import java.time.Instant

/**
 * The current tenant's Substitutes and their attendance on its Events (ADR-0033). Like
 * [PositionRepository], no method takes a team id: the routed schema is the team.
 */
interface SubstituteRepository {
    fun create(name: DisplayName, positionId: PositionId?, createdBy: UserId): Substitute

    fun exists(id: SubstituteId): Boolean

    /**
     * Adds the Substitute to the Event in [state], or moves them to it if already added. Returns
     * null when the Event does not exist.
     */
    fun setAttendance(
        eventId: EventId,
        substituteId: SubstituteId,
        state: AttendanceState,
        changedBy: UserId,
        at: Instant,
    ): SubstituteAttendance?

    /** The Substitutes on each of [eventIds], in one query. An Event with none has no key. */
    fun findAttendanceByEventIds(eventIds: List<EventId>): Map<EventId, List<SubstituteAttendance>>
}
