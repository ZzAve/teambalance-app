package com.github.zzave.teambalance.api.domain.model

/** A per-team playing position (e.g. "Setter", "Libero") that members can be assigned to. */
data class Position(
    val id: PositionId,
    val label: String,
)
