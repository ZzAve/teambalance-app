package com.github.zzave.teambalance.api.infrastructure.e2e

import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.util.concurrent.atomic.AtomicReference

/**
 * E2e-profile-only clock that Playwright moves forward through `/internal/e2e/clock/...`, so the hourly demo reset
 * can run in seconds. It replaces the system clock bean (@Primary) only under the `e2e` profile; no other profile
 * registers it or its endpoints, so prod keeps the plain system clock.
 */
@Component
@Primary
@Profile("e2e")
class E2eAdjustableClock : Clock() {
    private val base = Clock.system(ZoneId.of("Europe/Amsterdam"))
    private val offset = AtomicReference(Duration.ZERO)

    fun advance(by: Duration) {
        offset.updateAndGet { it.plus(by) }
    }

    fun back() = offset.set(Duration.ZERO)

    override fun getZone(): ZoneId = base.zone

    override fun withZone(zone: ZoneId): Clock = base.withZone(zone)

    override fun instant(): Instant = base.instant().plus(offset.get())
}

/** GET like the magic-link token hook: a POST would need the CSRF dance, and this is test scaffolding. */
@RestController
@Profile("e2e")
class E2eClockController(private val clock: E2eAdjustableClock) {

    @GetMapping("/internal/e2e/clock/advance")
    fun advance(@RequestParam hours: Long): ResponseEntity<Void> {
        clock.advance(Duration.ofHours(hours))
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/internal/e2e/clock/back")
    fun back(): ResponseEntity<Void> {
        clock.back()
        return ResponseEntity.noContent().build()
    }
}
