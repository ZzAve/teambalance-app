package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId

interface EventTypeRepository {
    fun findAll(): List<EventType>
    fun findById(id: EventTypeId): EventType?
}
