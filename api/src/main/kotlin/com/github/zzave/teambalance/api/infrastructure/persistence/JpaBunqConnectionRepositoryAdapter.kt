package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.BunqConnectionJpaEntity
import org.springframework.stereotype.Repository

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

    override fun delete() = jpaRepository.deleteById(BunqConnectionJpaEntity.SINGLETON_ID)
}
