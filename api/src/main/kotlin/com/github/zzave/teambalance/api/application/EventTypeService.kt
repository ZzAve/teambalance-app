package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import org.springframework.stereotype.Service

@Service
class EventTypeService(
    private val eventTypeRepository: EventTypeRepository,
) {
    fun findAll(): List<EventType> = eventTypeRepository.findAll()
    fun findById(id: EventTypeId): EventType? = eventTypeRepository.findById(id)
}
