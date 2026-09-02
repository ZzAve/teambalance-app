package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import java.util.UUID

/**
 * The value-object edge contract (ADR-0018), pinned at the lowest layer that proves it. [EventId] is
 * an internal representation only: the wire contract and the database column are both still a UUID,
 * so the two edges (JPA mapper, Wirespec mapper) must be able to wrap and unwrap it losslessly, and
 * an unwrapped id must be byte-for-byte the UUID that went in. The end-to-end round trip through the
 * REST + persistence edges is covered by the existing event ITs, which this change leaves untouched.
 */
class EventIdTest : FunSpec({

    test("wrapping and unwrapping is lossless - the edges can convert either way") {
        val raw = UUID.randomUUID()

        EventId(raw).value shouldBe raw
    }

    test("equality is the wrapped UUID's, so an EventId works as a map key across a round trip") {
        val raw = UUID.randomUUID()

        EventId(raw) shouldBe EventId(raw)
        EventId(raw) shouldNotBe EventId(UUID.randomUUID())
        mapOf(EventId(raw) to "x").getValue(EventId(raw)) shouldBe "x"
    }

    test("random mints a fresh identity, so an event that has no row yet can name itself") {
        EventId.random() shouldNotBe EventId.random()
    }

    /**
     * The wire edge converts explicitly (`value.toString()`), so this override is for diagnostics
     * only — an interpolated id in an exception message must read as a bare UUID rather than
     * Kotlin's default `EventId(value=…)`.
     */
    test("toString is the bare UUID, so interpolated messages stay readable") {
        val raw = UUID.randomUUID()

        "$raw" shouldBe EventId(raw).toString()
    }
})
