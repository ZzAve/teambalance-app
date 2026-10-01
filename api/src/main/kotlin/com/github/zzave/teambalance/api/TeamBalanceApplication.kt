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
    // startup-time optimization is judged against. See
    // docs/adr/0036-jvm-startup-time-tuning-without-native-image.md.
    app.applicationStartup = BufferingApplicationStartup(STARTUP_EVENT_CAPACITY)
    // Kicks a throwaway JDBC connection on a daemon thread (prod only) to overlap the scale-to-zero
    // Serverless-SQL resume with the classload gap that runs anyway (ADR-0036).
    app.addListeners(DatabaseWarmupListener())
    app.run(*args)
}
