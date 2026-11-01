package com.github.zzave.teambalance.api

import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.metrics.buffering.BufferingApplicationStartup
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration
import java.nio.file.Path
import kotlin.io.path.listDirectoryEntries
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
    val threads = runCatching {
        Path.of("/proc/self/task").listDirectoryEntries().mapNotNull { parseThreadStat(it.resolve("stat").readText()) }
    }.getOrDefault(emptyList())
    val log = LoggerFactory.getLogger(TeamBalanceApplication::class.java)
    log.info(
        "Startup CPU: process_cpu_ms={} processors={} cpu.max=[{}] cpu.stat=[{}]",
        processCpuMs,
        Runtime.getRuntime().availableProcessors(),
        cgroup("cpu.max"),
        cgroup("cpu.stat"),
    )
    // User vs system time shows how much CPU goes to the kernel (in gVisor: the Sentry handling syscalls).
    log.info(
        "Startup CPU per thread (ticks): user={} system={} threads={} top=[{}]",
        threads.sumOf { it.userTicks },
        threads.sumOf { it.systemTicks },
        threads.size,
        threads.sortedByDescending { it.userTicks + it.systemTicks }.take(TOP_THREADS)
            .joinToString { "${it.name}=${it.userTicks}+${it.systemTicks}" },
    )
}

private const val TOP_THREADS = 8

internal data class ThreadCpu(val name: String, val userTicks: Long, val systemTicks: Long)

// One line of /proc/<pid>/task/<tid>/stat. The name is in parentheses and may contain spaces, so the
// fields are counted from the last ')'; utime and stime are fields 14 and 15 (proc(5)).
internal fun parseThreadStat(line: String): ThreadCpu? {
    val fields = line.substringAfterLast(')').trim().split(' ')
    val userTicks = fields.getOrNull(UTIME_AFTER_NAME)?.toLongOrNull()
    val systemTicks = fields.getOrNull(STIME_AFTER_NAME)?.toLongOrNull()
    if (userTicks == null || systemTicks == null) return null
    return ThreadCpu(line.substringAfter('(').substringBeforeLast(')'), userTicks, systemTicks)
}

// Positions of utime/stime counted from field 3 (state), the first field after the name.
private const val UTIME_AFTER_NAME = 11
private const val STIME_AFTER_NAME = 12
