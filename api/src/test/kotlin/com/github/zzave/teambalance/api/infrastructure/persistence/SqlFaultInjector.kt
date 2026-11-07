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
import java.util.concurrent.atomic.AtomicInteger

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
    private val hooks = CopyOnWriteArrayList<(ExecuteContext) -> Unit>()

    override fun executeStart(ctx: ExecuteContext) {
        hooks.forEach { it(ctx) }
        rules.firstOrNull { it.matches(ctx) }?.let { throw it.failure() }
    }

    /**
     * Runs [hook] before every statement while [block] runs, so a test can hold one thread at a chosen
     * statement (by blocking inside the hook) and force an interleaving with another connection.
     */
    fun <T> hookWhile(hook: (ExecuteContext) -> Unit, block: () -> T): T {
        hooks += hook
        try {
            return block()
        } finally {
            hooks -= hook
        }
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

        /**
         * Fails only the [nth] insert into [table] that binds [boundValue] (a title, say), counting from 1,
         * so earlier rows of the same batch are written before it blows up.
         */
        fun onNthInsertInto(table: Table<*>, nth: Int, boundValue: Any, failure: () -> RuntimeException): SqlFault {
            val seen = AtomicInteger()
            return SqlFault(failure) { ctx ->
                val insert = ctx.query() as? QOM.Insert<*>
                insert?.`$into`() == table &&
                    insert.params.values.any { it.value == boundValue } &&
                    seen.incrementAndGet() == nth
            }
        }

        fun onUpdate(table: Table<*>, failure: () -> RuntimeException) = SqlFault(failure) { ctx ->
            (ctx.query() as? QOM.Update<*>)?.`$table`() == table
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
