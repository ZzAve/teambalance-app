package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.application.EventTypeService
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
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
 * remaining services (#80) arrive as sibling roots instead of growing a single god-configuration.
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
        // For validating a roster override's position ids against the team's own vocabulary (#219) —
        // the mirror of the position-delete cascade in MembershipCompositionRoot.
        positionRepository: PositionRepository,
        authorizationService: AuthorizationService,
        clock: Clock,
    ) = EventService(
        eventRepository = eventRepository,
        eventTypeRepository = eventTypeRepository,
        seasonRepository = seasonRepository,
        positionRepository = positionRepository,
        authorizationService = authorizationService,
        clock = clock,
    )

    // Event types are the events area's reference data — EventService resolves one on every write.
    // PositionRepository is here for the same reason it is on EventService: a roster default must
    // name positions this team actually has (#219).
    @Bean
    fun eventTypeService(
        eventTypeRepository: EventTypeRepository,
        positionRepository: PositionRepository,
        authorizationService: AuthorizationService,
    ) = EventTypeService(
        eventTypeRepository = eventTypeRepository,
        positionRepository = positionRepository,
        authorizationService = authorizationService,
    )
}
