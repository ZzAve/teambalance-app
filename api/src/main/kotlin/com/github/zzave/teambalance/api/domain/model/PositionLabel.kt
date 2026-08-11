package com.github.zzave.teambalance.api.domain.model

/**
 * The display name of a playing [Position] ("Setter", "Libero") — the vocabulary an admin curates
 * per team and the roster groups attendees by. A `@JvmInline` value class, so it costs nothing at
 * runtime while the type system keeps it apart from the other strings a member carries.
 *
 * **Guarded, but only by the length cap** that `PositionService.validLabel` already enforced — the
 * cap simply moved onto the type, in the same spirit as [EventReferenceText]: the type IS the
 * guard, so a label built directly (JPA mapper, test fixture) cannot bypass a rule that only the
 * create/rename path happened to apply. It rejects nothing the system accepts today — the write
 * path enforced the same 50 characters, and `team_positions.label` is a `VARCHAR(50)` (V003), so no
 * stored row can exceed it on the way back in either.
 *
 * Deliberately does **not** reject blank text. Trimming and "an empty label is not a position" are
 * input normalization and stay in `PositionService`, which owns the write path. The only values
 * that would trip a blank `require()` here are ones read back from the database — V003 backfilled
 * labels from the old `team_role` column, which was merely `NOT NULL` — and there a guard would
 * turn a working GET into a 500 instead of the 400 the write path already returns.
 *
 * Internal representation only: the wire contract and the column stay plain strings, so conversion
 * happens at the JPA and Wirespec edges alone.
 */
@JvmInline
value class PositionLabel(val value: String) {
    init {
        require(value.length <= MAX_LENGTH) { "Position label must be at most $MAX_LENGTH characters" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 50
    }
}
