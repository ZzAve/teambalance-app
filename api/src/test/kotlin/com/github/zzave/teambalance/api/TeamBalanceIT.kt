package com.github.zzave.teambalance.api

import io.kotest.core.spec.style.FunSpec
import io.kotest.extensions.spring.SpringTestExtension
import io.kotest.extensions.spring.SpringTestLifecycleMode
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.test.context.ContextConfiguration
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

@SpringBootTest
@ContextConfiguration(initializers = [TeamBalanceIT.Initializer::class])
abstract class TeamBalanceIT : FunSpec() {

    override fun extensions() = listOf(SpringTestExtension(SpringTestLifecycleMode.Test))

    companion object {
        val postgres: PostgreSQLContainer<*> = PostgreSQLContainer("postgres:17-alpine")
            .also { it.start() }

        val redis: GenericContainer<*> = GenericContainer(DockerImageName.parse("redis:7-alpine"))
            .withExposedPorts(6379)
            .also { it.start() }
    }

    class Initializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(ctx: ConfigurableApplicationContext) {
            val env = ctx.environment.systemProperties
            env["spring.datasource.url"] = postgres.jdbcUrl
            env["spring.datasource.username"] = postgres.username
            env["spring.datasource.password"] = postgres.password
            env["spring.data.redis.host"] = redis.host
            env["spring.data.redis.port"] = redis.getMappedPort(6379).toString()
        }
    }
}
