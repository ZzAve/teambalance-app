package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EventReference
import java.time.Instant
import java.util.UUID

data class PotentialEvent(
    val eventTypeId: UUID,
    val title: String,
    val description: String?,
    val startTime: Instant,
    val endTime: Instant,
    val location: String?,
    val references: List<EventReference> = emptyList(),
)
