package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository

@Repository
class JpaEventTypeRepositoryAdapter(
    private val jpaRepository: SpringDataEventTypeRepository,
) : EventTypeRepository {

    override fun findAll(): List<EventType> =
        jpaRepository.findAll().map { it.internalize() }

    override fun findById(id: EventTypeId): EventType? =
        jpaRepository.findByUuid(id.value)?.internalize()
}
