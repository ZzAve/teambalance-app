package com.github.zzave.teambalance.api.domain.model

/**
 * What a team calls itself — the human-facing label a founder types on create-team and every member
 * sees afterwards. A `@JvmInline` value class, so it costs nothing at runtime while the type system
 * keeps it apart from the two other strings a team carries: its `slug` (the URL identity the founder
 * also chooses) and its `schemaName` (the derived, injection-critical tenant identifier). Those two
 * are addresses; this one is prose, and swapping them silently is exactly what the type prevents.
 *
 * **Deliberately unguarded**, like [DisplayName] and unlike [PositionLabel], whose cap moved onto the
 * type: the name's rules (trim, then non-blank, then the 100-character column cap) are one cohesive
 * step in [TeamNaming.validate], and they raise a *typed* domain failure — `InvalidTeamNameException`,
 * which the API maps to a 400 with its own message. Hoisting only the cap onto this type would split
 * one rule set across two homes and leave the trim behind, and a bare `require()` here would answer
 * with a different failure than the sibling clauses it was extracted from.
 *
 * Blank is not guarded for [PositionLabel]'s reason either: `teams.name` is merely `NOT NULL` (V001),
 * so the only values a blank check could trip are ones read back from the database, where it would
 * turn a working GET into a 500 instead of the 400 the write path already returns.
 *
 * Internal representation only: the wire contract and the column stay plain strings, so conversion
 * happens at the JPA/JDBC and Wirespec edges alone.
 */
@JvmInline
value class TeamName(val value: String) {
    override fun toString(): String = value
}
