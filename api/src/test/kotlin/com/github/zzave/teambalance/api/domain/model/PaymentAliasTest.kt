package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidPaymentAliasException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldNotContain

class PaymentAliasTest : FunSpec({

    test("a name is stored trimmed with its inner white space collapsed to single spaces") {
        PaymentAliasName.parse("  Tom \t  Bakker ").value shouldBe "Tom Bakker"
    }

    test("two names are the same key whatever the capitals and white space") {
        PaymentAliasName.keyOf("Tom  Bakker") shouldBe PaymentAliasName.keyOf(" tom bakker")
    }

    test("a blank name or one over the limit is refused") {
        shouldThrow<InvalidPaymentAliasException> { PaymentAliasName.parse("  ") }
        shouldThrow<InvalidPaymentAliasException> { PaymentAliasName.parse("x".repeat(101)) }
    }

    test("an alias needs a name, an IBAN or both") {
        shouldThrow<InvalidPaymentAliasException> { PaymentAlias(PaymentAliasId.random(), UserId.random(), null, null) }
    }

    test("toString of a payment description does not print it") {
        PaymentDescription("TeamBalance · Team · Lisa · secret").toString() shouldNotContain "secret"
        "${PaymentDescription("Contributie Lisa")}" shouldNotContain "Lisa"
    }

    test("toString of an alias, its name and its IBAN does not print the values") {
        val alias = PaymentAlias(
            PaymentAliasId.random(), UserId.random(), PaymentAliasName.parse("Tom Bakker"), Iban.parse("NL91ABNA0417164300"),
        )
        listOf(alias.toString(), alias.name.toString(), alias.iban.toString(), "$alias").forEach {
            it shouldNotContain "Tom"
            it shouldNotContain "NL91"
        }
    }
})
