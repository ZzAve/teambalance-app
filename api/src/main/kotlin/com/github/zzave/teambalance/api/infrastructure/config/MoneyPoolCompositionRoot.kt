package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.MoneyPoolService
import com.github.zzave.teambalance.api.application.TopUpService
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * Composition root for the **money pool** area (ADR-0042), sibling to [SeasonCompositionRoot].
 */
@Configuration
class MoneyPoolCompositionRoot {

    @Bean
    fun moneyPoolService(
        settingsRepository: MoneyPoolSettingsRepository,
        connectionRepository: BunqConnectionRepository,
        seasonRepository: SeasonRepository,
        bunqGateway: BunqGateway,
        clock: Clock,
        authorizationService: AuthorizationService,
    ) = MoneyPoolService(
        settingsRepository = settingsRepository,
        connectionRepository = connectionRepository,
        seasonRepository = seasonRepository,
        bunqGateway = bunqGateway,
        clock = clock,
        authorizationService = authorizationService,
    )

    @Bean
    fun topUpService(
        settingsRepository: MoneyPoolSettingsRepository,
        teamRepository: TeamRepository,
        teamMemberRepository: TeamMemberRepository,
    ) = TopUpService(
        settingsRepository = settingsRepository,
        teamRepository = teamRepository,
        teamMemberRepository = teamMemberRepository,
    )
}
