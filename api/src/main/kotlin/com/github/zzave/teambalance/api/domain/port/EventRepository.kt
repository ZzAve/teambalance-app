package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.PositionId
import java.time.Instant
import java.util.UUID

/**
 * A batch method exists wherever a use case must write several events as one unit ([saveAll],
 * [deleteAllById]). The batch is the unit of atomicity: one call to this port is one transaction,
 * opened and committed by the adapter. That keeps the application layer free of any notion of a
 * transaction — it expresses "these rows go together" by handing them over in one call.
 */
interface EventRepository {
    fun findById(id: EventId): Event?

    /**
     * Many events in one query — lets a batch use case read the start times it must guard against
     * (Bulk Attend's future-only rule, ADR-0020) without a per-id round-trip. Unknown ids simply do
     * not come back, so the caller sees exactly the events that exist.
     */
    fun findByIds(ids: List<EventId>): List<Event>
    fun findUpcoming(since: Instant): List<Event>
    fun findAll(): List<Event>
    fun findByRecurringGroup(group: UUID): List<Event>
    fun save(event: Event): Event
    fun saveAll(events: List<Event>): List<Event>
    fun deleteById(id: EventId)
    fun deleteAllById(ids: List<EventId>)

}
