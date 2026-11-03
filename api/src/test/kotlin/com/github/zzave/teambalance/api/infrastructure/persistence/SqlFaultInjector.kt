package com.github.zzave.teambalance.api.infrastructure.persistence

import org.jooq.ExecuteContext
import org.jooq.ExecuteListener
import org.jooq.ExecuteListenerProvider
import org.jooq.Table
import org.jooq.impl.DefaultExecuteListenerProvider
import org.jooq.impl.QOM
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import java.util.concurrent.CopyOnWriteArrayList

/**
 * Makes a chosen jOOQ statement fail, so a test can prove what an adapter's transaction does when a
 * later write blows up: the statement is rejected before it reaches the database, leaving the
 * statements that ran before it in the same transaction applied until the transaction rolls back.
 *
 * The fault sits in the jOOQ execution path, below the adapter, so it fires inside the adapter's own
 * `@Transactional` boundary. A fault injected above the adapter would fire outside it and could never
 * demonstrate a rollback.
 *
 * Registered in every test context and inert until [failWhile] is running, so ITs share one Spring
 * context. Rules are global rather than per thread because the statement may run on a request thread
 * other than the test's.
 */
class SqlFaultInjector : ExecuteListener {

    private val rules = CopyOnWriteArrayList<SqlFault>()

    override fun executeStart(ctx: ExecuteContext) {
        rules.firstOrNull { it.matches(ctx) }?.let { throw it.failure() }
    }

    /** Fails every statement matching [fault] while [block] runs, and stops failing it afterwards. */
    fun <T> failWhile(fault: SqlFault, block: () -> T): T {
        rules += fault
        try {
            return block()
        } finally {
            rules -= fault
        }
    }
}

class SqlFault(
    val failure: () -> RuntimeException,
    val matches: (ExecuteContext) -> Boolean,
) {
    companion object {
        fun onInsertInto(table: Table<*>, failure: () -> RuntimeException) = SqlFault(failure) { ctx ->
            (ctx.query() as? QOM.Insert<*>)?.`$into`() == table
        }
    }
}

@TestConfiguration
class SqlFaultInjectorConfig {
    @Bean
    fun sqlFaultInjector() = SqlFaultInjector()

    @Bean
    fun sqlFaultInjectorProvider(injector: SqlFaultInjector): ExecuteListenerProvider =
        DefaultExecuteListenerProvider(injector)
}
