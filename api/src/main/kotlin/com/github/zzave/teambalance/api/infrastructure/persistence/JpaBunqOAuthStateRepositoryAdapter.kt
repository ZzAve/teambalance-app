package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BunqOAuthState
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.BunqOAuthStateJpaEntity
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Repository
class JpaBunqOAuthStateRepositoryAdapter(
    private val jpaRepository: SpringDataBunqOAuthStateRepository,
) : BunqOAuthStateRepository {

    override fun save(state: BunqOAuthState) {
        jpaRepository.save(
            BunqOAuthStateJpaEntity(
                id = state.id,
                stateHash = state.tokenHash.value,
                teamId = state.teamId.value,
                adminUserId = state.adminUserId.value,
                expiresAt = state.expiresAt,
                usedAt = state.usedAt,
                createdAt = state.createdAt,
            ),
        )
    }

    override fun findByTokenHash(tokenHash: TokenHash): BunqOAuthState? =
        jpaRepository.findByStateHash(tokenHash.value)?.let {
            BunqOAuthState(
                id = it.id,
                tokenHash = TokenHash(it.stateHash),
                teamId = TeamId(it.teamId),
                adminUserId = UserId(it.adminUserId),
                expiresAt = it.expiresAt,
                usedAt = it.usedAt,
                createdAt = it.createdAt,
            )
        }

    @Transactional
    override fun consume(id: UUID, now: Instant): Boolean = jpaRepository.consume(id, now) == 1

    @Transactional
    override fun deleteExpiredBefore(cutoff: Instant) = jpaRepository.deleteExpiredBefore(cutoff)
}
