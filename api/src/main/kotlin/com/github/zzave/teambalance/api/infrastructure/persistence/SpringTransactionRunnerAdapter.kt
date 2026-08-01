package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.port.TransactionRunnerPort
import org.springframework.stereotype.Component
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.support.TransactionTemplate

/**
 * [TransactionRunnerPort] backed by Spring's [TransactionTemplate] — the same transaction manager
 * `@Transactional` used to drive, so the semantics are unchanged: default propagation (join an
 * outer transaction if one is already running), rollback on any unchecked exception.
 *
 * The transaction begins when [inTransaction] is called, i.e. inside the use case, which is already
 * inside the tenant-resolved request scope — so Hibernate's tenant resolver sees the caller's schema
 * when this transaction acquires its connection. No AOP proxy is involved, so the boundary is where
 * the code says it is rather than wherever a proxy happened to be crossed.
 */
@Component
class SpringTransactionRunnerAdapter(
    transactionManager: PlatformTransactionManager,
) : TransactionRunnerPort {

    private val transactionTemplate = TransactionTemplate(transactionManager)

    // TransactionTemplate.execute() collapses a null result into "no result", which would swallow the
    // legitimate nulls our use cases return (an unknown id). Boxing keeps null a value.
    private class Result<T>(val value: T)

    override fun <T> inTransaction(block: () -> T): T =
        transactionTemplate.execute { Result(block()) }!!.value
}
