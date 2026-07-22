package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/** A per-team playing position (e.g. "Setter", "Libero") that members can be assigned to. */
data class Position(
    val id: UUID,
    val label: String,
)
