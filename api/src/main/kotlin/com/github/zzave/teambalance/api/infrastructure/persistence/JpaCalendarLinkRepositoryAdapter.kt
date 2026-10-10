package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarLinkLabel
import com.github.zzave.teambalance.api.domain.model.CalendarLinkOptions
import com.github.zzave.teambalance.api.domain.model.CalendarNameSuffix
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.CalendarLinkJpaEntity
import jakarta.persistence.EntityManager
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

/**
 * Calendar links, tenant-schema rows (ADR-0039) — every query here is scoped by the routed connection
 * rather than by a team id predicate, exactly as [JpaPositionRepositoryAdapter] is.
 *
 * Reads are `@Transactional(readOnly = true)` for the reason [JpaEventRepositoryAdapter] documents:
 * `open-in-view` is off, so the transaction is what keeps the session open across query *and* mapping.
 */
@Repository
class JpaCalendarLinkRepositoryAdapter(
    private val jpaRepository: SpringDataCalendarLinkRepository,
    private val eventTypeRepository: SpringDataEventTypeRepository,
    private val entityManager: EntityManager,
) : CalendarLinkRepository {

    @Transactional(readOnly = true)
    override fun findByUser(userId: UserId): List<CalendarLink> =
        jpaRepository.findByUserIdOrderByCreatedAtDesc(userId.value).map { it.toDomain() }

    @Transactional(readOnly = true)
    override fun findByTokenHash(hash: TokenHash): CalendarLink? =
        jpaRepository.findByTokenHash(hash.value)?.toDomain()

    /**
     * Count-then-insert made atomic per member.
     *
     * A transaction-scoped Postgres advisory lock, keyed on the member, is what makes the count
     * trustworthy: at READ COMMITTED two concurrent inserts would otherwise both read the same count
     * and both proceed, leaving a member with one more standing credential than the cap allows. The
     * lock releases when the transaction ends, whichever way it ends.
     *
     * Taken through the [EntityManager] and not a `JdbcTemplate`, which matters here:
     * [com.github.zzave.teambalance.api.infrastructure.multitenancy.SchemaMultiTenantConnectionProvider]
     * pulls Hibernate's connection straight from the pool to set its `search_path`, so Hibernate and a
     * JdbcTemplate in the same Spring transaction sit on *different* physical connections — and a
     * transaction-scoped lock on one of them guards nothing happening on the other.
     *
     * Keyed on a hash of the user id, so a collision between two members only means they briefly
     * serialise, which costs nothing for something that runs once per deliberate click.
     */
    @Transactional
    override fun saveWithinCap(link: CalendarLink, max: Int): Boolean {
        entityManager
            .createNativeQuery("SELECT pg_advisory_xact_lock(:class, :key)")
            .setParameter("class", CALENDAR_LINK_LOCK_CLASS)
            .setParameter("key", link.userId.value.hashCode())
            .singleResult
        if (jpaRepository.countByUserId(link.userId.value) >= max) return false

        jpaRepository.save(link.toEntity())
        return true
    }

    @Transactional(readOnly = true)
    override fun findOwned(id: CalendarLinkId, userId: UserId): CalendarLink? =
        jpaRepository.findByIdAndUserId(id.value, userId.value)?.toDomain()

    /**
     * A merge of the whole row onto the stored one, with the secret and the dates taken from what was
     * stored so the merge leaves them as they were. Read first because a merge of a row deleted in
     * the meantime would insert it again.
     */
    @Transactional
    override fun updateOwned(link: CalendarLink): Boolean {
        val stored = jpaRepository.findByIdAndUserId(link.id.value, link.userId.value) ?: return false
        jpaRepository.save(
            link.copy(
                tokenHash = TokenHash(stored.tokenHash),
                encryptedToken = EncryptedToken(stored.tokenEncrypted),
                createdAt = stored.createdAt,
                expiresAt = stored.expiresAt,
            ).toEntity(),
        )
        return true
    }

    @Transactional
    override fun deleteOwned(id: CalendarLinkId, userId: UserId): Boolean =
        jpaRepository.deleteByIdAndUserId(id.value, userId.value) > 0

    private companion object {
        // Advisory locks are database-global, so the first key namespaces this one against any other
        // use of the mechanism. Arbitrary but fixed.
        const val CALENDAR_LINK_LOCK_CLASS = 832
    }

    /**
     * The type ids were checked against this tenant by the service, so a miss here is a type removed
     * since, which types never are (they are archived instead).
     */
    private fun CalendarLink.toEntity() = CalendarLinkJpaEntity(
        id = id.value,
        userId = userId.value,
        tokenHash = tokenHash.value,
        tokenEncrypted = encryptedToken.value,
        label = label?.value,
        createdAt = createdAt,
        expiresAt = expiresAt,
        attendanceStates = options.attendanceStates.map { it.name }.toMutableSet(),
        showAttendancePrefix = options.showAttendancePrefix,
        calendarNameSuffix = options.calendarNameSuffix?.value,
        eventTypes = options.eventTypeIds.orEmpty().map { typeId ->
            eventTypeRepository.findByUuid(typeId.value) ?: error("Event type $typeId does not exist")
        }.toMutableSet(),
    )

    private fun CalendarLinkJpaEntity.toDomain() = CalendarLink(
        id = CalendarLinkId(id),
        userId = UserId(userId),
        tokenHash = TokenHash(tokenHash),
        encryptedToken = EncryptedToken(tokenEncrypted),
        label = label?.let(::CalendarLinkLabel),
        createdAt = createdAt,
        expiresAt = expiresAt,
        options = CalendarLinkOptions(
            attendanceStates = attendanceStates.map(AttendanceState::valueOf).toSet(),
            // No rows is every type (ADR-0040).
            eventTypeIds = eventTypes.map { EventTypeId(it.uuid) }.toSet().takeIf { it.isNotEmpty() },
            showAttendancePrefix = showAttendancePrefix,
            calendarNameSuffix = calendarNameSuffix?.let(::CalendarNameSuffix),
        ),
    )
}
