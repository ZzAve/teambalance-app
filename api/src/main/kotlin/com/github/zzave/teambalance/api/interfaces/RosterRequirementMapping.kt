package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.model.HeadcountTarget
import com.github.zzave.teambalance.api.domain.model.PositionSlots
import com.github.zzave.teambalance.api.domain.model.PositionTarget as DomainPositionTarget
import com.github.zzave.teambalance.api.domain.model.RosterRequirement as DomainRosterRequirement
import com.github.zzave.teambalance.api.interfaces.generated.model.PositionTarget
import com.github.zzave.teambalance.api.interfaces.generated.model.RosterRequirement

/**
 * The Wirespec edge for a roster requirement. It lives in its own file rather than beside one
 * controller because two surfaces carry the same shape — an event's override (EventController) and
 * an event type's default (EventTypeController) — and they must normalise identically or the two
 * would drift into subtly different validation.
 */

/**
 * Zero is the client saying "no target here" — a stepper wound down to 0 — so it is dropped rather
 * than stored as a target of nothing, and it means the same on **both** axes: a zero total clears the
 * headcount just as a zero count drops that position. (They must agree; the same gesture on the same
 * authoring form cannot succeed on one row and 400 on the other.)
 *
 * Every other value flows straight into [DomainPositionTarget]/[DomainRosterRequirement], whose
 * `require()`s reject negatives, absurd counts and duplicate positions with an
 * IllegalArgumentException — a 400 via GlobalExceptionHandler. Position *ids* are not checked here;
 * that needs the team's vocabulary, so EventService does it (UnknownRosterPositionException).
 */
internal fun RosterRequirement.consume(): DomainRosterRequirement = DomainRosterRequirement(
    trackRoster = trackRoster,
    totalTarget = totalTarget?.takeIf { it != 0L }?.let { HeadcountTarget(it.toCount()) },
    positionTargets = positionTargets
        .filterNot { it.count == 0L }
        .map {
            DomainPositionTarget(
                positionId = it.positionId.consumePositionId(),
                slots = PositionSlots(it.count.toCount()),
            )
        },
)

// The counts cross an Int/Long boundary: Wirespec's `Integer` emits Kotlin `Long`, while the domain
// counts a handful of people in an `Int`. A bare `toInt()` would be a silent truncation — 2^32 + 5
// arrives as 5 and sails through the 1..200 bound it should have failed — so a value that does not
// fit is pinned to Int.MAX_VALUE, which every bound downstream rejects. Nothing legitimate is near
// this: the real ceilings are PositionSlots.MAX (99) and HeadcountTarget.MAX (200).
private fun Long.toCount(): Int = if (this in Int.MIN_VALUE.toLong()..Int.MAX_VALUE.toLong()) toInt() else Int.MAX_VALUE

internal fun DomainRosterRequirement.produce(): RosterRequirement = RosterRequirement(
    trackRoster = trackRoster,
    totalTarget = totalTarget?.value?.toLong(),
    positionTargets = positionTargets.map {
        PositionTarget(positionId = it.positionId.produce(), count = it.slots.value.toLong())
    },
)
