package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary

const val FAULT_INJECTED_TITLE = "Atomic Series"
const val FAIL_ON_SAVE = 3

/**
 * Fails the [failOnSave]th persist of a [titleTrigger] event, after earlier rows in the same batch
 * have already been written — the fault that exposes whether a multi-row write is spanned by a
 * transaction.
 *
 * It decorates the Spring Data repository rather than the [EventRepository] port on purpose: the
 * transaction is now owned by [JpaEventRepositoryAdapter], so a fault injected *above* the adapter
 * would fire between transactions and could never demonstrate a rollback. Injecting it here puts the
 * failure inside the adapter's transaction, which is exactly where a real persistence failure lands.
 *
 * IllegalArgumentException so the failure surfaces as a mapped 400 rather than a container-level
 * rethrow; the rollback happens inside the adapter call either way.
 */
class FaultInjectingEventRepository(
    private val delegate: SpringDataEventRepository,
    private val failOnSave: Int,
    private val titleTrigger: String,
) : SpringDataEventRepository by delegate {
    private var saves = 0

    override fun <S : EventJpaEntity> save(entity: S): S {
        if (entity.title == titleTrigger && ++saves == failOnSave) {
            throw IllegalArgumentException("injected persistence failure on save #$failOnSave")
        }
        return delegate.save(entity)
    }
}

@TestConfiguration
class FaultInjectingEventRepositoryConfig {
    @Bean
    @Primary
    fun faultInjectingEventRepository(
        @Qualifier("springDataEventRepository") delegate: SpringDataEventRepository,
    ): SpringDataEventRepository =
        FaultInjectingEventRepository(delegate, failOnSave = FAIL_ON_SAVE, titleTrigger = FAULT_INJECTED_TITLE)
}
