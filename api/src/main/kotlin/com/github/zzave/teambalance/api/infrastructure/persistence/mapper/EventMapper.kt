package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventReference
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventReferenceEmbeddable
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity

fun EventJpaEntity.internalize() = Event(
    id = uuid,
    eventType = eventType.internalize(),
    title = title,
    description = description,
    startTime = startTime,
    endTime = endTime,
    location = location,
    references = references.map { EventReference(title = it.title, url = it.url) },
    createdBy = createdBy,
    createdAt = createdAt,
)

fun Event.externalize(eventTypeEntity: EventTypeJpaEntity, technicalId: Long = 0) = EventJpaEntity(
    id = technicalId,
    uuid = id,
    eventType = eventTypeEntity,
    title = title,
    description = description,
    startTime = startTime,
    endTime = endTime,
    location = location,
    references = references.map { EventReferenceEmbeddable(title = it.title, url = it.url) },
    recurringGroup = null,
    createdBy = createdBy,
    createdAt = createdAt,
    updatedAt = createdAt,
)
