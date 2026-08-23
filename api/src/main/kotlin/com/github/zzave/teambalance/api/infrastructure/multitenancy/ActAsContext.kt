package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.ActAs

/**
 * The **Act-as** state resolved for the current request, set alongside [TenantContext] and
 * [CurrentTeamContext] by [SessionTenantContextFilter] from the *same* grant — so the schema a write
 * lands in, the team it is attributed to, and the authorization that permitted it can never diverge.
 *
 * Absent for the overwhelming majority of requests: the ordinary Member path never enters act-as.
 * [lapsed] is set instead of [grant] for an episode that ran out, which is what lets a lapse be
 * reported as `ACT_AS_EXPIRED` rather than as a bare permission denial.
 */
object ActAsContext {
    private val current = InheritableThreadLocal<ActAs>()
    private val expired = InheritableThreadLocal<ActAs>()

    fun set(actAs: ActAs) = current.set(actAs)

    /**
     * Records the episode this request entered and has since lost. Held apart from [set] so it can
     * never be mistaken for a live grant: it explains a refusal, it does not authorize anything.
     */
    fun markLapsed(actAs: ActAs) = expired.set(actAs)

    fun get(): ActAs? = current.get()
    fun lapsed(): ActAs? = expired.get()

    fun clear() {
        current.remove()
        expired.remove()
    }
}
