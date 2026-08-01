package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * Composition root for the **events** area (ADR-0018): the one place that knows both these
 * application services and the adapters satisfying their ports. The services themselves stay plain
 * classes — no `@Service`, no `@Transactional`, no Spring on their classpath — so the wiring lives
 * here, in the adapter layer, where framework knowledge belongs.
 *
 * One root per bounded area rather than one for the whole application: each stays readable, and the
 * remaining services (#21, #80) arrive as sibling roots instead of growing a single god-configuration.
 * Services not yet converted are still `@Service`-annotated and are injected here as ordinary beans
 * until their own sub-issue lands.
 */
@Configuration
class EventCompositionRoot {

    @Bean
    fun eventService(
        eventRepository: EventRepository,
        eventTypeRepository: EventTypeRepository,
        seasonRepository: SeasonRepository,
        authorizationService: AuthorizationService,
        clock: Clock,
    ) = EventService(
        eventRepository = eventRepository,
        eventTypeRepository = eventTypeRepository,
        seasonRepository = seasonRepository,
        authorizationService = authorizationService,
        clock = clock,
    )
}
