package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.InvitationJpaEntity

fun InvitationJpaEntity.internalize() = Invitation(
    id = id,
    teamId = TeamId(teamId),
    role = Role.valueOf(role),
    consumedAt = consumedAt,
    tokenHash = TokenHash(tokenHash),
    encryptedToken = encryptedToken?.let(::EncryptedToken),
    createdBy = UserId(createdBy),
    expiresAt = expiresAt,
    createdAt = createdAt,
)

fun Invitation.externalize() = InvitationJpaEntity(
    id = id,
    teamId = teamId.value,
    role = role.name,
    consumedAt = consumedAt,
    tokenHash = tokenHash.value,
    encryptedToken = encryptedToken?.value,
    createdBy = createdBy.value,
    expiresAt = expiresAt,
    createdAt = createdAt,
)
