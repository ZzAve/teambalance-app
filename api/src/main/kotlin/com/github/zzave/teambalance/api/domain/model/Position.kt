package com.github.zzave.teambalance.api.domain.model

/**
 * A per-team position (e.g. "Setter", "Libero", "Trainer") that members can be assigned to.
 *
 * [kind] decides whether holding it counts toward an event's headcount target — see [PositionKind].
 * It defaults to [PositionKind.PLAYING] so every position that existed before the distinction did
 * keeps behaving exactly as it used to.
 */
data class Position(
    val id: PositionId,
    val label: PositionLabel,
    val kind: PositionKind = PositionKind.PLAYING,
)
