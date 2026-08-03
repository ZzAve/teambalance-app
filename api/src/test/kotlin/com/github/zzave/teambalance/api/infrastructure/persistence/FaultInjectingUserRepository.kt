package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.UserJpaEntity
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary

const val FAULT_USER_EMAIL = "atomic-signin-fault@test.com"

/**
 * Fails the moment the sign-in flow tries to create the user for [FAULT_USER_EMAIL], after the
 * magic-link token has already been stamped used in the same call — the fault that exposes whether
 * consuming the token and resolving the user share one transaction.
 *
 * It decorates the Spring Data repository rather than the [com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository]
 * port for the same reason [FaultInjectingEventRepository] does: the transaction is owned by the
 * adapter, so a fault injected *above* the adapter would fire outside its transaction and could
 * never demonstrate a rollback.
 */
class FaultInjectingUserRepository(
    private val delegate: SpringDataUserRepository,
) : SpringDataUserRepository by delegate {

    override fun <S : UserJpaEntity> save(entity: S): S {
        if (entity.email == FAULT_USER_EMAIL) {
            throw IllegalArgumentException("injected persistence failure creating the user for $FAULT_USER_EMAIL")
        }
        return delegate.save(entity)
    }
}

@TestConfiguration
class FaultInjectingUserRepositoryConfig {
    @Bean
    @Primary
    fun faultInjectingUserRepository(
        @Qualifier("springDataUserRepository") delegate: SpringDataUserRepository,
    ): SpringDataUserRepository = FaultInjectingUserRepository(delegate)
}
