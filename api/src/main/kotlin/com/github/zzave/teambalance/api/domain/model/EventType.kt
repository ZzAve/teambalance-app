package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

data class EventType(
    val id: UUID,
    val name: String,
    val color: String?,
)
