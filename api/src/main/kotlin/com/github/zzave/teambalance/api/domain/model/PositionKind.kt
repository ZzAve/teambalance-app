package com.github.zzave.teambalance.api.domain.model

/**
 * Whether a [Position] is played or staffed — the distinction a headcount target depends on (#281).
 *
 * A headcount is a target for *players*: an admin asking for 12 at a training means twelve on the
 * court, not eleven and the coach. Without this, an event a player short reported itself Full.
 *
 * A kind rather than a bare `countsTowardHeadcount` flag, because the display needs the concept and
 * not only the arithmetic: the panel says "1 staff also going", which a boolean named after a sum
 * could not express. It amends [ADR-0009]'s "the role summary sums to the attendee headcount" —
 * the partition stays clean, it just no longer all counts toward a target.
 */
enum class PositionKind {
    /** On the court. Counts toward a headcount target. The default, and what every existing position is. */
    PLAYING,

    /** Trainer, coach, physio. Attends, is shown, and is deliberately not counted toward a headcount. */
    STAFF,
}
