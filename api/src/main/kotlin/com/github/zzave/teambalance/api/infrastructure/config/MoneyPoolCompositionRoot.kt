package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.AuthorizationService
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
        @Value("\${teambalance.bunq.token-encryption-key}") tokenEncryptionKey: String,
        clock: Clock,
        authorizationService: AuthorizationService,
    ) = MoneyPoolService(
        settingsRepository = settingsRepository,
        connectionRepository = connectionRepository,
        seasonRepository = seasonRepository,
        bunqGateway = bunqGateway,
        grantCipher = grantCipher(tokenEncryptionKey),
        clock = clock,
        authorizationService = authorizationService,
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
        @Value("\${teambalance.bunq.token-encryption-key}") tokenEncryptionKey: String,
        clock: Clock,
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
        grantCipher = grantCipher(tokenEncryptionKey),
        clock = clock,
        callbackUrl = apiBaseUrl.trimEnd('/') + BunqConnectionService.CALLBACK_PATH,
        connectEnabled = connectEnabled,
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

    private fun grantCipher(encodedKey: String) =
        TokenCipher.fromBase64Key(encodedKey, "teambalance.bunq.token-encryption-key")
}
