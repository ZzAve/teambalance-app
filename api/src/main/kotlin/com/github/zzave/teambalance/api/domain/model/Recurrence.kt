package com.github.zzave.teambalance.api.domain.model

import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.TemporalAdjusters

/** Materialization frequency for a recurring series (ADR-0014). No monthly / arbitrary interval. */
enum class RecurrenceFrequency { WEEKLY, BIWEEKLY }

/**
 * The generation rule for a recurring series (ADR-0014). It is used *only* to compute the concrete
 * occurrence dates at create time and is never persisted — series identity is row membership in a
 * `recurring_group`, not a stored rule.
 *
 * [occurrences] is a pure, deterministic function of the rule's fields (no clock, no I/O), so it is
 * fully unit-testable.
 */
data class Recurrence(
    val frequency: RecurrenceFrequency,
    val weekdays: Set<DayOfWeek>,
    val startDate: LocalDate,
    val endDate: LocalDate,
) {
    init {
        require(weekdays.isNotEmpty()) { "A recurring series needs at least one weekday" }
        require(!endDate.isBefore(startDate)) { "Recurrence end date must not be before the start date" }
    }

    /**
     * The concrete calendar dates this rule generates, ascending: every in-range date whose weekday
     * is selected. For [RecurrenceFrequency.BIWEEKLY] every *other* occurrence per weekday is kept —
     * the 1st, 3rd, 5th … hit of each selected weekday — so a Tue+Thu bi-weekly series yields
     * Tue/Thu one week, skips the next, and so on (matching the create prototype's preview).
     *
     * Pure and side-effect-free; the returned list may be empty when no in-range date matches.
     *
     * Generation short-circuits once it passes [MAX_OCCURRENCES] (returning exactly one over the
     * cap): an unbounded date range must never force day-by-day iteration over millennia or build a
     * multi-million-element list before the caller can reject it. Callers detect the over-cap case
     * with `size > MAX_OCCURRENCES` all the same.
     */
    fun occurrences(): List<LocalDate> =
        weekdays
            .flatMap { weekday -> occurrencesOn(weekday).take(MAX_OCCURRENCES + 1).toList() }
            .sorted()
            .take(MAX_OCCURRENCES + 1)

    /**
     * The kept dates for one selected weekday, ascending and lazily produced: the first in-range hit,
     * then every 7th day (weekly) or every 14th (bi-weekly — which is exactly "every other hit of this
     * weekday"). Laziness is what bounds an open-ended range: the caller takes only [MAX_OCCURRENCES]
     * + 1 per weekday, so at most 7 × 201 dates are ever constructed regardless of the range's width.
     */
    private fun occurrencesOn(weekday: DayOfWeek): Sequence<LocalDate> {
        val stepDays = if (frequency == RecurrenceFrequency.BIWEEKLY) BIWEEKLY_STEP_DAYS else WEEKLY_STEP_DAYS
        return generateSequence(startDate.with(TemporalAdjusters.nextOrSame(weekday))) { it.plusDays(stepDays) }
            .takeWhile { !it.isAfter(endDate) }
    }

    companion object {
        /** A single batch may materialize at most this many occurrences (ADR-0014). */
        const val MAX_OCCURRENCES = 200

        private const val WEEKLY_STEP_DAYS = 7L
        private const val BIWEEKLY_STEP_DAYS = 14L
    }
}
