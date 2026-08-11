package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EventReference
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import java.time.Instant
import java.util.UUID

data class PotentialEvent(
    val eventTypeId: EventTypeId,
    val title: EventTitle,
    val description: String?,
    val startTime: Instant,
    val endTime: Instant,
    val location: String?,
    val references: List<EventReference> = emptyList(),
    // A single event belongs to no series; a batch-created occurrence carries its shared group id.
    val recurringGroup: UUID? = null,
)
