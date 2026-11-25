package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TenantRouting

/**
 * Runs tenant-scoped work for a team that the request itself does not name, such as the Bunq OAuth
 * callback: the browser returns from Bunq, so the team comes from the stored `state` and not from the
 * session or the path.
 *
 * SECURITY: the caller must have established that the user behind [routing] may act in that team,
 * which means obtaining [routing] from a membership-checked lookup.
 */
interface TenantScopeGateway {
    /** Runs [block] with the tenant of [routing] in effect, and restores the previous one afterwards. */
    fun <T> within(routing: TenantRouting, block: () -> T): T

    /** The tenant in effect now, for work that has to run in it later; null when none is. */
    fun current(): TenantRouting?
}
