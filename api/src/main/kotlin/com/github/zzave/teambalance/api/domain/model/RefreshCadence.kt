package com.github.zzave.teambalance.api.domain.model

import java.time.Duration
import java.time.Instant

// The three intervals, named so the enum entries below read as a table rather than as arithmetic.
// `const` so they are inlined: an enum entry's initializer runs before its companion object exists.
private const val RELAXED_HOURS = 12L
private const val CLOSING_HOURS = 6L
private const val IMMINENT_HOURS = 1L

/**
 * How often a subscribed calendar is asked to come back for a **Calendar link** feed (ADR-0032), and
 * the rule that decides it: the closer the next Event, the tighter the cadence.
 *
 * A flat interval has to be wrong in one direction or the other. Hourly polling of a team whose next
 * training is a fortnight away is pure traffic for a calendar that will not change; twelve-hourly
 * polling on the morning of a match means a cancellation reaches people after they have already left
 * for the hall. Banding by distance to the next Event is what lets the quiet case be cheap without
 * making the case that matters slow.
 *
 * Three bands rather than a formula: a calendar client honours this as a *hint* at best — several
 * round it to their own schedule — so finer resolution would be precision nobody consumes, and three
 * named bands are three cases a test can state.
 */
enum class RefreshCadence(val interval: Duration) {
    /** Nothing within [CLOSING_FROM]. The resting state of a team between weeks. */
    RELAXED(Duration.ofHours(RELAXED_HOURS)),

    /** The next Event is two to three days out — near enough that a change is worth catching today. */
    CLOSING(Duration.ofHours(CLOSING_HOURS)),

    /**
     * Under two days. The window in which a time moves, a hall changes or an event is called off, and
     * in which a subscriber is still deciding their own week.
     */
    IMMINENT(Duration.ofHours(IMMINENT_HOURS)),
    ;

    companion object {
        /** At or beyond this, nothing is close enough to hurry for. */
        private val CLOSING_FROM: Duration = Duration.ofDays(3)

        /** At or beyond this — but inside [CLOSING_FROM] — the middle band. */
        private val IMMINENT_FROM: Duration = Duration.ofDays(2)

        /**
         * The cadence for a feed whose soonest future Event starts at [nextEventStart], or [RELAXED]
         * when it has none.
         *
         * Each boundary belongs to the calmer band, so "exactly three days away" is still [RELAXED].
         * A start already in the past cannot arise — the feed only offers a future one — but resolves
         * to [IMMINENT] rather than wrapping round to the relaxed end of the table.
         */
        fun before(nextEventStart: Instant?, now: Instant): RefreshCadence {
            val away = nextEventStart?.let { Duration.between(now, it) } ?: return RELAXED
            return when {
                away >= CLOSING_FROM -> RELAXED
                away >= IMMINENT_FROM -> CLOSING
                else -> IMMINENT
            }
        }
    }
}
