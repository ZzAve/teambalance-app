package com.github.zzave.teambalance.api.infrastructure.startup

import org.slf4j.LoggerFactory
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent
import org.springframework.context.ApplicationListener
import java.sql.DriverManager
import java.sql.SQLException

/**
 * Phase 3 of the startup-time optimization: overlap the Serverless-SQL cold resume with the
 * ~10.6s classload/condition-eval gap that runs anyway, so the ~5s DB resume no longer sits
 * serially on the boot critical path. See docs/plans/2026-07-24-startup-time-optimization.md.
 *
 * The prod DB (Scaleway Serverless SQL) scales to zero after ~5 min idle; a redeploy after an idle
 * window means Hikari's first connection (~15s into boot) pays a ~5s resume. This listener fires on
 * [ApplicationEnvironmentPreparedEvent] — which fires ~10s before Hikari starts — and, on a daemon
 * thread, opens then immediately closes one throwaway JDBC connection to kick that resume in
 * parallel. By the time Hikari starts, the DB is already awake.
 *
 * Fire-and-forget: it never blocks boot and never throws — any failure is swallowed to a warning.
 * The real connection pool is still established the normal way, so a failed warm-up costs nothing
 * but the (already-parallel) attempt. Prod-only; other profiles talk to an always-on local DB.
 */
class DatabaseWarmupListener : ApplicationListener<ApplicationEnvironmentPreparedEvent> {
    private val log = LoggerFactory.getLogger(DatabaseWarmupListener::class.java)

    override fun onApplicationEvent(event: ApplicationEnvironmentPreparedEvent) {
        val environment = event.environment
        if (!environment.activeProfiles.contains(PROD_PROFILE)) {
            return
        }
        val url = environment.getProperty("spring.datasource.url") ?: return
        val user = environment.getProperty("spring.datasource.username")
        val password = environment.getProperty("spring.datasource.password")

        Thread {
            try {
                DriverManager.getConnection(url, user, password).use { connection ->
                    connection.isValid(VALIDATION_TIMEOUT_SECONDS)
                }
                log.info("DB warm-up connection succeeded; Serverless-SQL resume overlapped with boot")
            } catch (ex: SQLException) {
                log.warn("DB warm-up connection failed (boot continues normally): {}", ex.message)
            }
        }.apply {
            name = "db-warmup"
            isDaemon = true
            start()
        }
    }

    private companion object {
        const val PROD_PROFILE = "prod"
        const val VALIDATION_TIMEOUT_SECONDS = 5
    }
}
