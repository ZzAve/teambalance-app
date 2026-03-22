package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity

fun EventJpaEntity.internalize() = Event(
    id = uuid,
    eventType = eventType.internalize(),
    title = title,
    description = description,
    startTime = startTime,
    endTime = endTime,
    location = location,
    createdBy = createdBy,
    createdAt = createdAt,
)

fun Event.externalize(eventTypeEntity: EventTypeJpaEntity) = EventJpaEntity(
    uuid = id,
    eventType = eventTypeEntity,
    title = title,
    description = description,
    startTime = startTime,
    endTime = endTime,
    location = location,
    createdBy = createdBy,
    createdAt = createdAt,
)
