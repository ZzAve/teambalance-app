package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/** The cap mirrors `VARCHAR(200)`, which Postgres counts in characters (code points), not UTF-16 units. */
class EventTitleTest : FunSpec({

    test("accepts a title of exactly the cap") {
        EventTitle("a".repeat(200)).value.length shouldBe 200
    }

    test("rejects a title one over the cap with its message") {
        shouldThrow<IllegalArgumentException> { EventTitle("a".repeat(201)) }
            .message shouldBe "Event title must be at most 200 characters"
    }

    test("counts an emoji as one character, so 150 characters with 60 emoji fit") {
        val title = "a".repeat(90) + "🏐".repeat(60)

        (title.length > 200) shouldBe true
        EventTitle(title).value shouldBe title
    }

    test("rejects 201 code points even when they include emoji") {
        shouldThrow<IllegalArgumentException> { EventTitle("a".repeat(100) + "🏐".repeat(101)) }
    }
})
