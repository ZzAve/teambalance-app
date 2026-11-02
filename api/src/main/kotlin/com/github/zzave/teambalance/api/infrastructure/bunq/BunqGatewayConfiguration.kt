package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.model.BunqEnvironment
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

/**
 * Picks the [BunqGateway] from `teambalance.bunq.environment`: the real adapter for `sandbox` and `production`,
 * and for `none` the fake Bunq outside prod ([FakeBunqGatewayAdapter]) and the unconfigured gateway in prod.
 *
 * In prod the choice is made when the bean is created, not by a condition: Spring AOT evaluates conditions while the
 * image is built, where the environment is not set, and would freeze the unconfigured gateway into every image.
 */
@Configuration
class BunqGatewayConfiguration {

    @Bean
    @Profile("prod")
    fun prodBunqGateway(properties: BunqClientProperties): BunqGateway = when (properties.environment) {
        BunqEnvironment.NONE -> UnconfiguredBunqGatewayAdapter().also { log.info("Bunq gateway: unconfigured, every Bunq call fails") }
        BunqEnvironment.SANDBOX, BunqEnvironment.PRODUCTION -> realGateway(properties)
    }

    @Bean
    @Profile("!prod")
    @ConditionalOnExpression("!'\${teambalance.bunq.environment:none}'.equalsIgnoreCase('none')")
    fun configuredBunqGateway(properties: BunqClientProperties): BunqGateway = realGateway(properties)

    private fun realGateway(properties: BunqClientProperties) =
        RealBunqGatewayAdapter(properties).also { log.info("Bunq gateway: real adapter, environment {}", properties.environment) }

    private companion object {
        val log = LoggerFactory.getLogger(BunqGatewayConfiguration::class.java)
    }
}
