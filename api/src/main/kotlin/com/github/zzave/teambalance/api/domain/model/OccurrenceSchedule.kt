package com.github.zzave.teambalance.api.domain.model

import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId

/**
 * Resolves a recurring occurrence's calendar date + local time-of-day to absolute instants, in a
 * given civil zone (ADR-0014). Pure and clock-free so the DST behaviour is unit-testable.
 *
 * The start is anchored to the *wall-clock* time in [zone], so a 20:30 training stays at 20:30
 * local on both sides of a daylight-saving transition (the UTC instant shifts by the offset
 * change, the civil time does not). The end is [durationMinutes] of real elapsed time after the
 * start.
 */
object OccurrenceSchedule {

    fun startInstant(date: LocalDate, timeOfDay: LocalTime, zone: ZoneId): Instant =
        date.atTime(timeOfDay).atZone(zone).toInstant()

    fun endInstant(start: Instant, durationMinutes: Long): Instant =
        start.plus(Duration.ofMinutes(durationMinutes))
}
