package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarLinkLabel
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.CalendarLinkJpaEntity
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

/**
 * Calendar links, tenant-schema rows (ADR-0032) — every query here is scoped by the routed connection
 * rather than by a team id predicate, exactly as [JpaPositionRepositoryAdapter] is.
 *
 * Reads are `@Transactional(readOnly = true)` for the reason [JpaEventRepositoryAdapter] documents:
 * `open-in-view` is off, so the transaction is what keeps the session open across query *and* mapping.
 */
@Repository
class JpaCalendarLinkRepositoryAdapter(
    private val jpaRepository: SpringDataCalendarLinkRepository,
) : CalendarLinkRepository {

    @Transactional(readOnly = true)
    override fun findByUser(userId: UserId): List<CalendarLink> =
        jpaRepository.findByUserIdOrderByCreatedAtDesc(userId.value).map { it.toDomain() }

    @Transactional(readOnly = true)
    override fun findByTokenHash(hash: TokenHash): CalendarLink? =
        jpaRepository.findByTokenHash(hash.value)?.toDomain()

    @Transactional
    override fun save(link: CalendarLink): CalendarLink =
        jpaRepository.save(
            CalendarLinkJpaEntity(
                id = link.id.value,
                userId = link.userId.value,
                tokenHash = link.tokenHash.value,
                tokenEncrypted = link.encryptedToken.value,
                label = link.label?.value,
                createdAt = link.createdAt,
                expiresAt = link.expiresAt,
            ),
        ).toDomain()

    @Transactional
    override fun deleteOwned(id: CalendarLinkId, userId: UserId): Boolean =
        jpaRepository.deleteByIdAndUserId(id.value, userId.value) > 0

    private fun CalendarLinkJpaEntity.toDomain() = CalendarLink(
        id = CalendarLinkId(id),
        userId = UserId(userId),
        tokenHash = TokenHash(tokenHash),
        encryptedToken = EncryptedToken(tokenEncrypted),
        label = label?.let(::CalendarLinkLabel),
        createdAt = createdAt,
        expiresAt = expiresAt,
    )
}
