package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity

fun EventTypeJpaEntity.internalize() = EventType(
    id = EventTypeId(uuid),
    name = name,
    color = color,
)
