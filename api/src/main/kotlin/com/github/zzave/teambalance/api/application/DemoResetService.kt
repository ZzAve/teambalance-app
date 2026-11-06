package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.port.DemoResetGateway
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.Duration
import java.util.concurrent.atomic.AtomicReference
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

/**
 * Lazy hourly reset of the demo database (ADR-0043). There is no scheduler: the next guest login after
 * [resetAfter] runs it. The boot counts as a reset, since the demo container starts on an empty database.
 * One instance serves the demo (max-scale 1), so the last reset time and the lock live in memory.
 */
class DemoResetService(
    private val gateway: DemoResetGateway,
    private val clock: Clock,
    private val resetAfter: Duration,
) {
    private val log = LoggerFactory.getLogger(DemoResetService::class.java)
    private val lock = ReentrantLock()

    private val lastResetAt = AtomicReference(clock.instant())

    fun resetIfDue() {
        if (!due()) return
        lock.withLock {
            // Concurrent callers queue on the lock; the first one resets, the rest find it no longer due.
            if (!due()) return
            log.info("Resetting the demo database (last reset at {})", lastResetAt.get())
            gateway.reset()
            lastResetAt.set(clock.instant())
        }
    }

    private fun due() = Duration.between(lastResetAt.get(), clock.instant()) > resetAfter
}
