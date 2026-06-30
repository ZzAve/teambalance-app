package com.github.zzave.teambalance.api.domain.port

interface EmailSender {
    fun sendMagicLink(email: String, token: String)
}
