package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity

fun EventTypeJpaEntity.internalize() = EventType(
    id = uuid,
    name = name,
    color = color,
)
