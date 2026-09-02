package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId

/**
 * Pure DST behaviour for resolving a recurring occurrence to an instant (ADR-0014). Europe/Amsterdam
 * moves off summer time on 2026-10-25 (CEST +02:00 → CET +01:00), so a 20:30 training the week
 * before and the week after must both read 20:30 local yet map to instants an hour apart in UTC.
 */
class OccurrenceScheduleTest : FunSpec({

    val amsterdam = ZoneId.of("Europe/Amsterdam")
    val eight30pm = LocalTime.of(20, 30)

    test("the same wall-clock time before and after the autumn DST change keeps 20:30 local") {
        // 2026-10-20 is CEST (+02:00); 2026-10-27 is CET (+01:00) — the change is 2026-10-25.
        val before = OccurrenceSchedule.startInstant(LocalDate.of(2026, 10, 20), eight30pm, amsterdam)
        val after = OccurrenceSchedule.startInstant(LocalDate.of(2026, 10, 27), eight30pm, amsterdam)

        before shouldBe Instant.parse("2026-10-20T18:30:00Z") // 20:30 +02:00
        after shouldBe Instant.parse("2026-10-27T19:30:00Z") // 20:30 +01:00

        // Both render back to 20:30 in the civil zone despite the offset shift.
        before.atZone(amsterdam).toLocalTime() shouldBe eight30pm
        after.atZone(amsterdam).toLocalTime() shouldBe eight30pm
    }

    test("naive 7-day arithmetic would drift by an hour across the boundary - resolution does not") {
        val before = OccurrenceSchedule.startInstant(LocalDate.of(2026, 10, 20), eight30pm, amsterdam)
        val after = OccurrenceSchedule.startInstant(LocalDate.of(2026, 10, 27), eight30pm, amsterdam)

        // 7 civil days across a fall-back is 7*24 + 1 = 169 real hours, not 168.
        java.time.Duration.between(before, after).toHours() shouldBe 169
    }

    test("end instant is the start plus the real elapsed duration") {
        val start = OccurrenceSchedule.startInstant(LocalDate.of(2026, 9, 1), eight30pm, amsterdam)
        OccurrenceSchedule.endInstant(start, 90) shouldBe start.plusSeconds(90 * 60)
    }
})
