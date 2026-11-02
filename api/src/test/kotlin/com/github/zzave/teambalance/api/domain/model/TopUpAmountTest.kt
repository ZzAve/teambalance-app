package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class TopUpAmountTest : FunSpec({

    test("accepts the whole-euro bounds 1 and 500") {
        TopUpAmount(1).euros shouldBe 1
        TopUpAmount(500).euros shouldBe 500
    }

    test("rejects 0, a negative amount and 501") {
        listOf(0, -5, 501).forEach { shouldThrow<IllegalArgumentException> { TopUpAmount(it) } }
    }

    test("a long amount is checked before it is narrowed, so 4294967316 does not wrap to 20") {
        shouldThrow<IllegalArgumentException> { TopUpAmount.ofWhole(4_294_967_316L) }
        TopUpAmount.ofWhole(20L).euros shouldBe 20
    }
})
