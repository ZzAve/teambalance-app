package com.github.zzave.teambalance.api

import io.kotest.core.spec.style.FunSpec
import io.kotest.extensions.spring.SpringTestExtension
import io.kotest.extensions.spring.SpringTestLifecycleMode
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.testcontainers.containers.PostgreSQLContainer

@SpringBootTest
@ActiveProfiles("test")
@ContextConfiguration(initializers = [TeamBalanceIT.Initializer::class])
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
}
