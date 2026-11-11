package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Language
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain

class TeamRequestEmailsTest : FunSpec({
    test("the approved mail links the create-team URL in the HTML part") {
        val url = TeamRequestEmails.createTeamUrl("https://app.teambalance.nl", "AB12-CD34-EF56", "Smash & Co")
        val email = TeamRequestEmails.approved("Smash & Co", url, Language.EN)

        email.html shouldContain
            """<a href="https://app.teambalance.nl/create-team?code=AB12-CD34-EF56&amp;name=Smash+%26+Co">"""
        email.text shouldContain "The link works once and expires after 30 days."
    }

    test("user text in a mail is escaped and never becomes a link") {
        val email = TeamRequestEmails.requested("a@b.nl", "<b>x</b>", "http://evil.example", "https://app/admin")

        email.html shouldContain "&lt;b&gt;x&lt;/b&gt;"
        email.html shouldContain """<a href="https://app/admin">"""
        email.html shouldNotContain """<a href="http://evil"""
    }
})
