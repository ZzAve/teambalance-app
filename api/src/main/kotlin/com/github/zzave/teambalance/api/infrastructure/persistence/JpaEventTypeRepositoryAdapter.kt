package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toDomain
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaEventTypeRepositoryAdapter(
    private val jpaRepository: SpringDataEventTypeRepository,
) : EventTypeRepository {

    override fun findAll(): List<EventType> =
        jpaRepository.findAll().map { it.toDomain() }

    override fun findById(id: UUID): EventType? =
        jpaRepository.findById(id).orElse(null)?.toDomain()
}
