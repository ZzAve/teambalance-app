package app.teambalance.infrastructure.multitenancy

object TenantContext {
    private val current = InheritableThreadLocal<String>()

    fun set(schemaName: String) = current.set(schemaName)
    fun get(): String = current.get() ?: "public"
    fun clear() = current.remove()
}
