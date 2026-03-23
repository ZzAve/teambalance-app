package com.github.zzave.teambalance.api.application

import java.time.Instant
import java.util.UUID

data class PotentialEvent(
    val eventTypeId: UUID,
    val title: String,
    val description: String?,
    val startTime: Instant,
    val endTime: Instant,
    val location: String?,
)
