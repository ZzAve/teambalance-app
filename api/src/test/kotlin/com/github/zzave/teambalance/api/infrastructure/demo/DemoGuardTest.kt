package com.github.zzave.teambalance.api.infrastructure.demo

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain

class DemoGuardTest : FunSpec({

    val loopback = "jdbc:postgresql://127.0.0.1:5432/teambalance"

    test("switch off ignores everything else") {
        demoBootRefusal(false, true, "production", "jdbc:postgresql://db.example:5432/x") shouldBe null
    }

    test("email sending on is refused") {
        demoBootRefusal(true, true, "none", loopback).shouldBeRefusalContaining("email.send")
    }

    listOf("sandbox", "production", "").forEach { env ->
        test("Bunq environment '$env' is refused") {
            demoBootRefusal(true, false, env, loopback).shouldBeRefusalContaining("bunq.environment")
        }
    }

    listOf(
        "jdbc:postgresql://db.scw.cloud:5432/x",
        "jdbc:postgresql:///x",
        "not a url",
        // pgjdbc lets the query string override the host the authority names.
        "jdbc:postgresql://127.0.0.1:5432/x?PGHOST=prod-db.internal",
        "jdbc:postgresql://127.0.0.1:5432/x?loggerLevel=OFF&pghost=prod-db.internal",
        "jdbc:postgresql://127.0.0.1:5432/x?host=prod-db.internal",
        "jdbc:postgresql://127.0.0.1:5432/x?service=prod",
        "jdbc:postgresql://127.0.0.1:5432/x?PGSERVICE=prod",
    ).forEach { url ->
        test("datasource $url is refused") {
            demoBootRefusal(true, false, "none", url).shouldBeRefusalContaining("datasource")
        }
    }

    listOf(
        "jdbc:postgresql://127.0.0.1:5432/x",
        "jdbc:postgresql://localhost/x",
        "jdbc:postgresql://localhost:5432/test?loggerLevel=OFF",
    ).forEach { url ->
        test("loopback datasource $url is accepted") {
            demoBootRefusal(true, false, "none", url) shouldBe null
        }
    }

    test("a Hikari jdbc-url the pool would use instead is checked like the datasource url") {
        demoBootRefusal(true, false, "none", loopback, "jdbc:postgresql://prod-db.internal/x")
            .shouldBeRefusalContaining("datasource")
        demoBootRefusal(true, false, "none", loopback, "jdbc:postgresql://127.0.0.1/x?PGHOST=prod-db.internal")
            .shouldBeRefusalContaining("datasource")
        demoBootRefusal(true, false, "none", loopback, "jdbc:postgresql://localhost/x") shouldBe null
    }
})

private fun String?.shouldBeRefusalContaining(part: String) {
    (this ?: error("expected a refusal containing '$part', got null")) shouldContain part
}
