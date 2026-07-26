package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Event
import java.util.UUID

/**
 * The result of materializing a recurring series (ADR-0014): the freshly-minted group id shared by
 * every occurrence, and the concrete events created, in chronological order.
 */
data class RecurringEventSeries(
    val recurringGroup: UUID,
    val events: List<Event>,
)
