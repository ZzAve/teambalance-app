package com.github.zzave.teambalance.api.domain.model

/**
 * What an event's roster looks like right now: its effective requirement joined with who is actually
 * attending. The server owns this arithmetic so there is exactly one tested place where "2 of 3
 * setters" becomes a status; the client maps the numbers to chip text, colour and pips and does no
 * counting of its own.
 */
enum class RosterState {
    /** Tracking is off. Not a roster event — the client renders no panel at all. */
    OFF,

    /** Tracking on, nothing required. A tally: who is coming, per position, with nothing to fall short of. */
    TALLY_ONLY,

    /** Only a headcount is required, and it is not met yet. */
    HEADCOUNT_SHORT,

    /** Only a headcount is required, and it is met (or exceeded). */
    HEADCOUNT_FULL,

    /** Positions are required and every one of them is covered. */
    LINEUP_SET,

    /** Positions are required, some are short, but none is empty. */
    SPOTS_OPEN,

    /** Positions are required and at least one has nobody at all — the one to chase. */
    CRITICAL,
}

/**
 * How many attending people something has — a whole roster, or one position within it. Distinct from
 * [PositionSlots], which is how many are *wanted*: confusing the two is the bug this separation
 * exists to make impossible.
 */
@JvmInline
value class AttendingCount(val value: Int) {
    init {
        require(value >= 0) { "An attending count cannot be negative, was $value" }
    }

    override fun toString(): String = value.toString()
}

/** How many more attending people a target still needs. Zero once it is met; never negative. */
@JvmInline
value class OpenSlots(val value: Int) {
    init {
        require(value >= 0) { "Open slots cannot be negative, was $value" }
    }

    override fun toString(): String = value.toString()
}

/**
 * One row of the roster panel: a position, how many it needs ([required], null when untargeted) and
 * how many attending members hold it.
 */
data class RosterPositionFill(
    val position: Position,
    val required: PositionSlots?,
    val attending: AttendingCount,
) {
    /** Unmet slots at this position — zero when untargeted or over-filled. Never negative. */
    val openSlots: OpenSlots get() = OpenSlots(((required?.value ?: 0) - attending.value).coerceAtLeast(0))

    /**
     * Attending beyond required — the "+N" the panel shows on an over-filled position. Zero when
     * untargeted or short, so a surplus is only ever reported where there is a target to exceed.
     */
    val surplus: Int get() = if (required == null) 0 else (attending.value - required.value).coerceAtLeast(0)

    /** True when this position is targeted and has nobody at all: the "one to chase". */
    val isEmptyAndRequired: Boolean get() = required != null && attending.value == 0
}

/**
 * The computed roster of one event.
 *
 * [openSlots] is "how many more people are needed to satisfy the driving target", whichever axis is
 * driving — the sum of unmet position slots when positions are targeted, otherwise the headcount
 * shortfall. It is the number the collapsed chip renders in both cases.
 */
data class RosterFill(
    val trackRoster: Boolean,
    val totalTarget: HeadcountTarget?,
    val totalAttending: AttendingCount,
    val positions: List<RosterPositionFill>,
    val unassignedAttending: AttendingCount,
    val openSlots: OpenSlots,
    val state: RosterState,
) {
    companion object {

        /**
         * Joins [requirement] with [attendingByPosition] — attending members counted per position id,
         * with unpositioned attendees under the null key. Only attending members fill slots; maybe,
         * absent and no-response deliberately do not.
         *
         * [positions] is the team's live vocabulary, in the order it should render, and it is also the
         * filter: a target naming a position that no longer exists simply has no row to appear in, so
         * a stale target cannot surface as a slot nobody can fill.
         *
         * Rows are the positions that have a target OR at least one attendee. An untargeted, empty
         * position is omitted rather than rendered as `0/—`, which is what keeps the panel from
         * becoming a wall of zeroes on a team with a long vocabulary.
         */
        fun of(
            requirement: RosterRequirement,
            attendingByPosition: Map<PositionId?, Int>,
            positions: List<Position>,
        ): RosterFill {
            val totalAttending = attendingByPosition.values.sum()
            val unassigned = attendingByPosition[null] ?: 0

            if (!requirement.trackRoster) {
                return RosterFill(
                    trackRoster = false,
                    totalTarget = null,
                    totalAttending = AttendingCount(totalAttending),
                    positions = emptyList(),
                    unassignedAttending = AttendingCount(unassigned),
                    openSlots = OpenSlots(0),
                    state = RosterState.OFF,
                )
            }

            val rows = positions
                .map {
                    RosterPositionFill(
                        position = it,
                        required = requirement.targetFor(it.id),
                        attending = AttendingCount(attendingByPosition[it.id] ?: 0),
                    )
                }
                .filter { it.required != null || it.attending.value > 0 }

            val targeted = rows.filter { it.required != null }
            val openSlots = if (targeted.isEmpty()) {
                headcountShortfall(requirement.totalTarget, totalAttending)
            } else {
                targeted.sumOf { it.openSlots.value }
            }

            return RosterFill(
                trackRoster = true,
                totalTarget = requirement.totalTarget,
                totalAttending = AttendingCount(totalAttending),
                positions = rows,
                unassignedAttending = AttendingCount(unassigned),
                openSlots = OpenSlots(openSlots),
                state = stateOf(targeted, requirement.totalTarget, totalAttending),
            )
        }

        /**
         * The layered, position-priority status. Position targets win whenever there are any: a
         * lineup that is short of a setter is short of a setter regardless of how many people are
         * coming in total, and merging the two axes into one number would hide exactly that. A
         * headcount set alongside them still shows in the panel as a secondary "X/Y going"; it just
         * does not decide the chip.
         */
        private fun stateOf(
            targeted: List<RosterPositionFill>,
            totalTarget: HeadcountTarget?,
            totalAttending: Int,
        ): RosterState = when {
            targeted.any { it.isEmptyAndRequired } -> RosterState.CRITICAL
            targeted.any { it.openSlots.value > 0 } -> RosterState.SPOTS_OPEN
            targeted.isNotEmpty() -> RosterState.LINEUP_SET
            totalTarget == null -> RosterState.TALLY_ONLY
            headcountShortfall(totalTarget, totalAttending) > 0 -> RosterState.HEADCOUNT_SHORT
            else -> RosterState.HEADCOUNT_FULL
        }

        private fun headcountShortfall(totalTarget: HeadcountTarget?, totalAttending: Int): Int =
            ((totalTarget?.value ?: 0) - totalAttending).coerceAtLeast(0)
    }
}
