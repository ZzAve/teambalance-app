package com.github.zzave.teambalance.api.domain.model

/**
 * How many attending people one position needs — the number the panel draws as slot pips.
 *
 * Zero is not a value here: no target and a target of nothing are the same thing to a reader, and
 * only the first is true, so the absence is modelled by the absence of a [PositionTarget].
 */
@JvmInline
value class PositionSlots(val value: Int) {
    init {
        require(value in 1..MAX) { "A position needs between 1 and $MAX people, was $value" }
    }

    override fun toString(): String = value.toString()

    companion object {
        // A volleyball court holds 6; the cap is generous enough for any sport we might host and
        // small enough that a fat-fingered 9999 is rejected rather than drawn as 9999 pips.
        const val MAX = 99
    }
}

/** How many attending people an event needs in total, whoever they are. */
@JvmInline
value class HeadcountTarget(val value: Int) {
    init {
        require(value in 1..MAX) { "A headcount target must be between 1 and $MAX, was $value" }
    }

    override fun toString(): String = value.toString()

    companion object {
        const val MAX = 200
    }
}

/**
 * A required headcount at one position, keyed by [PositionId] and never by label — so renaming a
 * position carries its targets with it (a label is display text; the id is the identity).
 */
data class PositionTarget(
    val positionId: PositionId,
    val slots: PositionSlots,
)

/**
 * The roster a team wants for an event: a headcount ([totalTarget]), a per-position lineup
 * ([positionTargets]), or both. The two axes are **independent** — either may be absent, and
 * [positionTargets] may cover only some positions (a training that needs 2 setters and does not care
 * who else turns up).
 *
 * [trackRoster] is an explicit flag rather than "no targets means off", because those are two
 * genuinely different things:
 *  - `trackRoster = true` with no targets — a training that tallies who is coming, per position, with
 *    nothing to fall short of.
 *  - `trackRoster = false` — a social. Not a roster event at all; the client renders no panel.
 *
 * Targets are deliberately **kept while [trackRoster] is false**, so an admin toggling tracking off
 * and back on again does not silently lose the lineup they configured.
 */
data class RosterRequirement(
    val trackRoster: Boolean,
    val totalTarget: HeadcountTarget? = null,
    val positionTargets: List<PositionTarget> = emptyList(),
) {
    init {
        require(positionTargets.size <= MAX_POSITION_TARGETS) {
            "A roster may target at most $MAX_POSITION_TARGETS positions, had ${positionTargets.size}"
        }
        require(positionTargets.distinctBy { it.positionId }.size == positionTargets.size) {
            "A roster may target each position at most once"
        }
    }

    /** The slots required at [positionId], or null when that position carries no target. */
    fun targetFor(positionId: PositionId): PositionSlots? =
        positionTargets.firstOrNull { it.positionId == positionId }?.slots

    /** Drops any target for [positionId] — how a deleted position leaves the requirements it is in. */
    fun withoutPosition(positionId: PositionId): RosterRequirement =
        copy(positionTargets = positionTargets.filterNot { it.positionId == positionId })

    companion object {
        const val MAX_POSITION_TARGETS = 50

        /** Tracking off: no chip, no panel. The default for a type nobody has configured. */
        val OFF = RosterRequirement(trackRoster = false)
    }
}
