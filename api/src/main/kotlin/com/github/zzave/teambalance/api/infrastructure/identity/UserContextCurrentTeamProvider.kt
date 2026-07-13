package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.application.CurrentTeamProvider
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.infrastructure.multitenancy.CurrentTeamContext
import org.springframework.stereotype.Component
import java.util.UUID

/**
 * Reads the team resolved for this request by SessionTenantContextFilter (the same row that pinned
 * the tenant schema), rather than re-querying — so the authorized team id and the write schema always
 * agree, with no second round-trip.
 */
@Component
class UserContextCurrentTeamProvider : CurrentTeamProvider {
    override fun requireCurrentTeamId(): UUID =
        CurrentTeamContext.get() ?: throw NoTeamMembershipException(UserContext.require())
}
