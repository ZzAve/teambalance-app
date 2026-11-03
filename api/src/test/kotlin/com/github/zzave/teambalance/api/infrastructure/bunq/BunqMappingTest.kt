package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.generated.model.Amount
import com.github.zzave.teambalance.api.domain.model.Money
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class BunqMappingTest : FunSpec({

    context("amounts become euro cents") {
        listOf(
            "187.50" to 18_750L,
            "0.00" to 0L,
            "12.5" to 1_250L,
            "7" to 700L,
            "-12.50" to -1_250L,
            "1234567.89" to 123_456_789L,
        ).forEach { (value, cents) ->
            test("$value is $cents") { moneyOf(Amount(value, "EUR")) shouldBe Money(cents) }
        }
    }

    context("an amount that cannot be reported as euro cents is Bunq not answering") {
        listOf(
            "missing amount" to null,
            "not a number" to Amount("twelve", "EUR"),
            "fractions of a cent" to Amount("12.505", "EUR"),
            "another currency" to Amount("12.50", "GBP"),
            "no currency" to Amount("12.50", null),
            "no value" to Amount(null, "EUR"),
        ).forEach { (name, amount) ->
            test(name) { shouldThrow<BunqUnavailableException> { moneyOf(amount) } }
        }
    }
})
