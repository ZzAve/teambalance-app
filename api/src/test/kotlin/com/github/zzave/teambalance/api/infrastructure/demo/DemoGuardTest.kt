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

    listOf("jdbc:postgresql://db.scw.cloud:5432/x", "jdbc:postgresql:///x", "not a url").forEach { url ->
        test("datasource $url is refused") {
            demoBootRefusal(true, false, "none", url).shouldBeRefusalContaining("datasource")
        }
    }

    listOf("jdbc:postgresql://127.0.0.1:5432/x", "jdbc:postgresql://localhost/x").forEach { url ->
        test("loopback datasource $url is accepted") {
            demoBootRefusal(true, false, "none", url) shouldBe null
        }
    }
})

private fun String?.shouldBeRefusalContaining(part: String) {
    (this ?: error("expected a refusal containing '$part', got null")) shouldContain part
}
