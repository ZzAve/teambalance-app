package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class BeerCountTest : FunSpec({

    val price = BeerPrice(270)

    test("counts whole beers, rounding down") {
        BeerCount.buying(Money(18_750), price) shouldBe BeerCount(69)
    }

    test("is zero when the balance is below one beer") {
        BeerCount.buying(Money(269), price) shouldBe BeerCount(0)
    }

    test("counts exactly one beer at the price") {
        BeerCount.buying(Money(270), price) shouldBe BeerCount(1)
    }

    test("is zero for an empty balance") {
        BeerCount.buying(Money(0), price) shouldBe BeerCount(0)
    }

    test("is zero, never negative, for an overdrawn balance") {
        BeerCount.buying(Money(-5_000), price) shouldBe BeerCount(0)
    }
})
