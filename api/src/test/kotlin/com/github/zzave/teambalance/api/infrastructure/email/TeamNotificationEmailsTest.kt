package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Language
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain

class TeamNotificationEmailsTest : FunSpec({
    test("team created, in Dutch") {
        val email = TeamNotificationEmails.teamCreated("Setpoint VT", Language.NL)

        email.subject shouldBe "Je team 'Setpoint VT' is klaar"
        email.text shouldContain "Je bent beheerder van dit team."
        email.html shouldContain "<strong>Setpoint VT</strong>"
        email.html shouldContain "niet op reageren"
    }

    test("team created, in English") {
        val email = TeamNotificationEmails.teamCreated("Setpoint VT", Language.EN)

        email.subject shouldBe "Your team 'Setpoint VT' is ready"
        email.text shouldContain "Your team 'Setpoint VT' has been created and is ready to use."
        email.text shouldContain "You're the admin of this team."
        email.html shouldContain "<strong>Setpoint VT</strong>"
        email.html shouldContain "can't reply"
    }

    test("creation code consumed stays Dutch") {
        val email = TeamNotificationEmails.creationCodeConsumed("Setpoint VT", "setpoint-vt", "founder@example.com")

        email.subject shouldBe "Aanmaakcode gebruikt — team 'Setpoint VT' aangemaakt"
        email.text shouldContain "(slug setpoint-vt) is aangemaakt door founder@example.com."
    }
})
