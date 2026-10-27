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
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.springframework.beans.factory.annotation.Value
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

    /**
     * The grant key is read only when connecting is switched on, so a deployment with it off (the
     * default) boots without `TEAMBALANCE_BUNQ_TOKEN_ENCRYPTION_KEY`; switched on with a missing or
     * malformed key it fails at startup like the sibling keys.
     */
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
        @Value("\${teambalance.api-base-url}") apiBaseUrl: String,
        @Value("\${teambalance.bunq.connect-enabled}") connectEnabled: Boolean,
        @Value("\${teambalance.bunq.token-encryption-key:}") tokenEncryptionKey: String,
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
        connectConfig = if (connectEnabled) {
            BunqConnectConfig(
                grantCipher = TokenCipher.fromBase64Key(tokenEncryptionKey, "teambalance.bunq.token-encryption-key"),
                callbackUrl = apiBaseUrl.trimEnd('/') + BunqConnectionService.CALLBACK_PATH,
            )
        } else {
            null
        },
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
