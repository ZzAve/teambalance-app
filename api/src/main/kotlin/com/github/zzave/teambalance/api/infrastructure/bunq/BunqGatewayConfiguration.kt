package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.application.BunqGrantSeal
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import java.time.Clock

/**
 * Picks the [BunqGateway] from `teambalance.bunq.environment`: the real adapter for `sandbox` and `production`,
 * and for `none` the fake Bunq outside prod ([FakeBunqGatewayAdapter]) and the unconfigured gateway in prod.
 * `fake` is the fake Bunq everywhere, but in prod only while `teambalance.demo.enabled` is on.
 *
 * In prod the choice is made when the bean is created, not by a condition: Spring AOT evaluates conditions while the
 * image is built, where the environment is not set, and would freeze the unconfigured gateway into every image.
 */
@Configuration
class BunqGatewayConfiguration {

    @Bean
    @Profile("prod")
    fun prodBunqGateway(
        properties: BunqClientProperties,
        callProperties: BunqCallProperties,
        contexts: BunqApiContextRepository,
        grantSeal: BunqGrantSeal,
        @Qualifier(BUNQ_GRANT_CIPHER) cipher: TokenCipher,
        currentTeam: CurrentTeamGateway,
        clock: Clock,
        @Value("\${teambalance.api-base-url}") apiBaseUrl: String,
        @Value("\${teambalance.demo.enabled:false}") demoEnabled: Boolean,
    ): BunqGateway = when (properties.environment) {
        BunqEnvironment.NONE -> UnconfiguredBunqGatewayAdapter().also { log.info("Bunq gateway: unconfigured, every Bunq call fails") }
        // The adapter is a scanned bean outside prod only; here the demo switch decides at runtime whether it may exist.
        BunqEnvironment.FAKE -> {
            check(demoEnabled) { "teambalance.bunq.environment=fake is only allowed with teambalance.demo.enabled=true" }
            FakeBunqGatewayAdapter(clock, apiBaseUrl).also { log.info("Bunq gateway: fake, for the demo") }
        }
        BunqEnvironment.SANDBOX, BunqEnvironment.PRODUCTION ->
            realGateway(properties, callProperties, contexts, grantSeal, cipher, currentTeam, clock)
    }

    @Bean
    @Profile("!prod")
    @ConditionalOnExpression("!'\${teambalance.bunq.environment:none}'.matches('(?i)none|fake')")
    fun configuredBunqGateway(
        properties: BunqClientProperties,
        callProperties: BunqCallProperties,
        contexts: BunqApiContextRepository,
        grantSeal: BunqGrantSeal,
        @Qualifier(BUNQ_GRANT_CIPHER) cipher: TokenCipher,
        currentTeam: CurrentTeamGateway,
        clock: Clock,
    ): BunqGateway = realGateway(properties, callProperties, contexts, grantSeal, cipher, currentTeam, clock)

    private fun realGateway(
        properties: BunqClientProperties,
        callProperties: BunqCallProperties,
        contexts: BunqApiContextRepository,
        grantSeal: BunqGrantSeal,
        cipher: TokenCipher,
        currentTeam: CurrentTeamGateway,
        clock: Clock,
    ) = RealBunqGatewayAdapter.create(properties, callProperties, contexts, grantSeal, cipher, currentTeam, clock)
        .also { log.info("Bunq gateway: real adapter, environment {}", properties.environment) }

    private companion object {
        /** The bean name of BunqGrantCipherConfiguration; it is named here because an adapter may not import from another one. */
        const val BUNQ_GRANT_CIPHER = "bunqGrantCipher"
        val log = LoggerFactory.getLogger(BunqGatewayConfiguration::class.java)
    }
}
