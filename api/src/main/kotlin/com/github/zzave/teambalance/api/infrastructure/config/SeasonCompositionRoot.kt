package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.SeasonService
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * Composition root for the **season** area (ADR-0018), sibling to [EventCompositionRoot].
 */
@Configuration
class SeasonCompositionRoot {

    @Bean
    fun seasonService(
        seasonRepository: SeasonRepository,
        authorizationService: AuthorizationService,
    ) = SeasonService(
        seasonRepository = seasonRepository,
        authorizationService = authorizationService,
    )
}
