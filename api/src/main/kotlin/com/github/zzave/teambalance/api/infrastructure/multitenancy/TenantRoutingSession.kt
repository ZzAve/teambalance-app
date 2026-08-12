package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import jakarta.servlet.http.HttpSession
import java.util.UUID

/**
 * The one place that knows how a [TenantRouting] is carried on an HTTP session: the two attribute
 * names, and the string formats behind them. Both writers live in this package —
 * [TenantRoutingGatewayAdapter] pins it once at sign-in, [SessionTenantContextFilter] memoizes it on
 * the first request that had to resolve it from the database — so the contract cannot drift between
 * them.
 *
 * Schema and team id are always read and written as a pair, so a cached schema can never end up
 * alongside a freshly-queried team id.
 */
internal object TenantRoutingSession {
    private const val TENANT_SCHEMA = "tenantSchema"
    private const val TENANT_TEAM_ID = "tenantTeamId"

    fun read(session: HttpSession?): TenantRouting? {
        val schema = session?.getAttribute(TENANT_SCHEMA) as? String
        val teamId = session?.getAttribute(TENANT_TEAM_ID) as? String
        return if (schema != null && teamId != null) {
            TenantRouting(teamId = TeamId(UUID.fromString(teamId)), schemaName = SchemaName(schema))
        } else {
            null
        }
    }

    fun write(session: HttpSession?, routing: TenantRouting) {
        // Both attributes are written as plain strings: `setAttribute` takes `Any?`, so a value class
        // would compile here and silently turn every later `read` into a cache miss.
        session?.setAttribute(TENANT_SCHEMA, routing.schemaName.value)
        session?.setAttribute(TENANT_TEAM_ID, routing.teamId.value.toString())
    }
}
