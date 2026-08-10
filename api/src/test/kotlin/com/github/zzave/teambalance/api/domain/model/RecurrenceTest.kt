package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import io.kotest.core.spec.style.FunSpec
import java.time.DayOfWeek
import java.time.LocalDate

/**
 * Pure generation logic for a recurring series (ADR-0014). No Spring, no DB, no clock — the lowest
 * layer that proves weekly/bi-weekly parity, weekday selection, and range boundaries.
 */
class RecurrenceTest : FunSpec({

    fun date(iso: String) = LocalDate.parse(iso)

    test("weekly generates every in-range date matching a single selected weekday") {
        // Tuesdays in September 2026: 1, 8, 15, 22, 29.
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.WEEKLY,
            weekdays = setOf(DayOfWeek.TUESDAY),
            startDate = date("2026-09-01"),
            endDate = date("2026-09-30"),
        )
        recurrence.occurrences() shouldContainExactly listOf(
            date("2026-09-01"), date("2026-09-08"), date("2026-09-15"),
            date("2026-09-22"), date("2026-09-29"),
        )
    }

    test("weekly interleaves multiple weekdays in chronological order") {
        // Tue + Thu across two weeks starting Mon 2026-09-07.
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.WEEKLY,
            weekdays = setOf(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY),
            startDate = date("2026-09-07"),
            endDate = date("2026-09-20"),
        )
        recurrence.occurrences() shouldContainExactly listOf(
            date("2026-09-08"), date("2026-09-10"), // week 1: Tue, Thu
            date("2026-09-15"), date("2026-09-17"), // week 2: Tue, Thu
        )
    }

    test("bi-weekly keeps every other occurrence PER weekday, not every other row") {
        // Tue + Thu, bi-weekly: keep the 1st, 3rd, … hit of each weekday independently.
        // Tuesdays: 09-08 (keep), 09-15 (skip), 09-22 (keep), 09-29 (skip)
        // Thursdays: 09-10 (keep), 09-17 (skip), 09-24 (keep), 10-01 (skip)
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.BIWEEKLY,
            weekdays = setOf(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY),
            startDate = date("2026-09-07"),
            endDate = date("2026-10-04"),
        )
        recurrence.occurrences() shouldContainExactly listOf(
            date("2026-09-08"), date("2026-09-10"), // week 1 kept
            date("2026-09-22"), date("2026-09-24"), // week 3 kept
        )
    }

    test("bi-weekly on a single weekday keeps alternating weeks") {
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.BIWEEKLY,
            weekdays = setOf(DayOfWeek.TUESDAY),
            startDate = date("2026-09-01"),
            endDate = date("2026-09-30"),
        )
        // Tuesdays 1,8,15,22,29 → keep 1st,3rd,5th = 1,15,29.
        recurrence.occurrences() shouldContainExactly listOf(
            date("2026-09-01"), date("2026-09-15"), date("2026-09-29"),
        )
    }

    test("both range boundaries are inclusive") {
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.WEEKLY,
            weekdays = setOf(DayOfWeek.TUESDAY),
            startDate = date("2026-09-01"), // a Tuesday
            endDate = date("2026-09-08"), // a Tuesday
        )
        recurrence.occurrences() shouldContainExactly listOf(date("2026-09-01"), date("2026-09-08"))
    }

    test("a range with no matching weekday yields no occurrences") {
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.WEEKLY,
            weekdays = setOf(DayOfWeek.SUNDAY),
            startDate = date("2026-09-07"), // Mon
            endDate = date("2026-09-11"), // Fri — no Sunday in range
        )
        recurrence.occurrences() shouldBe emptyList()
    }

    test("a single-day range including the weekday yields exactly one occurrence") {
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.WEEKLY,
            weekdays = setOf(DayOfWeek.TUESDAY),
            startDate = date("2026-09-01"),
            endDate = date("2026-09-01"),
        )
        recurrence.occurrences() shouldContainExactly listOf(date("2026-09-01"))
    }

    test("a full-season Tue+Thu weekly series stays under the 200 cap") {
        // Sep 2026 → May 2027 is the canonical volleyball season.
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.WEEKLY,
            weekdays = setOf(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY),
            startDate = date("2026-09-01"),
            endDate = date("2027-05-31"),
        )
        (recurrence.occurrences().size <= Recurrence.MAX_OCCURRENCES) shouldBe true
    }

    test("a wide daily-ish range can exceed the 200 cap (caller must reject)") {
        // Every weekday for two years easily blows past 200 — the rule itself doesn't truncate.
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.WEEKLY,
            weekdays = setOf(
                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY,
            ),
            startDate = date("2026-01-01"),
            endDate = date("2027-12-31"),
        )
        (recurrence.occurrences().size > Recurrence.MAX_OCCURRENCES) shouldBe true
    }

    test("generation short-circuits at exactly one over the cap instead of materializing the range") {
        // An effectively unbounded range must not force day-by-day iteration over millennia nor build
        // a multi-million-element list: the caller detects the over-cap case from `size > MAX`, so the
        // rule stops the moment it has one more than the cap.
        val recurrence = Recurrence(
            frequency = RecurrenceFrequency.WEEKLY,
            weekdays = setOf(DayOfWeek.MONDAY),
            startDate = date("2026-01-01"),
            endDate = date("4026-01-01"),
        )
        recurrence.occurrences().size shouldBe Recurrence.MAX_OCCURRENCES + 1
    }

    test("an empty weekday set is rejected at construction") {
        shouldThrow<IllegalArgumentException> {
            Recurrence(RecurrenceFrequency.WEEKLY, emptySet(), date("2026-09-01"), date("2026-09-30"))
        }
    }

    test("an end date before the start date is rejected at construction") {
        shouldThrow<IllegalArgumentException> {
            Recurrence(
                RecurrenceFrequency.WEEKLY,
                setOf(DayOfWeek.TUESDAY),
                date("2026-09-30"),
                date("2026-09-01"),
            )
        }
    }
})
