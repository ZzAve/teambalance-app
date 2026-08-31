package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
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

    override fun findByTokenHash(tokenHash: TokenHash): Invitation? =
        jpaRepository.findByTokenHash(tokenHash.value)?.internalize()

    override fun findActiveByTeam(teamId: TeamId, now: Instant): Invitation? =
        jpaRepository.findFirstByTeamIdAndRoleAndExpiresAtAfter(teamId.value, Role.USER.name, now)?.internalize()

    override fun findActiveAdminByTeam(teamId: TeamId, now: Instant): Invitation? =
        jpaRepository.findFirstByTeamIdAndRoleAndConsumedAtIsNullAndExpiresAtAfter(
            teamId.value,
            Role.ADMIN.name,
            now,
        )?.internalize()

    @Transactional
    override fun consume(invitationId: UUID, now: Instant): Boolean =
        jpaRepository.consume(invitationId, now) == 1

    @Transactional
    override fun expireActive(teamId: TeamId, now: Instant) {
        jpaRepository.expireActive(teamId.value, now)
    }

    @Transactional
    override fun rotate(teamId: TeamId, replacement: Invitation, now: Instant): Invitation {
        jpaRepository.expireActive(teamId.value, now)
        return jpaRepository.save(replacement.externalize()).internalize()
    }
}
