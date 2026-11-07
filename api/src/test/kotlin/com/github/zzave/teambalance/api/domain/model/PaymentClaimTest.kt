package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidPaymentAliasException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.LocalDate

private val OWNER = UserId.random()
private val IBAN = Iban.parse("NL91ABNA0417164300")
private val LONG_NAME = "x".repeat(PaymentAliasName.MAX_LENGTH + 1)

private fun payment(name: String, iban: Iban? = IBAN) =
    Payment(PaymentId("1"), LocalDate.of(2026, 11, 1), PaymentName(name), Money(1_000), PaymentDirection.IN, iban)

class PaymentClaimTest : FunSpec({

    test("by default the alias has the counterparty name and IBAN") {
        val alias = PaymentClaim.aliasOf(OWNER, payment("Tom  Bakker"), null, null)

        alias.userId shouldBe OWNER
        alias.name shouldBe PaymentAliasName.parse("Tom Bakker")
        alias.iban shouldBe IBAN
    }

    test("the name only, or the IBAN only, when the other part is switched off") {
        PaymentClaim.aliasOf(OWNER, payment("Tom"), useName = true, useIban = false).iban shouldBe null
        PaymentClaim.aliasOf(OWNER, payment("Tom"), useName = false, useIban = true).name shouldBe null
    }

    test("a name over the limit is left out by default and the IBAN is stored alone") {
        val alias = PaymentClaim.aliasOf(OWNER, payment(LONG_NAME), null, null)

        alias.name shouldBe null
        alias.iban shouldBe IBAN
    }

    test("a name over the limit is a 400 when the name was asked for, or is the only part asked for") {
        shouldThrow<InvalidPaymentAliasException> { PaymentClaim.aliasOf(OWNER, payment(LONG_NAME), useName = true, useIban = null) }
        shouldThrow<InvalidPaymentAliasException> { PaymentClaim.aliasOf(OWNER, payment(LONG_NAME), useName = null, useIban = false) }
    }

    test("a payment without the chosen part, or a choice of nothing, is a 400") {
        val noIban = payment("Tom", iban = null)
        shouldThrow<InvalidPaymentAliasException> { PaymentClaim.aliasOf(OWNER, noIban, useName = false, useIban = null) }
        shouldThrow<InvalidPaymentAliasException> { PaymentClaim.aliasOf(OWNER, payment("Tom"), useName = false, useIban = false) }
        shouldThrow<InvalidPaymentAliasException> { PaymentClaim.aliasOf(OWNER, payment("  "), useName = null, useIban = false) }
    }
})
