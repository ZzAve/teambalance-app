package com.github.zzave.teambalance.api.infrastructure.multitenancy

object TenantContext {
    /** The platform schema holding cross-team tables (users, teams, ...). */
    const val PUBLIC_SCHEMA = "public"

    /**
     * The schema routed to when no tenant is resolved. It intentionally does not exist, so an
     * *unqualified* (tenant) table reference fails loudly instead of silently hitting [PUBLIC_SCHEMA];
     * platform entities are `@Table(schema = "public")` and so remain reachable regardless.
     */
    const val NO_TENANT_SCHEMA = "__no_tenant__"

    private val current = InheritableThreadLocal<String>()

    fun set(schemaName: String) = current.set(schemaName)

    /**
     * Returns the resolved tenant schema, or [PUBLIC_SCHEMA] if none was resolved. This default is
     * for callers operating on the platform schema; a caller that requires an actual tenant must
     * check [isSet] first. Connection routing does NOT use this default — see [TenantIdentifierResolver].
     */
    fun get(): String = current.get() ?: PUBLIC_SCHEMA
    fun isSet(): Boolean = current.get() != null
    fun clear() = current.remove()
}
