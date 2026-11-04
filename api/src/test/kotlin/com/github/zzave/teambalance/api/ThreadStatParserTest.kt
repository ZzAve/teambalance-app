package com.github.zzave.teambalance.api

import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe

class ThreadStatParserTest : StringSpec({
    "reads name, utime and stime, also when the thread name has spaces and parentheses" {
        val line = "42 (C1 CompilerThre) S 1 1 1 0 -1 4194368 100 0 0 0 1234 56 0 0 20 0 30 0 5 0 0"

        parseThreadStat(line) shouldBe ThreadCpu("C1 CompilerThre", userTicks = 1234, systemTicks = 56)
        parseThreadStat("7 (a) b) R 1 1 1 0 -1 0 0 0 0 0 9 8 0") shouldBe ThreadCpu("a) b", 9, 8)
    }

    "returns null for a truncated line" {
        parseThreadStat("42 (main) S 1 1") shouldBe null
    }
})
