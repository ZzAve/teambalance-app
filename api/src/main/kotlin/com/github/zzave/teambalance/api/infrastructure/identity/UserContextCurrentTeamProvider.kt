package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.application.CurrentTeamProvider
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class UserContextCurrentTeamProvider(
    private val teamMemberRepository: TeamMemberRepository,
) : CurrentTeamProvider {
    override fun getCurrentTeamId(): UUID? =
        UserContext.get()?.let { teamMemberRepository.findTeamId(it) }

    override fun requireCurrentTeamId(): UUID =
        getCurrentTeamId() ?: throw NoTeamMembershipException(UserContext.require())
}
