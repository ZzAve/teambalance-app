package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.LocalDate

private val LISA = UserId.random()
private val TOM = UserId.random()
private val STRANGER = UserId.random()
private val MEMBERS = setOf(LISA, TOM)

private fun alias(owner: UserId, name: String? = null, iban: String? = null) =
    PaymentAlias(PaymentAliasId.random(), owner, name?.let(PaymentAliasName::parse), iban?.let(Iban::parse))

private fun payment(
    name: String = "",
    iban: String? = null,
    description: String? = null,
    direction: PaymentDirection = PaymentDirection.IN,
) = Payment(
    PaymentId("1"), LocalDate.of(2026, 11, 1), PaymentName(name), Money(1_000), direction,
    iban?.let(Iban::parse), description?.let(::PaymentDescription),
)

private fun topUp(userId: UserId) = TopUpDescription.of("Setpoint VT", "Someone", userId.toString())

private const val LISA_IBAN = "NL91ABNA0417164300"
private const val TOM_IBAN = "DE89370400440532013000"

class PaymentAttributionTest : FunSpec({

    val aliases = listOf(alias(LISA, name = "L. de Vries", iban = LISA_IBAN), alias(TOM, name = "Tom Bakker"))

    test("matches the IBAN") {
        PaymentAttribution.memberOf(payment(iban = "nl91 abna 0417 1643 00"), aliases, MEMBERS) shouldBe LISA
    }

    test("matches the name without regard to case or surrounding spaces") {
        PaymentAttribution.memberOf(payment(name = "  TOM BAKKER "), aliases, MEMBERS) shouldBe TOM
    }

    test("matches the user id in a top-up description") {
        PaymentAttribution.memberOf(payment(name = "Someone Else", description = topUp(TOM)), emptyList(), MEMBERS) shouldBe TOM
    }

    test("a name matches whatever the capitals and the amount of white space") {
        PaymentAttribution.memberOf(payment(name = "tom \t  BAKKER"), aliases, MEMBERS) shouldBe TOM
    }

    test("a payment out is never attributed, whatever it matches") {
        val out = PaymentDirection.OUT
        PaymentAttribution.memberOf(payment(iban = LISA_IBAN, direction = out), aliases, MEMBERS) shouldBe null
        PaymentAttribution.memberOf(payment(name = "Tom Bakker", direction = out), aliases, MEMBERS) shouldBe null
        PaymentAttribution.memberOf(payment(description = topUp(TOM), direction = out), aliases, MEMBERS) shouldBe null
    }

    test("matches nothing: null") {
        PaymentAttribution.memberOf(payment(name = "Albert Heijn", iban = TOM_IBAN), aliases, MEMBERS) shouldBe null
    }

    test("a blank counterparty name matches no alias") {
        PaymentAttribution.memberOf(payment(name = "  "), aliases, MEMBERS) shouldBe null
    }

    test("the description wins over the IBAN and the name") {
        val signals = payment(name = "Tom Bakker", iban = TOM_IBAN, description = topUp(LISA))
        PaymentAttribution.memberOf(signals, aliases, MEMBERS) shouldBe LISA
    }

    test("the IBAN wins over the name") {
        PaymentAttribution.memberOf(payment(name = "Tom Bakker", iban = LISA_IBAN), aliases, MEMBERS) shouldBe LISA
    }

    test("a description that names a non-member leaves the IBAN and the name to decide") {
        PaymentAttribution.memberOf(payment(name = "Tom Bakker", description = topUp(STRANGER)), aliases, MEMBERS) shouldBe TOM
    }

    test("a description naming someone who is not a member of the team attributes to nobody") {
        PaymentAttribution.memberOf(payment(description = topUp(STRANGER)), aliases, MEMBERS) shouldBe null
    }

    test("a description that is not in the top-up format attributes to nobody") {
        PaymentAttribution.memberOf(payment(description = "Contributie $LISA"), aliases, MEMBERS) shouldBe null
        PaymentAttribution.memberOf(payment(description = "TeamBalance · Team · Name · not-a-uuid"), aliases, MEMBERS) shouldBe null
    }
})
