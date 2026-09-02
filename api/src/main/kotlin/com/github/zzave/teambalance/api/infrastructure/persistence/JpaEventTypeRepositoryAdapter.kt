package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalizeTargets
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Clock
import java.util.UUID

/**
 * As with [JpaEventRepositoryAdapter], the transactional boundary sits here: one call to a port
 * method is one transaction. Reads are transactional too — `open-in-view` is off, and the eager
 * `positionTargets` collection is mapped after the query, which needs the session still open.
 */
@Suppress("TooManyFunctions") // One per port method; splitting the port to satisfy a count would be artificial.
@Repository
class JpaEventTypeRepositoryAdapter(
    private val jpaRepository: SpringDataEventTypeRepository,
    private val eventJpaRepository: SpringDataEventRepository,
    private val clock: Clock,
) : EventTypeRepository {

    @Transactional(readOnly = true)
    override fun findAll(): List<EventType> =
        jpaRepository.findAll().sortedBy { it.id }.map { it.internalize() }

    @Transactional(readOnly = true)
    override fun findById(id: EventTypeId): EventType? =
        jpaRepository.findByUuid(id.value)?.internalize()

    @Transactional
    override fun create(name: EventTypeName, color: HexColor?, rosterDefault: RosterRequirement): EventType =
        jpaRepository.save(
            EventTypeJpaEntity(
                uuid = UUID.randomUUID(),
                name = name.value,
                color = color?.value,
                archived = false,
                trackRoster = rosterDefault.trackRoster,
                totalTarget = rosterDefault.totalTarget?.value,
                positionTargets = rosterDefault.positionTargets.externalizeTargets(),
                createdAt = clock.instant(),
            ),
        ).internalize()

    // The entity is immutable (all `val`), so an update is a save of a fresh instance carrying the
    // same technical id, uuid and createdAt — the same shape JpaEventRepositoryAdapter.persist uses.
    @Transactional
    override fun update(
        id: EventTypeId,
        name: EventTypeName,
        color: HexColor?,
        rosterDefault: RosterRequirement,
    ): EventType {
        val existing = jpaRepository.findByUuid(id.value) ?: throw EventTypeNotFoundException(id)
        return jpaRepository.save(
            existing.copyWith(
                name = name.value,
                color = color?.value,
                archived = existing.archived,
                rosterDefault = rosterDefault,
            ),
        ).internalize()
    }

    /**
     * Reassign-then-archive in ONE transaction. The reassignment is a bulk update that bypasses the
     * persistence context, so `clearAutomatically` keeps the archive's read of the same rows honest.
     */
    @Transactional
    override fun archive(id: EventTypeId, migrateEventsTo: EventTypeId?): EventType {
        val existing = jpaRepository.findByUuid(id.value) ?: throw EventTypeNotFoundException(id)
        migrateEventsTo?.let { targetUuid ->
            val target = jpaRepository.findByUuid(targetUuid.value) ?: throw EventTypeNotFoundException(targetUuid)
            eventJpaRepository.reassignEventType(fromTypeId = existing.id, toTypeId = target.id)
        }
        return jpaRepository.save(existing.copyWith(archived = true)).internalize()
    }

    @Transactional
    override fun unarchive(id: EventTypeId): EventType {
        val existing = jpaRepository.findByUuid(id.value) ?: throw EventTypeNotFoundException(id)
        return jpaRepository.save(existing.copyWith(archived = false)).internalize()
    }

    @Transactional(readOnly = true)
    override fun countEventsOfType(id: EventTypeId): Int {
        val existing = jpaRepository.findByUuid(id.value) ?: return 0
        return eventJpaRepository.countByEventTypeId(existing.id)
    }

    @Transactional(readOnly = true)
    override fun countTargetsForPosition(positionId: PositionId): Int =
        jpaRepository.countPositionTargets(positionId.value)

    @Transactional

    // Identity (technical id, uuid, createdAt) is carried over verbatim; only the editable fields and
    // the archived flag move. Named rather than a data-class copy because the entity is a JPA class.
    private fun EventTypeJpaEntity.copyWith(
        name: String = this.name,
        color: String? = this.color,
        archived: Boolean = this.archived,
        rosterDefault: RosterRequirement? = null,
    ) = EventTypeJpaEntity(
        id = id,
        uuid = uuid,
        name = name,
        color = color,
        archived = archived,
        trackRoster = rosterDefault?.trackRoster ?: trackRoster,
        totalTarget = if (rosterDefault != null) rosterDefault.totalTarget?.value else totalTarget,
        positionTargets = rosterDefault?.positionTargets?.externalizeTargets() ?: positionTargets,
        createdAt = createdAt,
    )
}
