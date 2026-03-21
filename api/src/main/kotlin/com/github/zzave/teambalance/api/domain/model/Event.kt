package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Event(
    val id: UUID,
    val eventType: EventType,
    val title: String,
    val description: String?,
    val startTime: Instant,
    val endTime: Instant?,
    val location: String?,
    val createdBy: UUID,
    val createdAt: Instant,
)
