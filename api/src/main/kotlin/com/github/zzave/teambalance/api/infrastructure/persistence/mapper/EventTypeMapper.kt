package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HeadcountTarget
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionSlots
import com.github.zzave.teambalance.api.domain.model.PositionTarget
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity

fun EventTypeJpaEntity.internalize() = EventType(
    id = EventTypeId(uuid),
    name = EventTypeName(name),
    color = color?.let(::HexColor),
    archived = archived,
    rosterDefault = RosterRequirement(
        trackRoster = trackRoster,
        totalTarget = totalTarget?.let(::HeadcountTarget),
        positionTargets = positionTargets.internalizeTargets(),
    ),
)

/**
 * A stored target map to the domain's ordered list. Sorted by position id purely so the list has a
 * stable order at all (a JPA map does not); the *display* order is the position vocabulary's own,
 * applied where the roster is rendered — not here.
 */
internal fun Map<java.util.UUID, Int>.internalizeTargets(): List<PositionTarget> =
    entries
        .sortedBy { it.key }
        .map { (positionId, slots) -> PositionTarget(positionId = PositionId(positionId), slots = PositionSlots(slots)) }

internal fun List<PositionTarget>.externalizeTargets(): Map<java.util.UUID, Int> =
    associate { it.positionId.value to it.slots.value }
