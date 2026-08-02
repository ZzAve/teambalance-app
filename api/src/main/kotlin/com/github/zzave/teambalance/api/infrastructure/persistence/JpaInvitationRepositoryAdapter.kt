package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Repository
class JpaInvitationRepositoryAdapter(
    private val jpaRepository: SpringDataInvitationRepository,
) : InvitationRepository {

    override fun save(invitation: Invitation): Invitation =
        jpaRepository.save(invitation.externalize()).internalize()

    override fun findByTokenHash(tokenHash: String): Invitation? =
        jpaRepository.findByTokenHash(tokenHash)?.internalize()

    @Transactional
    override fun expireActive(teamId: UUID, now: Instant) {
        jpaRepository.expireActive(teamId, now)
    }

    @Transactional
    override fun rotate(teamId: UUID, replacement: Invitation, now: Instant): Invitation {
        jpaRepository.expireActive(teamId, now)
        return jpaRepository.save(replacement.externalize()).internalize()
    }
}
