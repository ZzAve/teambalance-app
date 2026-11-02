package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.BunqConnectionJpaEntity
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaBunqConnectionRepositoryAdapter(
    private val jpaRepository: SpringDataBunqConnectionRepository,
) : BunqConnectionRepository {

    override fun find(): BunqConnection? =
        jpaRepository.findById(BunqConnectionJpaEntity.SINGLETON_ID)
            .map {
                BunqConnection(
                    accountId = it.bunqAccountId?.let(::BunqAccountId),
                    grant = EncryptedToken(it.accessTokenEncrypted),
                    connectedBy = UserId(it.connectedBy),
                    connectedAt = it.connectedAt,
                )
            }
            .orElse(null)

    override fun save(connection: BunqConnection) {
        jpaRepository.save(
            BunqConnectionJpaEntity(
                bunqAccountId = connection.accountId?.value,
                accessTokenEncrypted = connection.grant.value,
                connectedBy = connection.connectedBy.value,
                connectedAt = connection.connectedAt,
            ),
        )
    }

    @Transactional
    override fun pickAccount(accountId: BunqAccountId, ifGrant: EncryptedToken): Boolean =
        jpaRepository.pickAccount(BunqConnectionJpaEntity.SINGLETON_ID, accountId.value, ifGrant.value) == 1

    override fun delete() = jpaRepository.deleteById(BunqConnectionJpaEntity.SINGLETON_ID)
}
