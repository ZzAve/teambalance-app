package com.github.zzave.teambalance.api.infrastructure.email

/**
 * Builds the contents of the magic-link login email. Pure, framework-free presentation
 * logic: the clickable verify URL and the Dutch multipart (plain-text + minimal HTML) body.
 */
object MagicLinkEmail {

    private const val SUBJECT = "Je inloglink voor TeamBalance"

    // Shared copy — kept as single sources so the text and HTML parts can never drift apart.
    private const val EXPIRY = "Deze link is 15 minuten geldig en werkt één keer."
    private const val IGNORE = "Heb je zelf niet geprobeerd in te loggen? Dan kun je deze e-mail negeren."
    private const val NO_REPLY = "Dit is een automatisch bericht — je kunt hier niet op reageren."

    fun url(frontendBaseUrl: String, token: String): String =
        "$frontendBaseUrl/auth/verify?token=$token"

    fun render(magicLinkUrl: String): RenderedEmail =
        RenderedEmail(subject = SUBJECT, text = text(magicLinkUrl), html = html(magicLinkUrl))

    private fun text(magicLinkUrl: String): String =
        """
        Hoi,

        Klik op onderstaande link om in te loggen bij TeamBalance:

        $magicLinkUrl

        $EXPIRY

        $IGNORE

        $NO_REPLY
        """.trimIndent()

    private fun html(magicLinkUrl: String): String =
        """
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
          <p style="font-size:20px;font-weight:bold;">TeamBalance</p>
          <p>Hoi,</p>
          <p>Klik op de knop hieronder om in te loggen bij TeamBalance:</p>
          <p>
            <a href="$magicLinkUrl" style="display:inline-block;padding:12px 20px;background:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">Inloggen</a>
          </p>
          <p style="font-size:13px;color:#555;">Werkt de knop niet? Kopieer dan deze link:<br><a href="$magicLinkUrl">$magicLinkUrl</a></p>
          <p style="font-size:13px;color:#555;">$EXPIRY</p>
          <p style="font-size:13px;color:#555;">$IGNORE</p>
          <p style="font-size:12px;color:#999;">$NO_REPLY</p>
        </div>
        """.trimIndent()
}

data class RenderedEmail(
    val subject: String,
    val text: String,
    val html: String,
)
