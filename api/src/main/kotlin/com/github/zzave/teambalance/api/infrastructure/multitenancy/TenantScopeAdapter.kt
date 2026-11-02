package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.springframework.stereotype.Component

/**
 * The [TenantScopeGateway] adapter: sets the tenant [TenantContext] and [CurrentTeamContext] for the
 * duration of a block and puts back what was there before, whether the block returns or throws.
 *
 * Each repository call opens its own Hibernate session routed by the context at that moment, and
 * nothing here holds a session or transaction open across the switch, so work inside the block lands
 * in the routed schema and work after it is routed as it was.
 */
@Component
class TenantScopeAdapter : TenantScopeGateway {

    override fun <T> within(routing: TenantRouting, block: () -> T): T {
        val previousSchema = TenantContext.get().takeIf { TenantContext.isSet() }
        val previousTeam = CurrentTeamContext.get()
        TenantContext.set(routing.schemaName.value)
        CurrentTeamContext.set(routing.teamId.value)
        try {
            return block()
        } finally {
            previousSchema?.let(TenantContext::set) ?: TenantContext.clear()
            previousTeam?.let(CurrentTeamContext::set) ?: CurrentTeamContext.clear()
        }
    }
}
