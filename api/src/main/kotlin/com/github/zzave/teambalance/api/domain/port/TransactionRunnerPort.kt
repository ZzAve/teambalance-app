package com.github.zzave.teambalance.api.domain.port

/**
 * The transactional boundary of a use case, owned by the domain and implemented by an adapter.
 *
 * An application service decides WHERE the boundary sits — it wraps the work that must succeed or
 * fail as one unit — while the adapter decides WHAT a transaction is. That keeps the application
 * layer free of `@Transactional` (and of Spring altogether) without giving up atomicity.
 *
 * Two properties the implementation must preserve:
 * - **Atomic across adapters.** Everything inside [block] joins ONE transaction, whichever ports it
 *   touches, so a partial write is impossible.
 * - **Opened inside the tenant-resolved scope.** The per-request tenant schema is bound before the
 *   use case is called, so the connection this transaction acquires routes to the caller's tenant.
 *   An implementation must never open the transaction around tenant resolution.
 */
interface TransactionRunnerPort {
    fun <T> inTransaction(block: () -> T): T
}
