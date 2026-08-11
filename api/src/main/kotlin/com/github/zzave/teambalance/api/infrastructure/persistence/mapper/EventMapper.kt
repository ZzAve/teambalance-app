package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventDescription
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventReference
import com.github.zzave.teambalance.api.domain.model.EventTitle
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
    location = location,
    references = references.map { EventReference(title = it.title, url = EventReference.Url(it.url)) },
    recurringGroup = recurringGroup,
    createdBy = UserId(createdBy),
    createdAt = createdAt,
)

fun Event.externalize(eventTypeEntity: EventTypeJpaEntity, technicalId: Long = 0) = EventJpaEntity(
    id = technicalId,
    uuid = id.value,
    eventType = eventTypeEntity,
    title = title.value,
    description = description?.value,
    startTime = startTime,
    endTime = endTime,
    location = location,
    references = references.map { EventReferenceEmbeddable(title = it.title, url = it.url.value) },
    recurringGroup = recurringGroup,
    createdBy = createdBy.value,
    createdAt = createdAt,
    updatedAt = createdAt,
)
