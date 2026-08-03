package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Email

interface EmailSender {
    fun sendMagicLink(email: Email, token: String)
}
