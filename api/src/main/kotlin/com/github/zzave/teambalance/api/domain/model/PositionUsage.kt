package com.github.zzave.teambalance.api.domain.model

/**
 * How many things of one kind name a position — the unit the delete warning counts in.
 *
 * A count, not a target: [PositionSlots] is how many people a position *wants*, this is how many
 * rows *refer* to it. Separate types so the two can never be handed to each other.
 */
@JvmInline
value class UsageCount(val value: Int) {
    init {
        require(value >= 0) { "A usage count cannot be negative, was $value" }
    }

    override fun toString(): String = value.toString()
}

/**
 * What a position is currently used by, so a delete confirmation can name real numbers instead of
 * gesturing at "some types and members" (#219).
 *
 * A warning, not a veto: the delete proceeds regardless, cascading the targets away and leaving the
 * members Unassigned. This exists so the admin knows what that will cost before they agree to it.
 */
data class PositionUsage(
    /** Event-type roster defaults naming this position. */
    val eventTypeCount: UsageCount,
    /** Event roster overrides naming this position. */
    val eventCount: UsageCount,
    /** Active members holding it, who would become Unassigned. */
    val memberCount: UsageCount,
)
