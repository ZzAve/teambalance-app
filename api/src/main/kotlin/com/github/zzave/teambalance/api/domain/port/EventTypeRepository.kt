package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.EventType
import java.util.UUID

interface EventTypeRepository {
    fun findAll(): List<EventType>
    fun findById(id: UUID): EventType?
}
