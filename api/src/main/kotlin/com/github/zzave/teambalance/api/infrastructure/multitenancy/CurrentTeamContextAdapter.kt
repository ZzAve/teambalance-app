package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.exception.ActAsExpiredException
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import org.springframework.stereotype.Component

/**
 * Reads the Active Team for this request, resolved by [SessionTenantContextFilter] (from the same row
 * — or the same act-as grant — that pinned the tenant schema), rather than re-querying, so the
 * authorized team id and the write schema always agree with no second round-trip. Lives next to
 * [CurrentTeamContext] because that request-scoped holder is the thing it adapts; the failing user id
 * comes from the [CurrentUserGateway] port so this adapter never reaches into the identity adapters.
 *
 * This is the second place a lapse surfaces, alongside `AuthorizationService`: most team-scoped reads
 * ask "which team am I in?" before they ask "may I?", so without it a Platform Admin whose box ran out
 * would meet a bare `NO_TEAM_MEMBERSHIP` instead of `ACT_AS_EXPIRED` on every list screen.
 */
@Component
class CurrentTeamContextAdapter(
    private val currentUser: CurrentUserGateway,
    private val actAs: ActAsGateway,
) : CurrentTeamGateway {
    override fun requireCurrentTeamId(): TeamId =
        findCurrentTeamId() ?: currentUser.requireCurrentUserId().let {
            throw if (actAs.isLapsed()) ActAsExpiredException(it) else NoTeamMembershipException(it)
        }

    override fun findCurrentTeamId(): TeamId? = CurrentTeamContext.get()?.let(::TeamId)
}
