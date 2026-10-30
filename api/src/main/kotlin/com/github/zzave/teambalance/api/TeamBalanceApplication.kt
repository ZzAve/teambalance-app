package com.github.zzave.teambalance.api

import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.metrics.buffering.BufferingApplicationStartup
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration
import java.nio.file.Path
import kotlin.io.path.readText

// No username/password login exists (sign-in is a magic link onto a session, SecurityConfig), so Boot's
// default in-memory user with a generated password is not created.
@SpringBootApplication(exclude = [UserDetailsServiceAutoConfiguration::class])
@ConfigurationPropertiesScan
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
    app.run(*args)
    logStartupCpu()
}

// Logged once after `Started …` to show whether the boot was CPU-throttled (ADR-0036): the cgroup v2
// quota and throttle counters, plus the JVM's own CPU time in case the sandbox hides the cgroup files.
private fun logStartupCpu() {
    fun cgroup(file: String) = runCatching { Path.of("/sys/fs/cgroup", file).readText().trim().replace('\n', ' ') }
        .getOrDefault("unavailable")
    val processCpuMs = ProcessHandle.current().info().totalCpuDuration().map { it.toMillis() }.orElse(-1)
    LoggerFactory.getLogger(TeamBalanceApplication::class.java).info(
        "Startup CPU: process_cpu_ms={} processors={} cpu.max=[{}] cpu.stat=[{}]",
        processCpuMs,
        Runtime.getRuntime().availableProcessors(),
        cgroup("cpu.max"),
        cgroup("cpu.stat"),
    )
}
