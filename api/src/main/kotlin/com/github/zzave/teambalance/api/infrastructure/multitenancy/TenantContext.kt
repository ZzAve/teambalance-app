package com.github.zzave.teambalance.api.infrastructure.multitenancy

object TenantContext {
    private val current = InheritableThreadLocal<String>()

    fun set(schemaName: String) = current.set(schemaName)

    /**
     * Returns the resolved tenant schema, or the "public" platform schema if none was resolved.
     * "public" here is a deliberate default for requests that don't need a tenant (e.g. a user
     * with no team) — it is not a guess at the user's team. Callers that require an actual tenant
     * must check [isSet] first rather than trusting this return value alone.
     */
    fun get(): String = current.get() ?: "public"
    fun isSet(): Boolean = current.get() != null
    fun clear() = current.remove()
}
