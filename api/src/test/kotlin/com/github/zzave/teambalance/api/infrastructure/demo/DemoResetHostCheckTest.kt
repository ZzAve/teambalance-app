package com.github.zzave.teambalance.api.infrastructure.demo

import io.kotest.assertions.throwables.shouldNotThrowAny
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec

/** The reset re-checks, on the connection it is about to drop with, that the database is local (same rule as DemoGuard). */
class DemoResetHostCheckTest : FunSpec({

    test("a loopback connection passes") {
        shouldNotThrowAny { requireLoopbackDatabase("jdbc:postgresql://localhost:5432/teambalance") }
        shouldNotThrowAny { requireLoopbackDatabase("jdbc:postgresql://127.0.0.1:55432/test") }
    }

    listOf(
        "jdbc:postgresql://db.scw.cloud:5432/teambalance",
        "jdbc:postgresql://localhost/x?PGHOST=prod-db.internal",
        "not a url",
    ).forEach { url ->
        test("'$url' is refused") {
            shouldThrow<IllegalStateException> { requireLoopbackDatabase(url) }
        }
    }
})
