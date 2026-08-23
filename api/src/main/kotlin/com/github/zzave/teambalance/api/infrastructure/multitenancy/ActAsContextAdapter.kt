package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import org.springframework.stereotype.Component

/**
 * The [ActAsGateway] adapter: reads the grant [SessionTenantContextFilter] resolved for this request,
 * rather than re-deriving it. Lives next to [ActAsContext] because that request-scoped holder is the
 * thing it adapts, mirroring [CurrentTeamContextAdapter].
 *
 * It can only ever *report* a grant the pipeline already established — there is no path from here to
 * `isPlatformAdmin`, which is what keeps act-as a mode you enter rather than a property you carry.
 */
@Component
class ActAsContextAdapter : ActAsGateway {
    override fun current(): ActAs? = ActAsContext.get()
    override fun isLapsed(): Boolean = ActAsContext.isLapsed()
}
