package com.github.zzave.teambalance.api.infrastructure.multitenancy

import java.util.UUID

/**
 * The team id resolved for the current request, set alongside [TenantContext] by
 * SessionTenantContextFilter from the *same* team_members row — so the schema a write lands in and
 * the team id it is attributed to can never diverge. Null when the request has no resolved team.
 */
object CurrentTeamContext {
    private val current = InheritableThreadLocal<UUID>()

    fun set(teamId: UUID) = current.set(teamId)
    fun get(): UUID? = current.get()
    fun clear() = current.remove()
}
