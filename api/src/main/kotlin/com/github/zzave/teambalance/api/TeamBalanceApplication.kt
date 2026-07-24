package com.github.zzave.teambalance.api

import com.github.zzave.teambalance.api.infrastructure.startup.DatabaseWarmupListener
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.metrics.buffering.BufferingApplicationStartup

@SpringBootApplication
class TeamBalanceApplication

// Ring-buffer capacity for the startup timing tree — large enough to hold every boot step without
// truncation; BufferingApplicationStartup drops the oldest events once exceeded.
private const val STARTUP_EVENT_CAPACITY = 2048

fun main(args: Array<String>) {
    val app = SpringApplication(TeamBalanceApplication::class.java)
    // BufferingApplicationStartup records a per-step timing tree (component scan, condition eval,
    // bean init) that the `startup` actuator endpoint exports — the machine-readable scoreboard the
    // startup-time optimization plan is judged against. See docs/plans/2026-07-24-startup-time-optimization.md.
    app.setApplicationStartup(BufferingApplicationStartup(STARTUP_EVENT_CAPACITY))
    // Kicks a throwaway JDBC connection on a daemon thread (prod only) to overlap the scale-to-zero
    // Serverless-SQL resume with the classload gap that runs anyway — Phase 3 of the plan.
    app.addListeners(DatabaseWarmupListener())
    app.run(*args)
}
