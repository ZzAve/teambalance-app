package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.UserJpaEntity

fun UserJpaEntity.internalize() = User(
    id = UserId(id),
    email = Email(email),
    displayName = DisplayName(displayName),
)

fun User.externalize() = UserJpaEntity(
    id = id.value,
    email = email.value,
    displayName = displayName.value,
)
