package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.port.DemoResetGateway
import com.github.zzave.teambalance.api.infrastructure.demo.DemoResetAdapter
import com.zaxxer.hikari.HikariDataSource
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.testcontainers.containers.PostgreSQLContainer
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.util.concurrent.atomic.AtomicInteger

/**
 * A reset drops every schema of its database, so the reset ITs get a Postgres of their own: the container
 * every other IT shares must never see a reset.
 */
class OwnPostgresInitializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
    override fun initialize(ctx: ConfigurableApplicationContext) {
        val env = ctx.environment.systemProperties
        env["spring.datasource.url"] = postgres.jdbcUrl
        env["spring.datasource.username"] = postgres.username
        env["spring.datasource.password"] = postgres.password
    }

    companion object {
        private val postgres: PostgreSQLContainer<*> = PostgreSQLContainer("postgres:17-alpine").also { it.start() }

        /** Asserted by the ITs before they reset anything: a context that picked up the shared database must not run. */
        fun requireOwnDatabase(jdbcTemplate: JdbcTemplate) {
            val url = jdbcTemplate.dataSource!!.unwrap(HikariDataSource::class.java).jdbcUrl
            check(url == postgres.jdbcUrl) { "not the reset IT's own Postgres: $url" }
        }
    }
}

class MovableClock : Clock() {
    @Volatile
    private var offset: Duration = Duration.ZERO

    fun advance(by: Duration) {
        offset += by
    }

    override fun getZone(): ZoneId = ZoneId.of("Europe/Amsterdam")

    override fun withZone(zone: ZoneId): Clock = this

    override fun instant(): Instant = Instant.now().plus(offset)
}

/** Counts the resets that reach the real adapter. */
class CountingResetGateway(private val real: DemoResetAdapter) : DemoResetGateway {
    val resets = AtomicInteger()

    override fun reset() {
        resets.incrementAndGet()
        real.reset()
    }
}

@TestConfiguration
class DemoResetTestBeans {
    @Bean
    @Primary
    fun movableClock() = MovableClock()

    @Bean
    @Primary
    fun countingResetGateway(real: DemoResetAdapter) = CountingResetGateway(real)
}
