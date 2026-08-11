package com.github.zzave.teambalance.api.domain.model

data class User(
    val id: UserId,
    val email: Email,
    val displayName: DisplayName,
)
