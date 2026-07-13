package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaInvitationRepositoryAdapter(
    private val jpaRepository: SpringDataInvitationRepository,
) : InvitationRepository {

    override fun save(invitation: Invitation): Invitation =
        jpaRepository.save(invitation.externalize()).internalize()

    override fun findLatestByTeamId(teamId: UUID): Invitation? =
        jpaRepository.findFirstByTeamIdOrderByCreatedAtDesc(teamId)?.internalize()
}
