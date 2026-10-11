package com.github.zzave.teambalance.api.interfaces

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.ints.shouldBeLessThanOrEqual
import io.kotest.matchers.shouldBe
import java.time.Instant

private fun octets(s: String) = s.toByteArray(Charsets.UTF_8).size

private fun unfold(folded: String) = folded.replace("\r\n ", "")

/**
 * The RFC 5545 encoding primitives behind [CalendarIcs.render], asserted on the exact text they emit.
 */
class CalendarIcsEncodingTest : FunSpec({

    context("escapeText") {
        test("escapes the structural characters") {
            CalendarIcs.escapeText("a;b,c") shouldBe "a\\;b\\,c"
        }

        test("escapes a backslash before anything else, so the other escapes are not doubled") {
            CalendarIcs.escapeText("a\\;b") shouldBe "a\\\\\\;b"
            CalendarIcs.escapeText("a\\nb") shouldBe "a\\\\nb"
        }

        test("writes every newline form as the two characters \\n") {
            CalendarIcs.escapeText("one\ntwo\r\nthree\rfour") shouldBe "one\\ntwo\\nthree\\nfour"
        }

        test("leaves colons and non-ASCII text alone") {
            CalendarIcs.escapeText("✓ 18:30 véél") shouldBe "✓ 18:30 véél"
        }
    }

    test("utc writes basic ISO in UTC with a Z") {
        CalendarIcs.utc(Instant.parse("2026-10-01T18:30:05.123Z")) shouldBe "20261001T183005Z"
    }

    context("property") {
        test("without parameters") {
            CalendarIcs.property("SUMMARY", value = "Training") shouldBe "SUMMARY:Training"
        }

        test("with parameters") {
            CalendarIcs.property("REFRESH-INTERVAL", mapOf("VALUE" to "DURATION"), "PT12H") shouldBe
                "REFRESH-INTERVAL;VALUE=DURATION:PT12H"
        }
    }

    // RFC 5545 §3.1: a line SHOULD NOT exceed 75 octets excluding the CRLF; a continuation starts with
    // one space, which counts toward those 75; and a fold must not split a UTF-8 sequence.
    context("fold") {
        test("a line of exactly 75 octets is left alone") {
            val line = "X".repeat(75)
            CalendarIcs.fold(line) shouldBe line
        }

        test("a 76-octet line breaks after 75, the rest continued behind one space") {
            CalendarIcs.fold("X".repeat(75) + "Y") shouldBe "X".repeat(75) + "\r\n Y"
        }

        test("continuation lines hold 74 octets of content, so the leading space makes 75") {
            val lines = CalendarIcs.fold("X".repeat(75 + 74 + 1)).split("\r\n")
            lines shouldBe listOf("X".repeat(75), " " + "X".repeat(74), " X")
        }

        test("a multibyte character that would straddle the limit moves whole to the next line") {
            // 74 ASCII octets + ✓ (3 octets) = 77: the ✓ cannot fit on the first line at all.
            val lines = CalendarIcs.fold("X".repeat(74) + "✓").split("\r\n")
            lines shouldBe listOf("X".repeat(74), " ✓")
        }

        test("a four-octet character (a surrogate pair in Kotlin) is never split") {
            val lines = CalendarIcs.fold("X".repeat(73) + "🏐" + "X").split("\r\n")
            lines shouldBe listOf("X".repeat(73), " 🏐X")
        }

        test("the issue's Dutch title stays inside 75 octets per line and unfolds to itself") {
            val line = "SUMMARY:✓ Wedstrijd tegen Taurus — véél té lange naam mét áccenten ✓✓✓ zodat de " +
                "regel precies op een multibyte teken moet breken"
            val folded = CalendarIcs.fold(line)
            val lines = folded.split("\r\n")

            lines shouldHaveSize 2
            lines.forEach { octets(it) shouldBeLessThanOrEqual 75 }
            lines.forEach { String(it.toByteArray(Charsets.UTF_8), Charsets.UTF_8) shouldBe it }
            unfold(folded) shouldBe line
        }

        test("a long multibyte line folds many times, every line within 75 octets") {
            val line = "DESCRIPTION:" + "véél ✓ ".repeat(60)
            val folded = CalendarIcs.fold(line)

            folded.split("\r\n").forEach { octets(it) shouldBeLessThanOrEqual 75 }
            unfold(folded) shouldBe line
        }
    }
})
