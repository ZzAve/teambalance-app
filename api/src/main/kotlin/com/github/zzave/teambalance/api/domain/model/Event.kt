package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Event(
    val id: EventId,
    val eventType: EventType,
    val title: EventTitle,
    val description: EventDescription?,
    val startTime: Instant,
    val endTime: Instant,
    val location: EventLocation?,
    val references: List<EventReference> = emptyList(),
    val recurringGroup: UUID?,
    val createdBy: UserId,
    val createdAt: Instant,
    /**
     * This occurrence's own roster requirement, or null to **inherit** [eventType]'s
     * [EventType.rosterDefault] — and to keep inheriting it, so a later edit of the default moves
     * this event too. That dynamic inheritance is what lets a recurring series follow its type
     * without rewriting every occurrence.
     *
     * When set, it is a **whole replacement** of the default, never a patch of it: there is no
     * per-position partial inheritance to reason about, so "what does this event need?" has exactly
     * one answer and one place to look.
     */
    val rosterOverride: RosterRequirement? = null,
) {
    init {
        require(references.size <= MAX_REFERENCES) {
            "An event may have at most $MAX_REFERENCES references"
        }
    }

    companion object {
        const val MAX_REFERENCES = 10
    }
}
