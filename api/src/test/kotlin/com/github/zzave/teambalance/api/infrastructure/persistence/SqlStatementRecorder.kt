package com.github.zzave.teambalance.api.infrastructure.persistence

import org.jooq.ExecuteContext
import org.jooq.ExecuteListener
import org.jooq.ExecuteListenerProvider
import org.jooq.impl.DefaultExecuteListenerProvider
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import java.util.concurrent.CopyOnWriteArrayList

/** A statement jOOQ ran and how many rows it fetched (0 for statements that fetch nothing). */
class RecordedStatement(val sql: String, var rowsFetched: Int = 0)

/**
 * Lets a test observe what reached the database: the SQL of every jOOQ statement executed while
 * [recording] runs, with the number of rows each one fetched. Inert otherwise, and global rather than
 * per thread because the statements may run on a request thread other than the test's.
 */
class SqlStatementRecorder : ExecuteListener {

    @Volatile
    private var recorded: MutableList<RecordedStatement>? = null

    override fun executeEnd(ctx: ExecuteContext) {
        val statements = recorded ?: return
        val statement = RecordedStatement(ctx.sql().orEmpty())
        statements.add(statement)
        ctx.data(STATEMENT_KEY, statement)
    }

    override fun resultEnd(ctx: ExecuteContext) {
        (ctx.data(STATEMENT_KEY) as? RecordedStatement)?.rowsFetched = ctx.result()?.size ?: 0
    }

    fun recording(block: () -> Unit): List<RecordedStatement> {
        val statements = CopyOnWriteArrayList<RecordedStatement>()
        recorded = statements
        try {
            block()
        } finally {
            recorded = null
        }
        return statements.toList()
    }

    private companion object {
        const val STATEMENT_KEY = "recordedStatement"
    }
}

@TestConfiguration
class SqlStatementRecorderConfig {
    @Bean
    fun sqlStatementRecorder() = SqlStatementRecorder()

    @Bean
    fun sqlStatementRecorderProvider(recorder: SqlStatementRecorder): ExecuteListenerProvider =
        DefaultExecuteListenerProvider(recorder)
}
