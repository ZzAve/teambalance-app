package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.LocalDate

/**
 * Pure boundary logic for the season window (ADR-0014). No Spring, no DB — the lowest layer that
 * proves the inclusive-range and unbounded-side rules.
 */
class SeasonTest : FunSpec({

    val start = LocalDate.of(2026, 9, 1)
    val end = LocalDate.of(2027, 4, 30)
    val season = Season(start, end)

    test("a date inside the window is allowed") {
        season.allows(LocalDate.of(2026, 12, 15)) shouldBe true
    }

    test("both bounds are inclusive") {
        season.allows(start) shouldBe true
        season.allows(end) shouldBe true
    }

    test("a date before the start is rejected") {
        season.allows(start.minusDays(1)) shouldBe false
    }

    test("a date after the end is rejected") {
        season.allows(end.plusDays(1)) shouldBe false
    }

    test("an unset season allows every date and is not configured") {
        Season.UNSET.isConfigured shouldBe false
        Season.UNSET.allows(LocalDate.of(1999, 1, 1)) shouldBe true
        Season.UNSET.allows(LocalDate.of(2999, 12, 31)) shouldBe true
    }

    test("a start-only window is unbounded on the end") {
        val startOnly = Season(start, end = null)
        startOnly.isConfigured shouldBe true
        startOnly.allows(start.minusDays(1)) shouldBe false
        startOnly.allows(end.plusYears(5)) shouldBe true
    }

    test("an end-only window is unbounded on the start") {
        val endOnly = Season(start = null, end = end)
        endOnly.isConfigured shouldBe true
        endOnly.allows(start.minusYears(5)) shouldBe true
        endOnly.allows(end.plusDays(1)) shouldBe false
    }
})
