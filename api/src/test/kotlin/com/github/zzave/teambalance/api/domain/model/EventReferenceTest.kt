package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/**
 * Pure validation for a Reference (ADR-0016). No Spring, no DB — the lowest layer that proves the
 * http/https-only guard, the length caps, and the blank-title normalization. This is the security
 * boundary: an un-constructible bad URL can never reach a rendered anchor.
 *
 * The guard lives in [EventReference.Url] itself — the type IS the guard — so the direct-construction
 * tests below prove it holds regardless of which layer builds the value, and [EventReference.of] just
 * inherits it.
 */
class EventReferenceTest : FunSpec({

    test("accepts an https url with a title") {
        val ref = EventReference.of("Nevobo", "https://api.nevobo.nl/permalink/wedstrijd/2018133")
        ref.title shouldBe EventReferenceText("Nevobo")
        ref.url.value shouldBe "https://api.nevobo.nl/permalink/wedstrijd/2018133"
    }

    test("accepts a plain http url") {
        EventReference.of(null, "http://example.com/x").url.value shouldBe "http://example.com/x"
    }

    test("of() trims fields and treats a blank title as absent") {
        val ref = EventReference.of("   ", "  https://example.com/x  ")
        ref.title shouldBe null
        ref.url.value shouldBe "https://example.com/x"
    }

    test("rejects a javascript: scheme") {
        shouldThrow<IllegalArgumentException> { EventReference.of("x", "javascript:alert(1)") }
    }

    test("rejects a data: scheme") {
        shouldThrow<IllegalArgumentException> { EventReference.of("x", "data:text/html;base64,PHN2Zz4=") }
    }

    test("rejects a non-web scheme like ftp or mailto") {
        shouldThrow<IllegalArgumentException> { EventReference.of(null, "ftp://host/file") }
        shouldThrow<IllegalArgumentException> { EventReference.of(null, "mailto:coach@team.nl") }
    }

    test("rejects a blank url") {
        shouldThrow<IllegalArgumentException> { EventReference.of("x", "   ") }
    }

    test("rejects a malformed url") {
        shouldThrow<IllegalArgumentException> { EventReference.of(null, "not a url") }
    }

    test("rejects a url with a scheme but no host") {
        shouldThrow<IllegalArgumentException> { EventReference.of(null, "https://") }
    }

    test("rejects a url longer than the cap") {
        val tooLong = "https://example.com/" + "a".repeat(EventReference.Url.MAX_URL_LENGTH)
        shouldThrow<IllegalArgumentException> { EventReference.of(null, tooLong) }
    }

    test("rejects a title longer than the cap") {
        val longTitle = "t".repeat(EventReferenceText.MAX_LENGTH + 1)
        shouldThrow<IllegalArgumentException> { EventReference.of(longTitle, "https://example.com/x") }
    }

    // Same argument as Url below: the cap lives on the type, so it holds for a title built directly
    // in the JPA mapper or a test fixture, not only for one that came through of().
    test("EventReferenceText itself rejects an over-length title and accepts one at the cap") {
        shouldThrow<IllegalArgumentException> {
            EventReferenceText("t".repeat(EventReferenceText.MAX_LENGTH + 1))
        }
        EventReferenceText("t".repeat(EventReferenceText.MAX_LENGTH)).value.length shouldBe
            EventReferenceText.MAX_LENGTH
    }

    test("is case-insensitive on the scheme") {
        EventReference.of(null, "HTTPS://Example.com/X").url.value shouldBe "HTTPS://Example.com/X"
    }

    // The type owns the guard: constructing a Url directly (bypassing of()) must reject the same
    // dangerous values, so no layer can smuggle an unsafe href in by building the value another way.
    test("Url itself rejects a non-http scheme, a missing host, a blank value, and over-length") {
        shouldThrow<IllegalArgumentException> { EventReference.Url("javascript:alert(1)") }
        shouldThrow<IllegalArgumentException> { EventReference.Url("https://") }
        shouldThrow<IllegalArgumentException> { EventReference.Url("   ") }
        shouldThrow<IllegalArgumentException> {
            EventReference.Url("https://example.com/" + "a".repeat(EventReference.Url.MAX_URL_LENGTH))
        }
    }

    test("Url accepts a valid http(s) value and exposes it via value") {
        EventReference.Url("https://example.com/x").value shouldBe "https://example.com/x"
    }
})
