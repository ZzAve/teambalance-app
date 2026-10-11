package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class BunqMeLinkTest : FunSpec({

    test("keeps a canonical link as is") {
        BunqMeLink.parse("https://bunq.me/setpointvt").value shouldBe "https://bunq.me/setpointvt"
    }

    test("adds the https scheme when missing") {
        BunqMeLink.parse("bunq.me/setpointvt").value shouldBe "https://bunq.me/setpointvt"
    }

    test("upgrades http to https") {
        BunqMeLink.parse("http://bunq.me/setpointvt").value shouldBe "https://bunq.me/setpointvt"
    }

    test("trims whitespace, lower-cases the host and drops a trailing slash") {
        BunqMeLink.parse("  HTTPS://BUNQ.ME/SetpointVT/ ").value shouldBe "https://bunq.me/SetpointVT"
    }

    test("rejects any other host") {
        listOf(
            "https://evil.example/setpointvt",
            "https://bunq.me.evil.example/setpointvt",
            "https://www.bunq.me/setpointvt",
            "https://bunq.me@evil.example/setpointvt",
            "https://evil.example/bunq.me/setpointvt",
        ).forEach { shouldThrow<IllegalArgumentException> { BunqMeLink.parse(it) } }
    }

    test("rejects other schemes") {
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("javascript://bunq.me/setpointvt") }
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("ftp://bunq.me/setpointvt") }
    }

    test("rejects a missing or nested handle") {
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("https://bunq.me") }
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("https://bunq.me/") }
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("https://bunq.me/a/b") }
    }

    test("rejects a query or fragment") {
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("https://bunq.me/setpointvt?amount=5") }
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("https://bunq.me/setpointvt#top") }
    }

    test("rejects blank input and links over 200 characters") {
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("   ") }
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("https://bunq.me/" + "a".repeat(200)) }
    }

    test("rejects characters outside the handle alphabet") {
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("https://bunq.me/set point") }
        shouldThrow<IllegalArgumentException> { BunqMeLink.parse("https://bunq.me/set%20point") }
    }
})
