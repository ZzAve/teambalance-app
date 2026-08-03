package com.github.zzave.teambalance.api.infrastructure.email

/**
 * Pure, framework-free copy for the create-team notifications: the founder's "your team is ready" mail
 * and the platform-admin audit "a code was consumed" mail. Dutch multipart bodies, mirroring
 * [MagicLinkEmail] so text and HTML can't drift.
 */
object TeamNotificationEmails {

    private const val NO_REPLY = "Dit is een automatisch bericht — je kunt hier niet op reageren."

    fun teamCreated(teamName: String): RenderedEmail {
        val subject = "Je team '$teamName' is klaar"
        return RenderedEmail(
            subject = subject,
            text = """
                Hoi,

                Je team '$teamName' is aangemaakt en klaar voor gebruik. Je bent beheerder van dit team.

                $NO_REPLY
            """.trimIndent(),
            html = """
                <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
                  <p style="font-size:20px;font-weight:bold;">TeamBalance</p>
                  <p>Hoi,</p>
                  <p>Je team <strong>$teamName</strong> is aangemaakt en klaar voor gebruik. Je bent beheerder van dit team.</p>
                  <p style="font-size:12px;color:#999;">$NO_REPLY</p>
                </div>
            """.trimIndent(),
        )
    }

    fun creationCodeConsumed(teamName: String, teamSlug: String, founderEmail: String): RenderedEmail {
        val subject = "Aanmaakcode gebruikt — team '$teamName' aangemaakt"
        val line = "Er is een aanmaakcode gebruikt: team '$teamName' (slug $teamSlug) is aangemaakt door $founderEmail."
        return RenderedEmail(
            subject = subject,
            text = """
                $line

                $NO_REPLY
            """.trimIndent(),
            html = """
                <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
                  <p style="font-size:20px;font-weight:bold;">TeamBalance</p>
                  <p>$line</p>
                  <p style="font-size:12px;color:#999;">$NO_REPLY</p>
                </div>
            """.trimIndent(),
        )
    }
}
