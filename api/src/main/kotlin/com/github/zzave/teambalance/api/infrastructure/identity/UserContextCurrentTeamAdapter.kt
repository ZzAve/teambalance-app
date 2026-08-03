package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.infrastructure.multitenancy.CurrentTeamContext
import org.springframework.stereotype.Component

/**
 * Reads the team resolved for this request by SessionTenantContextFilter (the same row that pinned
 * the tenant schema), rather than re-querying — so the authorized team id and the write schema always
 * agree, with no second round-trip.
 */
@Component
class UserContextCurrentTeamAdapter : CurrentTeamGateway {
    override fun requireCurrentTeamId(): TeamId =
        CurrentTeamContext.get()?.let(::TeamId) ?: throw NoTeamMembershipException(UserId(UserContext.require()))
}
