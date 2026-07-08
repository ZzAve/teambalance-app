package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.port.EmailSender

class FakeEmailSender : EmailSender {
    val sentMagicLinks = mutableListOf<Pair<String, String>>()

    override fun sendMagicLink(email: String, token: String) {
        sentMagicLinks.add(email to token)
    }
}
