package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MagicLinkTokenJpaEntity

fun MagicLinkTokenJpaEntity.internalize() = MagicLinkToken(
    id = id,
    tokenHash = tokenHash,
    email = Email(email),
    expiresAt = expiresAt,
    usedAt = usedAt,
    createdAt = createdAt,
)

fun MagicLinkToken.externalize() = MagicLinkTokenJpaEntity(
    id = id,
    tokenHash = tokenHash,
    email = email.value,
    expiresAt = expiresAt,
    usedAt = usedAt,
    createdAt = createdAt,
)
