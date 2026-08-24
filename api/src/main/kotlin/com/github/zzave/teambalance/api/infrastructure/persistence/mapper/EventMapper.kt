package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventDescription
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventLocation
import com.github.zzave.teambalance.api.domain.model.EventReference
import com.github.zzave.teambalance.api.domain.model.EventReferenceText
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.HeadcountTarget
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventReferenceEmbeddable
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity

fun EventJpaEntity.internalize() = Event(
    id = EventId(uuid),
    eventType = eventType.internalize(),
    title = EventTitle(title),
    description = description?.let(::EventDescription),
    startTime = startTime,
    endTime = endTime,
    location = location?.let(::EventLocation),
    references = references.map {
        EventReference(title = it.title?.let(::EventReferenceText), url = EventReference.Url(it.url))
    },
    recurringGroup = recurringGroup,
    createdBy = UserId(createdBy),
    createdAt = createdAt,
    // Null trackRoster IS "no override" — this event inherits its type's default (see Event.rosterOverride).
    rosterOverride = rosterTrackRoster?.let {
        RosterRequirement(
            trackRoster = it,
            totalTarget = rosterTotalTarget?.let(::HeadcountTarget),
            positionTargets = rosterPositionTargets.internalizeTargets(),
        )
    },
)

fun Event.externalize(eventTypeEntity: EventTypeJpaEntity, technicalId: Long = 0) = EventJpaEntity(
    id = technicalId,
    uuid = id.value,
    eventType = eventTypeEntity,
    title = title.value,
    description = description?.value,
    startTime = startTime,
    endTime = endTime,
    location = location?.value,
    references = references.map { EventReferenceEmbeddable(title = it.title?.value, url = it.url.value) },
    rosterTrackRoster = rosterOverride?.trackRoster,
    rosterTotalTarget = rosterOverride?.totalTarget?.value,
    rosterPositionTargets = rosterOverride?.positionTargets?.externalizeTargets().orEmpty(),
    recurringGroup = recurringGroup,
    createdBy = createdBy.value,
    createdAt = createdAt,
    updatedAt = createdAt,
)
