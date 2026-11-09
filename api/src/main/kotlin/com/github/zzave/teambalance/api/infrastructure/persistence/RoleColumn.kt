package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Role

// The stored form of a role. Both directions list every constant, so adding one breaks the build here
// instead of failing at runtime. An unknown stored value is corrupt data, not a client error.
internal fun Role.toDbValue(): String = when (this) {
    Role.USER -> "USER"
    Role.ADMIN -> "ADMIN"
}

internal fun String.toRole(): Role = when (this) {
    "USER" -> Role.USER
    "ADMIN" -> Role.ADMIN
    else -> error("Unknown role in the database: '$this'")
}
