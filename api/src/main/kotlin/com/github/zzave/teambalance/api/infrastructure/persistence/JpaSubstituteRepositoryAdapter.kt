package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.SubstituteNameTakenException
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.SubstituteJpaEntity
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

/**
 * Substitutes and their attendance, tenant-schema rows (ADR-0033). Reads join the Substitute's name
 * and Position label in, so a caller gets a whole [SubstituteAttendance] from one query.
 */
@Repository
class JpaSubstituteRepositoryAdapter(
    private val jpaRepository: SpringDataSubstituteRepository,
    private val positionJpaRepository: SpringDataPositionRepository,
) : SubstituteRepository {

    @Transactional(readOnly = true)
    override fun list(): List<Substitute> = jpaRepository.findAllWithPosition().map {
        Substitute(
            id = SubstituteId(UUID.fromString(it.id)),
            name = DisplayName(it.name),
            positionId = it.positionId?.let { id -> PositionId(UUID.fromString(id)) },
            position = it.position?.let(::PositionLabel),
        )
    }

    @Transactional
    override fun create(name: DisplayName, positionId: PositionId?, createdBy: UserId): Substitute {
        val saved = jpaRepository.saveRefusingTakenName(
            SubstituteJpaEntity(name = name.value, positionId = positionId?.value, createdBy = createdBy.value),
        )
        return saved.toDomain()
    }

    @Transactional
    override fun update(id: SubstituteId, name: DisplayName, positionId: PositionId?): Substitute? {
        val entity = jpaRepository.findById(id.value).orElse(null) ?: return null
        entity.name = name.value
        entity.positionId = positionId?.value
        return jpaRepository.saveRefusingTakenName(entity).toDomain()
    }

    @Transactional
    override fun delete(id: SubstituteId) = jpaRepository.deleteById(id.value)

    override fun exists(id: SubstituteId): Boolean = jpaRepository.existsById(id.value)

    @Transactional(readOnly = true)
    override fun countEvents(id: SubstituteId): Int = jpaRepository.countAttendances(id.value)

    @Transactional
    override fun setAttendance(
        eventId: EventId,
        substituteId: SubstituteId,
        state: AttendanceState,
        changedBy: UserId,
        at: Instant,
    ): SubstituteAttendance? {
        val written = jpaRepository.upsertAttendance(eventId.value, substituteId.value, state.name, changedBy.value, at)
        if (written == 0) return null
        return jpaRepository.findAttendanceByEventIds(listOf(eventId.value))
            .single { it.substituteId == substituteId.value.toString() }
            .toDomain()
    }

    @Transactional
    override fun removeAttendance(eventId: EventId, substituteId: SubstituteId): Boolean =
        jpaRepository.deleteAttendance(eventId.value, substituteId.value) > 0

    @Transactional(readOnly = true)
    override fun findAttendanceByEventIds(eventIds: List<EventId>): Map<EventId, List<SubstituteAttendance>> =
        if (eventIds.isEmpty()) {
            emptyMap()
        } else {
            jpaRepository.findAttendanceByEventIds(eventIds.map { it.value })
                .groupBy({ EventId(UUID.fromString(it.eventId)) }, { it.toDomain() })
        }

    private fun SubstituteJpaEntity.toDomain() = Substitute(
        id = SubstituteId(id),
        name = DisplayName(name),
        positionId = positionId?.let(::PositionId),
        position = positionId?.let { positionJpaRepository.findById(it).orElse(null) }?.let { PositionLabel(it.label) },
    )

    private fun SubstituteAttendanceProjection.toDomain() = SubstituteAttendance(
        substitute = Substitute(
            id = SubstituteId(UUID.fromString(substituteId)),
            name = DisplayName(name),
            positionId = positionId?.let { PositionId(UUID.fromString(it)) },
            position = position?.let(::PositionLabel),
        ),
        state = AttendanceState.valueOf(state),
        changedBy = UserId(UUID.fromString(changedBy)),
        updatedAt = updatedAt,
    )
}

private const val NAME_INDEX = "uq_substitutes_name"

// The service refuses a taken name before writing; uq_substitutes_name catches the one taken in
// between, by a concurrent create. Flushing makes that refusal happen here rather than at commit, so
// the caller hears the same SubstituteNameTakenException (409) either way.
private fun SpringDataSubstituteRepository.saveRefusingTakenName(entity: SubstituteJpaEntity): SubstituteJpaEntity =
    try {
        saveAndFlush(entity)
    } catch (e: DataIntegrityViolationException) {
        if (e.mostSpecificCause.message?.contains(NAME_INDEX) == true) throw SubstituteNameTakenException(entity.name)
        throw e
    }
