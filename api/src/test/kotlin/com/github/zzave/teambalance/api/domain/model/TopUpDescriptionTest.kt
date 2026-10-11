package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

private const val USER_ID = "0b8e9f4c-5a1d-4c3e-9a7b-2f6d8e1c4a90"

private fun describe(team: String, member: String) = TopUpDescription.of(team, member, USER_ID)

class TopUpDescriptionTest : FunSpec({

    test("joins prefix, team, member and user id with the separator") {
        describe("Setpoint VT", "Lisa de Vries") shouldBe "TeamBalance · Setpoint VT · Lisa de Vries · $USER_ID"
    }

    test("is 139 characters unchanged") {
        val description = describe("T".repeat(70), "M".repeat(139 - 56 - 70))
        description.length shouldBe 139
        description shouldBe "TeamBalance · ${"T".repeat(70)} · ${"M".repeat(139 - 56 - 70)} · $USER_ID"
    }

    test("is exactly 140 characters unchanged") {
        val description = describe("T".repeat(70), "M".repeat(14))
        description.length shouldBe 140
        description shouldBe "TeamBalance · ${"T".repeat(70)} · ${"M".repeat(14)} · $USER_ID"
    }

    test("at 141 characters the longer name loses one character from its end") {
        val description = describe("T".repeat(70), "M".repeat(15))
        description.length shouldBe 140
        description shouldBe "TeamBalance · ${"T".repeat(69)} · ${"M".repeat(15)} · $USER_ID"
    }

    test("a very long team name is cut and a short member name stays whole") {
        val description = describe("T".repeat(500), "Lisa")
        description.length shouldBe 140
        description shouldBe "TeamBalance · ${"T".repeat(80)} · Lisa · $USER_ID"
    }

    test("a very long member name is cut and a short team name stays whole") {
        val description = describe("VT", "M".repeat(500))
        description.length shouldBe 140
        description shouldBe "TeamBalance · VT · ${"M".repeat(82)} · $USER_ID"
    }

    test("two long names share the remainder evenly") {
        val description = describe("T".repeat(300), "M".repeat(300))
        description.length shouldBe 140
        description shouldBe "TeamBalance · ${"T".repeat(42)} · ${"M".repeat(42)} · $USER_ID"
    }

    test("prefix and user id stay whole however long the names are") {
        val description = describe("T".repeat(1000), "M".repeat(1000))
        description.startsWith("TeamBalance · ") shouldBe true
        description.endsWith(" · $USER_ID") shouldBe true
    }

    test("non-ASCII names are kept as they are when they fit") {
        describe("Zaalvoetbal Zürich", "Zoë Ågren") shouldBe "TeamBalance · Zaalvoetbal Zürich · Zoë Ågren · $USER_ID"
    }

    test("a cut never splits a surrogate pair") {
        val emoji = "🏐"
        val description = describe(emoji.repeat(200), emoji.repeat(200))
        description.length shouldBe 140
        description.none { it == '�' } shouldBe true
        description shouldBe "TeamBalance · ${emoji.repeat(21)} · ${emoji.repeat(21)} · $USER_ID"
    }

    test("blank names leave empty slots rather than failing") {
        describe("", "  ") shouldBe "TeamBalance ·  ·  · $USER_ID"
    }

    test("names are trimmed") {
        describe("  Setpoint VT ", " Lisa ") shouldBe "TeamBalance · Setpoint VT · Lisa · $USER_ID"
    }

    test("a cut that ends on a space does not leave it before the separator") {
        val description = describe("A".repeat(41) + " " + "B".repeat(50), "M".repeat(300))
        description shouldBe "TeamBalance · ${"A".repeat(41)} · ${"M".repeat(42)} · $USER_ID"
    }
})
