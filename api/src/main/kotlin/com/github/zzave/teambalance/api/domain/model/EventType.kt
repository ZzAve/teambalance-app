package com.github.zzave.teambalance.api.domain.model

data class EventType(
    val id: EventTypeId,
    val name: EventTypeName,
    val color: HexColor?,
)
