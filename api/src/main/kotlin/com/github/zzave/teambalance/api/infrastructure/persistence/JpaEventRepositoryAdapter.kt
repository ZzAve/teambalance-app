package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID

@Repository
class JpaEventRepositoryAdapter(
    private val jpaRepository: SpringDataEventRepository,
    private val eventTypeJpaRepository: SpringDataEventTypeRepository,
) : EventRepository {

    override fun findById(id: UUID): Event? =
        jpaRepository.findByUuid(id)?.internalize()

    override fun findUpcoming(since: Instant): List<Event> =
        jpaRepository.findByStartTimeGreaterThanOrderByStartTimeAsc(since).map { it.internalize() }

    override fun findAll(): List<Event> =
        jpaRepository.findAllByOrderByStartTimeDesc().map { it.internalize() }

    override fun save(event: Event): Event {
        val eventTypeEntity = eventTypeJpaRepository.findByUuid(event.eventType.id)
            ?: throw EventTypeNotFoundException(event.eventType.id)
        return jpaRepository.save(event.externalize(eventTypeEntity)).internalize()
    }

    override fun deleteById(id: UUID) {
        val entity = jpaRepository.findByUuid(id)
            ?: throw EventNotFoundException(id)
        jpaRepository.delete(entity)
    }
}
