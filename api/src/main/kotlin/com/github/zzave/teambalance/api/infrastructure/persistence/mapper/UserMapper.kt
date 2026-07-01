package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.UserJpaEntity

fun UserJpaEntity.internalize() = User(
    id = id,
    email = email,
    displayName = displayName,
)

fun User.externalize() = UserJpaEntity(
    id = id,
    email = email,
    displayName = displayName,
)
