package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidIbanException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class IbanTest : FunSpec({

    listOf("NL91ABNA0417164300", "DE89370400440532013000", "BE68539007547034", "GB82WEST12345698765432").forEach {
        test("accepts the valid IBAN $it") {
            Iban.parse(it).value shouldBe it
        }
    }

    test("normalises to capitals without spaces") {
        Iban.parse(" nl91 abna 0417 1643 00 ").value shouldBe "NL91ABNA0417164300"
    }

    mapOf(
        "a wrong checksum" to "NL91ABNA0417164301",
        "a transposed digit" to "NL19ABNA0417164300",
        "too short" to "NL91ABNA",
        "no country" to "9191ABNA0417164300",
        "punctuation" to "NL91-ABNA-0417-1643-00",
        "an empty string" to "",
    ).forEach { (why, raw) ->
        test("rejects $why") {
            shouldThrow<InvalidIbanException> { Iban.parse(raw) }
            Iban.parseOrNull(raw) shouldBe null
        }
    }

    test("masks all but the country, check digits and last four characters, in groups of four") {
        Iban.parse("NL02ABNA0123456789").masked() shouldBe "NL02 •••• •••• ••67 89"
        Iban.parse("DE89370400440532013000").masked() shouldBe "DE89 •••• •••• •••• ••30 00"
        Iban.parse("BE68539007547034").masked() shouldBe "BE68 •••• •••• 7034"
    }

    test("the error does not carry the rejected value") {
        shouldThrow<InvalidIbanException> { Iban.parse("NL91ABNA0417164301") }.message shouldBe "Not a valid IBAN"
    }
})
