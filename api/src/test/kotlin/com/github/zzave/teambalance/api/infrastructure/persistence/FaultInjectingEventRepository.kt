package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.EventRepository
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary

const val FAULT_INJECTED_TITLE = "Atomic Series"
const val FAIL_ON_SAVE = 3

/**
 * Fails the [failOnSave]th save of a [titleTrigger] event, after earlier saves in the same batch have
 * already gone through the real adapter — the fault that exposes whether a multi-step write is
 * spanned by a transaction. IllegalArgumentException so the failure surfaces as a mapped 400 rather
 * than a container-level rethrow; the rollback happens inside the service call either way.
 *
 * Lives in the adapter layer, like the adapter it decorates, so an interfaces-level test can use it
 * without reaching across layers (ArchitectureTest forbids interfaces -> infrastructure).
 */
class FaultInjectingEventRepository(
    private val delegate: EventRepository,
    private val failOnSave: Int,
    private val titleTrigger: String,
) : EventRepository by delegate {
    private var saves = 0

    override fun save(event: Event): Event {
        if (event.title == titleTrigger && ++saves == failOnSave) {
            throw IllegalArgumentException("injected adapter failure on save #$failOnSave")
        }
        return delegate.save(event)
    }
}

@TestConfiguration
class FaultInjectingEventRepositoryConfig {
    @Bean
    @Primary
    fun faultInjectingEventRepository(delegate: JpaEventRepositoryAdapter): EventRepository =
        FaultInjectingEventRepository(delegate, failOnSave = FAIL_ON_SAVE, titleTrigger = FAULT_INJECTED_TITLE)
}
