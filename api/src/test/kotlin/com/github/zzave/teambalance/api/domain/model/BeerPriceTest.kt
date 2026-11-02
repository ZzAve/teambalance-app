package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class BeerPriceTest : FunSpec({

    test("accepts prices from one cent up to 100 euros") {
        BeerPrice(1).cents shouldBe 1
        BeerPrice(10_000).cents shouldBe 10_000
    }

    test("rejects a zero, negative or over-100-euro price") {
        shouldThrow<IllegalArgumentException> { BeerPrice(0) }
        shouldThrow<IllegalArgumentException> { BeerPrice(-1) }
        shouldThrow<IllegalArgumentException> { BeerPrice(10_001) }
    }
})
