package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.BunqConnectionJpaEntity
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

/**
 * Outside a tenant scope there is no connection row, and Hibernate would fail the query (it routes to a schema that does
 * not exist), so both calls answer "none" there. That is the Admin connecting: the callback names no team until it has
 * entered one.
 */
@Repository
class JpaBunqApiContextRepositoryAdapter(
    private val jpaRepository: SpringDataBunqConnectionRepository,
    private val currentTeam: CurrentTeamGateway,
) : BunqApiContextRepository {

    override fun find(): EncryptedToken? =
        if (inTenantScope()) jpaRepository.findApiContext(BunqConnectionJpaEntity.SINGLETON_ID)?.let(::EncryptedToken) else null

    @Transactional
    override fun save(context: EncryptedToken): Boolean =
        inTenantScope() && jpaRepository.storeApiContext(BunqConnectionJpaEntity.SINGLETON_ID, context.value) == 1

    /** The team is resolved together with the tenant schema, so a team means the schema is routed. */
    private fun inTenantScope() = currentTeam.findCurrentTeamId() != null
}
