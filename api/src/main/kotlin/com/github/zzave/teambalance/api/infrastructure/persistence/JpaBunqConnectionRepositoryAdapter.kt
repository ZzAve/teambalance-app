package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.BunqConnectionJpaEntity
import org.springframework.stereotype.Repository

@Repository
class JpaBunqConnectionRepositoryAdapter(
    private val jpaRepository: SpringDataBunqConnectionRepository,
) : BunqConnectionRepository {

    override fun find(): BunqConnection? =
        jpaRepository.findById(BunqConnectionJpaEntity.SINGLETON_ID)
            .map { BunqConnection(accountId = BunqAccountId(it.bunqAccountId)) }
            .orElse(null)
}
