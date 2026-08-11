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
    val location: String?,
    val references: List<EventReference> = emptyList(),
    val recurringGroup: UUID?,
    val createdBy: UserId,
    val createdAt: Instant,
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
