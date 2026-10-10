package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarLinkLabel
import com.github.zzave.teambalance.api.domain.model.CalendarNameSuffix
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
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

        jpaRepository.save(
            CalendarLinkJpaEntity(
                id = link.id.value,
                userId = link.userId.value,
                tokenHash = link.tokenHash.value,
                tokenEncrypted = link.encryptedToken.value,
                label = link.label?.value,
                createdAt = link.createdAt,
                expiresAt = link.expiresAt,
                attendanceStates = link.attendanceStates.map { it.name }.toMutableSet(),
                showAttendancePrefix = link.showAttendancePrefix,
                calendarNameSuffix = link.calendarNameSuffix?.value,
            ),
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

    private fun CalendarLinkJpaEntity.toDomain() = CalendarLink(
        id = CalendarLinkId(id),
        userId = UserId(userId),
        tokenHash = TokenHash(tokenHash),
        encryptedToken = EncryptedToken(tokenEncrypted),
        label = label?.let(::CalendarLinkLabel),
        createdAt = createdAt,
        expiresAt = expiresAt,
        attendanceStates = attendanceStates.map(AttendanceState::valueOf).toSet(),
        showAttendancePrefix = showAttendancePrefix,
        calendarNameSuffix = calendarNameSuffix?.let(::CalendarNameSuffix),
    )
}
