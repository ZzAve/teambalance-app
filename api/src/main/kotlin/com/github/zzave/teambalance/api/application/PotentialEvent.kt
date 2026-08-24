package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EventDescription
import com.github.zzave.teambalance.api.domain.model.EventLocation
import com.github.zzave.teambalance.api.domain.model.EventReference
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import java.time.Instant
import java.util.UUID

data class PotentialEvent(
    val eventTypeId: EventTypeId,
    val title: EventTitle,
    val description: EventDescription?,
    val startTime: Instant,
    val endTime: Instant,
    val location: EventLocation?,
    val references: List<EventReference> = emptyList(),
    // A single event belongs to no series; a batch-created occurrence carries its shared group id.
    val recurringGroup: UUID? = null,
    // Null means "inherit the event type's default", dynamically — see Event.rosterOverride.
    val rosterOverride: RosterRequirement? = null,
)
