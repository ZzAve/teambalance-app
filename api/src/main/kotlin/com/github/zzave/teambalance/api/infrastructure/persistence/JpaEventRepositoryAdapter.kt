package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

/**
 * The transactional boundary sits here, on the adapter: one call to a port method is one
 * transaction. A write method is `@Transactional` so its read-then-write (resolve the technical id,
 * then persist) commits as a unit, and so a batch commits or rolls back whole.
 *
 * **Reads are transactional too, and must be.** `open-in-view` is off, so without one Spring Data's
 * own per-query transaction ends before this adapter maps the result, leaving a detached entity —
 * and `internalize()` then walks the LAZY `EventJpaEntity.eventType`. That throws
 * `LazyInitializationException` unless Hibernate happened to fetch the association eagerly (which it
 * does only because a final Kotlin entity can't be proxied). CI does not grant that accident: it
 * failed 25 event tests. `readOnly = true` keeps the session open across query *and* mapping, which
 * is the guarantee the class-level `@Transactional` used to provide.
 *
 * The transaction is therefore opened deep inside the request, long after the per-request tenant
 * schema has been bound, so the connection it acquires always routes to the caller's tenant.
 */
@Repository
class JpaEventRepositoryAdapter(
    private val jpaRepository: SpringDataEventRepository,
    private val eventTypeJpaRepository: SpringDataEventTypeRepository,
) : EventRepository {

    @Transactional(readOnly = true)
    override fun findById(id: UUID): Event? =
        jpaRepository.findByUuid(id)?.internalize()

    @Transactional(readOnly = true)
    override fun findUpcoming(since: Instant): List<Event> =
        jpaRepository.findByStartTimeGreaterThanOrderByStartTimeAsc(since).map { it.internalize() }

    @Transactional(readOnly = true)
    override fun findAll(): List<Event> =
        jpaRepository.findAllByOrderByStartTimeDesc().map { it.internalize() }

    @Transactional(readOnly = true)
    override fun findByRecurringGroup(group: UUID): List<Event> =
        jpaRepository.findByRecurringGroupOrderByStartTimeAsc(group).map { it.internalize() }

    @Transactional
    override fun save(event: Event): Event = persist(event)

    @Transactional
    override fun saveAll(events: List<Event>): List<Event> = events.map { persist(it) }

    @Transactional
    override fun deleteById(id: UUID) = remove(id)

    @Transactional
    override fun deleteAllById(ids: List<UUID>) = ids.forEach { remove(it) }

    private fun persist(event: Event): Event {
        val eventTypeEntity = eventTypeJpaRepository.findByUuid(event.eventType.id)
            ?: throw EventTypeNotFoundException(event.eventType.id)
        val technicalId = jpaRepository.findByUuid(event.id)?.id ?: 0
        return jpaRepository.save(event.externalize(eventTypeEntity, technicalId)).internalize()
    }

    private fun remove(id: UUID) {
        val entity = jpaRepository.findByUuid(id)
            ?: throw EventNotFoundException(id)
        jpaRepository.delete(entity)
    }
}
