package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Language

/**
 * Builds the contents of the magic-link login email. Pure, framework-free presentation
 * logic: the clickable verify URL and the multipart (plain-text + minimal HTML) body, in Dutch or
 * English (ADR-0043 §4).
 */
object MagicLinkEmail {

    // One copy per language; the text and HTML templates below are shared, so they can never drift apart.
    private class Copy(
        val subject: String,
        val greeting: String,
        val textIntro: String,
        val htmlIntro: String,
        val button: String,
        val fallback: String,
        val expiry: String,
        val ignore: String,
        val noReply: String,
    )

    private val NL = Copy(
        subject = "Je inloglink voor TeamBalance",
        greeting = "Hoi,",
        textIntro = "Klik op onderstaande link om in te loggen bij TeamBalance:",
        htmlIntro = "Klik op de knop hieronder om in te loggen bij TeamBalance:",
        button = "Inloggen",
        fallback = "Werkt de knop niet? Kopieer dan deze link:",
        expiry = "Deze link is 15 minuten geldig en werkt één keer.",
        ignore = "Heb je zelf niet geprobeerd in te loggen? Dan kun je deze e-mail negeren.",
        noReply = NO_REPLY_NL,
    )

    private val EN = Copy(
        subject = "Your TeamBalance sign-in link",
        greeting = "Hi,",
        textIntro = "Click the link below to sign in to TeamBalance:",
        htmlIntro = "Click the button below to sign in to TeamBalance:",
        button = "Sign in",
        fallback = "Button not working? Copy this link:",
        expiry = "This link is valid for 15 minutes and works once.",
        ignore = "Didn't try to sign in? Then you can ignore this email.",
        noReply = NO_REPLY_EN,
    )

    fun url(frontendBaseUrl: String, token: String): String =
        "$frontendBaseUrl/auth/verify?token=$token"

    fun render(magicLinkUrl: String, language: Language): RenderedEmail {
        val copy = when (language) {
            Language.NL -> NL
            Language.EN -> EN
        }
        return RenderedEmail(subject = copy.subject, text = text(copy, magicLinkUrl), html = html(copy, magicLinkUrl))
    }

    private fun text(copy: Copy, magicLinkUrl: String): String =
        """
        ${copy.greeting}

        ${copy.textIntro}

        $magicLinkUrl

        ${copy.expiry}

        ${copy.ignore}

        ${copy.noReply}
        """.trimIndent()

    private fun html(copy: Copy, magicLinkUrl: String): String =
        """
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
          <p style="font-size:20px;font-weight:bold;">TeamBalance</p>
          <p>${copy.greeting}</p>
          <p>${copy.htmlIntro}</p>
          <p>
            <a href="$magicLinkUrl" style="display:inline-block;padding:12px 20px;background:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">${copy.button}</a>
          </p>
          <p style="font-size:13px;color:#555;">${copy.fallback}<br><a href="$magicLinkUrl">$magicLinkUrl</a></p>
          <p style="font-size:13px;color:#555;">${copy.expiry}</p>
          <p style="font-size:13px;color:#555;">${copy.ignore}</p>
          <p style="font-size:12px;color:#999;">${copy.noReply}</p>
        </div>
        """.trimIndent()
}

internal const val NO_REPLY_NL = "Dit is een automatisch bericht — je kunt hier niet op reageren."
internal const val NO_REPLY_EN = "This is an automated message — you can't reply to it."

data class RenderedEmail(
    val subject: String,
    val text: String,
    val html: String,
)
