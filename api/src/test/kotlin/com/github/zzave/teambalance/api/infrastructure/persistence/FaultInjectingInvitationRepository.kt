package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.InvitationJpaEntity
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary

/**
 * Fails every attempt to persist an invitation, leaving the preceding `expireActive` in the same
 * rotate call already applied — the fault that exposes whether the expire and the mint really share
 * one transaction.
 *
 * Decorates the Spring Data repository rather than the [InvitationRepository] port, for the same
 * reason [FaultInjectingEventRepository] does: the transaction is owned by
 * [JpaInvitationRepositoryAdapter], so a fault injected above the adapter would fire outside it and
 * could never demonstrate a rollback.
 */
class FaultInjectingInvitationRepository(
    private val delegate: SpringDataInvitationRepository,
) : SpringDataInvitationRepository by delegate {

    override fun <S : InvitationJpaEntity> save(entity: S): S =
        throw IllegalArgumentException("injected persistence failure minting the replacement invitation")
}

@TestConfiguration
class FaultInjectingInvitationRepositoryConfig {
    @Bean
    @Primary
    fun faultInjectingInvitationRepository(
        @Qualifier("springDataInvitationRepository") delegate: SpringDataInvitationRepository,
    ): SpringDataInvitationRepository = FaultInjectingInvitationRepository(delegate)
}
