package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.MoneyPoolService
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
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
    ) = MoneyPoolService(
        settingsRepository = settingsRepository,
        connectionRepository = connectionRepository,
        seasonRepository = seasonRepository,
        bunqGateway = bunqGateway,
        clock = clock,
    )
}
