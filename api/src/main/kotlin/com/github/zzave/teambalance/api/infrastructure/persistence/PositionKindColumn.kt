package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.PositionKind

internal fun PositionKind.toDbValue(): String = when (this) {
    PositionKind.PLAYING -> "PLAYING"
    PositionKind.STAFF -> "STAFF"
}

internal fun String.toPositionKind(): PositionKind = when (this) {
    "PLAYING" -> PositionKind.PLAYING
    "STAFF" -> PositionKind.STAFF
    else -> error("Unknown position kind in the database: '$this'")
}
