package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import java.util.UUID

/**
 * Framework-free (ADR-0018): a plain class constructed by the composition root from its ports.
 * Read-only reference data for the events area — it never carried a `@Transactional`, and every use
 * case is a single port call.
 */
class EventTypeService(
    private val eventTypeRepository: EventTypeRepository,
) {
    fun findAll(): List<EventType> = eventTypeRepository.findAll()
    fun findById(id: UUID): EventType? = eventTypeRepository.findById(id)
}
