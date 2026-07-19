package com.github.zzave.teambalance.api.infrastructure.email

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain

class MagicLinkEmailTest : FunSpec() {

    init {
        test("url appends the verify route with the token as a query param") {
            MagicLinkEmail.url("https://app.teambalance.nl", "abc123") shouldBe
                "https://app.teambalance.nl/auth/verify?token=abc123"
        }

        test("render produces a Dutch email carrying the link in both text and html parts") {
            val link = "https://app.teambalance.nl/auth/verify?token=abc123"

            val email = MagicLinkEmail.render(link)

            email.subject shouldBe "Je inloglink voor TeamBalance"
            // Plain-text part: link + 15-min expiry + no-reply notice.
            email.text shouldContain link
            email.text shouldContain "15 minuten"
            email.text shouldContain "niet op reageren"
            // HTML part: link is the button's href.
            email.html shouldContain "href=\"$link\""
        }
    }
}
