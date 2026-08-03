package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.EventOutsideSeasonException
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

/**
 * Owns "what to check, and when" for the season bound (ADR-0014): every event write whose start
 * falls outside the configured [season] is hard-rejected. *Which* starts must be checked is the
 * domain knowledge this module concentrates — it differs by write shape:
 *
 *  - a **create** checks its single new start;
 *  - a **recurring batch** checks every generated date, throwing on the first offender so the
 *    caller writes nothing when even one occurrence is out of window;
 *  - a **scoped edit** (ADR-0014, Decision 4) checks only the occurrences whose start actually
 *    *moved* from its pre-edit value, **grandfathering** unchanged starts — so a title-only ALL
 *    edit moves nothing and is never rejected, and an occurrence already outside a shrunk window
 *    stays editable as long as the edit doesn't move it.
 *
 * [Season.allows] is the predicate underneath; this policy decides which dates to feed it. Pure and
 * clock-free — the caller supplies the civil [zone] used to resolve an [Instant] to the calendar
 * date humans read. An unconfigured season (both bounds null) allows everything.
 */
class SeasonPolicy(
    private val season: Season,
    private val zone: ZoneId,
) {
    /** A single created event: its start must fall within the season. */
    fun requireCreatable(start: Instant) = requireWithinSeason(start.toSeasonDate())

    /**
     * A recurring batch: every generated date must fall within the season. Throws on the first
     * offending date, so a caller that validates before persisting writes no rows when even one
     * occurrence is out of window.
     */
    fun requireAllCreatable(dates: List<LocalDate>) = dates.forEach { requireWithinSeason(it) }

    /**
     * A scoped edit: of the rows in [plan] to be persisted, only those whose start differs from its
     * pre-edit value in [originalStarts] are checked. An unchanged start is grandfathered (a row
     * absent from [originalStarts] counts as moved and is checked).
     */
    fun requireEditable(plan: SeriesEditPlan, originalStarts: Map<EventId, Instant>) =
        plan.toPersist
            .filter { it.startTime != originalStarts[it.id] }
            .forEach { requireWithinSeason(it.startTime.toSeasonDate()) }

    private fun requireWithinSeason(date: LocalDate) {
        if (!season.allows(date)) throw EventOutsideSeasonException(date)
    }

    private fun Instant.toSeasonDate(): LocalDate = atZone(zone).toLocalDate()
}
