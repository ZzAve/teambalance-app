package com.github.zzave.teambalance.api.domain.model

/**
 * The reach of a scoped edit or delete over a recurring series (ADR-0014, Decision 4). A series is
 * just the set of [Event] rows sharing a `recurringGroup`; there is no stored rule, so every scoped
 * operation is row-reassignment + field updates.
 */
enum class EventSeriesScope {
    /** Only the target occurrence. An edit detaches it and splits the series around it. */
    THIS,

    /** The target occurrence and every later one; the earlier occurrences stay as their own series. */
    THIS_AND_FOLLOWING,

    /** Every occurrence in the group; the group itself is left intact. */
    ALL,
}
