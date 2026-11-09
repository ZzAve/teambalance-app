package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/** The cap mirrors `VARCHAR(500)`, which Postgres counts in characters (code points), not UTF-16 units. */
class EventLocationTest : FunSpec({

    test("accepts a location of exactly the cap") {
        EventLocation("a".repeat(500)).value.length shouldBe 500
    }

    test("rejects a location one over the cap with its message") {
        shouldThrow<IllegalArgumentException> { EventLocation("a".repeat(501)) }
            .message shouldBe "Event location must be at most 500 characters"
    }

    test("counts an emoji as one character, so 400 characters with 300 emoji fit") {
        val location = "a".repeat(100) + "🏐".repeat(300)

        (location.length > 500) shouldBe true
        EventLocation(location).value shouldBe location
    }

    test("rejects 501 code points even when they include emoji") {
        shouldThrow<IllegalArgumentException> { EventLocation("a".repeat(200) + "🏐".repeat(301)) }
    }
})
