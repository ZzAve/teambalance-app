package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.InvitationJpaEntity

fun InvitationJpaEntity.internalize() = Invitation(
    id = id,
    teamId = teamId,
    tokenHash = tokenHash,
    createdBy = UserId(createdBy),
    expiresAt = expiresAt,
    createdAt = createdAt,
)

fun Invitation.externalize() = InvitationJpaEntity(
    id = id,
    teamId = teamId,
    tokenHash = tokenHash,
    createdBy = createdBy.value,
    expiresAt = expiresAt,
    createdAt = createdAt,
)
