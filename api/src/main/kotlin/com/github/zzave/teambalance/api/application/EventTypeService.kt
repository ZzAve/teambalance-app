package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class EventTypeService(
    private val eventTypeRepository: EventTypeRepository,
) {
    fun findAll(): List<EventType> = eventTypeRepository.findAll()
    fun findById(id: UUID): EventType? = eventTypeRepository.findById(id)
}
