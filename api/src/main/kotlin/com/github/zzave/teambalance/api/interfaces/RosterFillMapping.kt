package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.model.RosterFill
import com.github.zzave.teambalance.api.domain.model.RosterState as DomainRosterState
import com.github.zzave.teambalance.api.interfaces.generated.model.EventRoster
import com.github.zzave.teambalance.api.interfaces.generated.model.RosterPosition
import com.github.zzave.teambalance.api.interfaces.generated.model.RosterState

/**
 * The Wirespec edge for a computed roster — outbound only. The fill is derived on every read
 * (targets ⋈ attendance), never stored and never accepted from a client, so there is no `consume`
 * counterpart here the way [RosterRequirementMapping] has one.
 */
internal fun RosterFill.produce(): EventRoster = EventRoster(
    trackRoster = trackRoster,
    totalTarget = totalTarget?.value?.toLong(),
    totalAttending = totalAttending.value.toLong(),
    positions = positions.map {
        RosterPosition(
            id = it.position.id.produce(),
            label = it.position.label.value,
            required = it.required?.value?.toLong(),
            attending = it.attending.value.toLong(),
        )
    },
    unassignedAttending = unassignedAttending.value.toLong(),
    openSlots = openSlots.value.toLong(),
    state = state.produce(),
)

// Mapped case by case rather than by name, so renaming either enum is a compile error here instead
// of a silently wrong status on the card.
private fun DomainRosterState.produce(): RosterState = when (this) {
    DomainRosterState.OFF -> RosterState.OFF
    DomainRosterState.TALLY_ONLY -> RosterState.TALLY_ONLY
    DomainRosterState.HEADCOUNT_SHORT -> RosterState.HEADCOUNT_SHORT
    DomainRosterState.HEADCOUNT_FULL -> RosterState.HEADCOUNT_FULL
    DomainRosterState.LINEUP_SET -> RosterState.LINEUP_SET
    DomainRosterState.SPOTS_OPEN -> RosterState.SPOTS_OPEN
    DomainRosterState.CRITICAL -> RosterState.CRITICAL
}
