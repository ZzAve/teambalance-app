package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.BunqConnectConfig
import com.github.zzave.teambalance.api.application.DemoPersona
import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.application.MoneyPoolReader
import com.github.zzave.teambalance.api.application.MoneyPoolService
import com.github.zzave.teambalance.api.application.ReceiptService
import com.github.zzave.teambalance.api.application.PaymentAliasService
import com.github.zzave.teambalance.api.application.PaymentClaimService
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.application.TopUpService
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.ReceiptRepository
import com.github.zzave.teambalance.api.domain.port.PaymentAliasRepository
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
    fun moneyPoolReader(
        connectionRepository: BunqConnectionRepository,
        seasonRepository: SeasonRepository,
        bunqGateway: BunqGateway,
        @Qualifier(BunqGrantCipherConfiguration.BEAN_NAME) bunqGrantCipher: TokenCipher,
        clock: Clock,
        tenantScopeGateway: TenantScopeGateway,
    ) = MoneyPoolReader(
        connectionRepository = connectionRepository,
        seasonRepository = seasonRepository,
        bunqGateway = bunqGateway,
        grantCipher = bunqGrantCipher,
        clock = clock,
        tenantScopeGateway = tenantScopeGateway,
    )

    @Bean
    fun moneyPoolService(
        settingsRepository: MoneyPoolSettingsRepository,
        connectionRepository: BunqConnectionRepository,
        authorizationService: AuthorizationService,
        moneyPoolCache: MoneyPoolCacheGateway,
        receiptRepository: ReceiptRepository,
        paymentAliasRepository: PaymentAliasRepository,
        teamMemberRepository: TeamMemberRepository,
        @Value("\${teambalance.demo.enabled:false}") demoEnabled: Boolean,
    ) = MoneyPoolService(
        settingsRepository = settingsRepository,
        connectionRepository = connectionRepository,
        authorizationService = authorizationService,
        cache = moneyPoolCache,
        receiptRepository = receiptRepository,
        paymentAliasRepository = paymentAliasRepository,
        teamMemberRepository = teamMemberRepository,
        demoTeam = DemoPersona.TEAM_ID.takeIf { demoEnabled },
    )

    @Bean
    fun receiptService(
        receiptRepository: ReceiptRepository,
        moneyPoolService: MoneyPoolService,
        authorizationService: AuthorizationService,
    ) = ReceiptService(
        receiptRepository = receiptRepository,
        moneyPoolService = moneyPoolService,
        authorizationService = authorizationService,
    )

    @Bean
    fun paymentClaimService(moneyPoolService: MoneyPoolService, paymentAliasService: PaymentAliasService) =
        PaymentClaimService(moneyPoolService, paymentAliasService)

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
        @Value("\${teambalance.bunq.environment}") bunqEnvironment: String,
        @Value("\${teambalance.api-base-url}") apiBaseUrl: String,
        @Value("\${teambalance.bunq.connect-enabled}") connectEnabled: Boolean,
        moneyPoolCache: MoneyPoolCacheGateway,
        @Value("\${teambalance.demo.enabled:false}") demoEnabled: Boolean,
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
        connectConfig = bunqConnectConfig(
            connectEnabled,
            environment.matchesProfiles("prod"),
            bunqEnvironment,
            bunqGrantCipher,
            apiBaseUrl,
        ),
        moneyPoolCache = moneyPoolCache,
        demoTeam = DemoPersona.TEAM_ID.takeIf { demoEnabled },
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
 * The connect settings, or null while connecting is switched off. In prod, switching it on is allowed only with the
 * production Bunq environment: with any other environment the app does not start, so the fake and the sandbox can never
 * be connected to in prod.
 */
internal fun bunqConnectConfig(
    connectEnabled: Boolean,
    isProd: Boolean,
    bunqEnvironment: String,
    grantCipher: TokenCipher,
    apiBaseUrl: String,
): BunqConnectConfig? {
    if (!connectEnabled) return null
    check(!isProd || bunqEnvironment.trim().equals("production", ignoreCase = true)) {
        "TEAMBALANCE_BUNQ_CONNECT_ENABLED can only be true in prod when TEAMBALANCE_BUNQ_ENVIRONMENT is production " +
            "(it is \"$bunqEnvironment\"). Set TEAMBALANCE_BUNQ_ENVIRONMENT to production, or " +
            "TEAMBALANCE_BUNQ_CONNECT_ENABLED to false."
    }
    return BunqConnectConfig(grantCipher, apiBaseUrl.trimEnd('/') + BunqConnectionService.CALLBACK_PATH)
}
