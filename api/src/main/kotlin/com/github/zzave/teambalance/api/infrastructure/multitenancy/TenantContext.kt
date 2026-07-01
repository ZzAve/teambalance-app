package com.github.zzave.teambalance.api.infrastructure.multitenancy

object TenantContext {
    private val current = InheritableThreadLocal<String>()

    fun set(schemaName: String) = current.set(schemaName)
    fun get(): String = current.get() ?: "public"
    fun isSet(): Boolean = current.get() != null
    fun clear() = current.remove()
}
