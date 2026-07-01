package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

data class User(
    val id: UUID,
    val email: String,
    val displayName: String,
)
