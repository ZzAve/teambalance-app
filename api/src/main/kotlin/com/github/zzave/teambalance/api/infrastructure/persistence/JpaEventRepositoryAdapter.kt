package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toDomain
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toJpaEntity
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID

@Repository
class JpaEventRepositoryAdapter(
    private val jpaRepository: SpringDataEventRepository,
    private val eventTypeJpaRepository: SpringDataEventTypeRepository,
) : EventRepository {

    override fun findById(id: UUID): Event? =
        jpaRepository.findById(id).orElse(null)?.toDomain()

    override fun findUpcoming(since: Instant): List<Event> =
        jpaRepository.findByStartTimeGreaterThanOrderByStartTimeAsc(since).map { it.toDomain() }

    override fun findAll(): List<Event> =
        jpaRepository.findAllByOrderByStartTimeDesc().map { it.toDomain() }

    override fun save(event: Event): Event {
        val eventTypeEntity = eventTypeJpaRepository.findById(event.eventType.id)
            .orElseThrow { IllegalArgumentException("EventType not found: ${event.eventType.id}") }
        return jpaRepository.save(event.toJpaEntity(eventTypeEntity)).toDomain()
    }

    override fun deleteById(id: UUID) =
        jpaRepository.deleteById(id)
}
