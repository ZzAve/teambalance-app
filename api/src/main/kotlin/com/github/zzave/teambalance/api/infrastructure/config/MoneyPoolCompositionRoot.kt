package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.BunqConnectConfig
import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.application.MoneyPoolService
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.application.TopUpService
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
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
        @Qualifier(BunqGrantCipherConfiguration.BEAN_NAME) bunqGrantCipher: TokenCipher,
        clock: Clock,
        authorizationService: AuthorizationService,
        moneyPoolCache: MoneyPoolCacheGateway,
    ) = MoneyPoolService(
        settingsRepository = settingsRepository,
        connectionRepository = connectionRepository,
        seasonRepository = seasonRepository,
        bunqGateway = bunqGateway,
        grantCipher = bunqGrantCipher,
        clock = clock,
        authorizationService = authorizationService,
        cache = moneyPoolCache,
    )

    @Bean
    @Suppress("LongParameterList")
    fun bunqConnectionService(
        connectionRepository: BunqConnectionRepository,
        stateRepository: BunqOAuthStateRepository,
        bunqGateway: BunqGateway,
        tenantScopeGateway: TenantScopeGateway,
        teamRepository: TeamRepository,
        teamMemberRepository: TeamMemberRepository,
        actAsService: ActAsService,
        authorizationService: AuthorizationService,
        clock: Clock,
        @Qualifier(BunqGrantCipherConfiguration.BEAN_NAME) bunqGrantCipher: TokenCipher,
        environment: Environment,
        @Value("\${teambalance.api-base-url}") apiBaseUrl: String,
        @Value("\${teambalance.bunq.connect-enabled}") connectEnabled: Boolean,
    ) = BunqConnectionService(
        connectionRepository = connectionRepository,
        stateRepository = stateRepository,
        bunqGateway = bunqGateway,
        tenantScopeGateway = tenantScopeGateway,
        teamRepository = teamRepository,
        teamMemberRepository = teamMemberRepository,
        actAsService = actAsService,
        authorizationService = authorizationService,
        clock = clock,
        connectConfig = bunqConnectConfig(connectEnabled, environment.matchesProfiles("prod"), bunqGrantCipher, apiBaseUrl),
    )

    @Bean
    fun topUpService(
        settingsRepository: MoneyPoolSettingsRepository,
        teamRepository: TeamRepository,
        teamMemberRepository: TeamMemberRepository,
        actAsGateway: ActAsGateway,
    ) = TopUpService(
        settingsRepository = settingsRepository,
        teamRepository = teamRepository,
        teamMemberRepository = teamMemberRepository,
        actAsGateway = actAsGateway,
    )
}

/**
 * The connect settings, or null while connecting is switched off. Switching it on in prod, where the
 * gateway is the unconfigured one until the real adapter exists (slice 4), stops the app from starting:
 * every attempt would otherwise save a state and then fail with a 500.
 */
internal fun bunqConnectConfig(
    connectEnabled: Boolean,
    isProd: Boolean,
    grantCipher: TokenCipher,
    apiBaseUrl: String,
): BunqConnectConfig? {
    if (!connectEnabled) return null
    check(!isProd) {
        "teambalance.bunq.connect-enabled cannot be on in prod: there is no real Bunq adapter yet"
    }
    return BunqConnectConfig(grantCipher, apiBaseUrl.trimEnd('/') + BunqConnectionService.CALLBACK_PATH)
}
