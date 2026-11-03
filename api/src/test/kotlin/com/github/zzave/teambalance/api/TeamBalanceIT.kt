package com.github.zzave.teambalance.api

import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.infrastructure.email.FakeEmailGateway
import com.github.zzave.teambalance.api.infrastructure.persistence.FaultInjectingEventRepositoryConfig
import com.github.zzave.teambalance.api.infrastructure.persistence.FaultInjectingUserRepositoryConfig
import com.github.zzave.teambalance.api.infrastructure.persistence.SqlFaultInjectorConfig
import com.github.zzave.teambalance.api.interfaces.SwitchableBunqGatewayConfig
import io.kotest.core.spec.style.FunSpec
import io.kotest.extensions.spring.SpringTestExtension
import io.kotest.extensions.spring.SpringTestLifecycleMode
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.testcontainers.containers.PostgreSQLContainer

@SpringBootTest
@ActiveProfiles("test")
@ContextConfiguration(initializers = [TeamBalanceIT.Initializer::class])
@Import(TeamBalanceIT.SharedTestDoubles::class)
abstract class TeamBalanceIT : FunSpec() {

    init {
        extension(SpringTestExtension(SpringTestLifecycleMode.Test))
    }

    companion object {
        val postgres: PostgreSQLContainer<*> = PostgreSQLContainer("postgres:17-alpine")
            .also { it.start() }
    }

    class Initializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(ctx: ConfigurableApplicationContext) {
            val env = ctx.environment.systemProperties
            env["spring.datasource.url"] = postgres.jdbcUrl
            env["spring.datasource.username"] = postgres.username
            env["spring.datasource.password"] = postgres.password
        }
    }

    /**
     * Every test double an IT needs, registered in every context, so classes that differ only in the
     * doubles they use share one cached Spring context instead of booting their own. The fault
     * injectors pass through unless a test uses their sentinel value, and the Bunq gateway unless a
     * test switches it. Skipped under `prod` (no fake Bunq adapter to wrap) and `e2e` (its own
     * recording email adapter), so those contexts keep their real beans.
     */
    @TestConfiguration
    @Profile("!prod & !e2e")
    @Import(
        SwitchableBunqGatewayConfig::class,
        FaultInjectingEventRepositoryConfig::class,
        FaultInjectingUserRepositoryConfig::class,
        SqlFaultInjectorConfig::class,
    )
    class SharedTestDoubles {
        @Bean
        @Primary
        fun emailGateway(): EmailGateway = FakeEmailGateway()
    }
}
