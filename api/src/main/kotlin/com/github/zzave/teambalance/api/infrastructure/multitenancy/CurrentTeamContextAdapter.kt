package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import org.springframework.stereotype.Component

/**
 * Reads the Active Team for this request, resolved by [SessionTenantContextFilter] (the same row that
 * pinned the tenant schema), rather than re-querying — so the authorized team id and the write schema
 * always agree, with no second round-trip. Lives next to [CurrentTeamContext] because that request-scoped
 * holder is the thing it adapts; the failing user id comes from the [CurrentUserGateway] port so this
 * adapter never reaches into the identity adapters.
 */
@Component
class CurrentTeamContextAdapter(
    private val currentUser: CurrentUserGateway,
) : CurrentTeamGateway {
    override fun requireCurrentTeamId(): TeamId =
        findCurrentTeamId() ?: throw NoTeamMembershipException(currentUser.requireCurrentUserId())

    override fun findCurrentTeamId(): TeamId? = CurrentTeamContext.get()?.let(::TeamId)
}
