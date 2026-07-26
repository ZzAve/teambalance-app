package com.github.zzave.teambalance.api.domain.model

import java.time.LocalDate

/**
 * A per-team season window (ADR-0014). Both bounds are independently nullable: a null bound is
 * simply unbounded on that side, so an unconfigured season (both null) constrains nothing.
 */
data class Season(
    val start: LocalDate?,
    val end: LocalDate?,
) {
    /** Whether any bound is set. A season with neither bound imposes no constraint. */
    val isConfigured: Boolean get() = start != null || end != null

    /** True when [date] falls within the configured window; an unbounded side never rejects. */
    fun allows(date: LocalDate): Boolean =
        (start == null || !date.isBefore(start)) && (end == null || !date.isAfter(end))

    companion object {
        val UNSET = Season(start = null, end = null)
    }
}
