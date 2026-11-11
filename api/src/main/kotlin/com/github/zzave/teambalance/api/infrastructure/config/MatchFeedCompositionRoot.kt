package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.MatchFeedService
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.MatchFeedGateway
import com.github.zzave.teambalance.api.domain.port.MatchFeedRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock
import java.time.Duration

/** Composition root for the Nevobo match feed (ADR-0047). */
@Configuration
class MatchFeedCompositionRoot {

    @Bean
    fun matchFeedService(
        matchFeedRepository: MatchFeedRepository,
        matchFeedGateway: MatchFeedGateway,
        eventRepository: EventRepository,
        authorizationService: AuthorizationService,
        clock: Clock,
        @Value("\${teambalance.match-feed.check-interval:PT24H}") checkInterval: Duration,
    ) = MatchFeedService(
        repository = matchFeedRepository,
        gateway = matchFeedGateway,
        eventRepository = eventRepository,
        authorizationService = authorizationService,
        clock = clock,
        checkInterval = checkInterval,
    )
}
