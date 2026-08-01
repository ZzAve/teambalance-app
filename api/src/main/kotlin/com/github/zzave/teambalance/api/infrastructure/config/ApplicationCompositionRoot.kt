package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.domain.port.TransactionRunnerPort
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * The composition root (ADR-0018): the one place that knows both the application services and the
 * adapters that satisfy their ports. Services stay plain classes with no `@Service`, no
 * `@Transactional` and no Spring on their classpath — the wiring lives here, in the adapter layer,
 * where framework knowledge belongs.
 *
 * Each service gets one `@Bean` method whose parameters are its ports, so adding the remaining
 * services (#21, #80) is mechanical: move the constructor arguments into a new method and delete the
 * annotations from the service. Services not yet converted are still `@Service`-annotated and are
 * injected here as ordinary beans until their own sub-issue lands.
 */
@Configuration
class ApplicationCompositionRoot {

    @Bean
    fun eventService(
        eventRepository: EventRepository,
        eventTypeRepository: EventTypeRepository,
        seasonRepository: SeasonRepository,
        authorizationService: AuthorizationService,
        transactionRunner: TransactionRunnerPort,
        clock: Clock,
    ) = EventService(
        eventRepository = eventRepository,
        eventTypeRepository = eventTypeRepository,
        seasonRepository = seasonRepository,
        authorizationService = authorizationService,
        transactionRunner = transactionRunner,
        clock = clock,
    )
}
