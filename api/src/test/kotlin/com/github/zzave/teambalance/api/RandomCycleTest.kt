package com.github.zzave.teambalance.api

import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe

class RandomCycleTest : StringSpec({
    "following the chain visits every index once before it returns to the start" {
        val chain = randomCycle(1000)
        val visited = mutableSetOf<Int>()
        var next = 0
        do {
            visited += next
            next = chain[next]
        } while (next != 0)

        visited.size shouldBe 1000
    }
})
