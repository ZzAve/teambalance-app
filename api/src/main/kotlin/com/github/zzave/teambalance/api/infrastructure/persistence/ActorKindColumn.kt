package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.ActorKind

internal fun ActorKind.toDbValue(): String = when (this) {
    ActorKind.MEMBER -> "MEMBER"
    ActorKind.PLATFORM_ADMIN -> "PLATFORM_ADMIN"
}

internal fun String.toActorKind(): ActorKind = when (this) {
    "MEMBER" -> ActorKind.MEMBER
    "PLATFORM_ADMIN" -> ActorKind.PLATFORM_ADMIN
    else -> error("Unknown actor kind in the database: '$this'")
}
