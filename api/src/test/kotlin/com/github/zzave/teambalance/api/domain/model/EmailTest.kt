package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.Locale

class EmailTest : FunSpec({

    test("trims surrounding whitespace and lowercases the whole address") {
        Email("  Alice.Smith@Example.COM \t").value shouldBe "alice.smith@example.com"
    }

    // Under a Turkish default locale, String.lowercase(Locale.getDefault()) maps 'I' to a dotless 'ı'.
    test("lowercases the same way whatever the default locale is") {
        val default = Locale.getDefault()
        try {
            Locale.setDefault(Locale.forLanguageTag("tr-TR"))
            Email("TIM@EXAMPLE.COM").value shouldBe "tim@example.com"
        } finally {
            Locale.setDefault(default)
        }
    }

    test("addresses that differ only in case and surrounding whitespace are equal") {
        Email("Alice@Example.com") shouldBe Email(" alice@example.com")
    }

    test("rejects a blank address") {
        shouldThrow<IllegalArgumentException> { Email("   ") }.message shouldBe "Email must not be blank"
    }

    test("rejects an address without exactly one @ between non-empty parts") {
        listOf("alice", "@example.com", "alice@", "@", "alice@@example.com", "a@b@example.com").forEach { raw ->
            shouldThrow<IllegalArgumentException> { Email(raw) }.message shouldBe "Email must have the form name@domain"
        }
    }
})
