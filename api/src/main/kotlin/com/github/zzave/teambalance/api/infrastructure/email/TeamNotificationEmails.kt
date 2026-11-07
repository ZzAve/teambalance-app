package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Language

/**
 * Pure, framework-free copy for the create-team notifications: the founder's "your team is ready" mail,
 * in the founder's language (ADR-0043 §4), and the platform-admin audit "a code was consumed" mail,
 * Dutch only. Multipart bodies, mirroring [MagicLinkEmail] so text and HTML can't drift.
 */
object TeamNotificationEmails {

    fun teamCreated(teamName: String, language: Language): RenderedEmail = when (language) {
        Language.NL -> teamCreated(
            subject = "Je team '$teamName' is klaar",
            greeting = "Hoi,",
            sentence = { name -> "Je team $name is aangemaakt en klaar voor gebruik. Je bent beheerder van dit team." },
            teamName = teamName,
            noReply = NO_REPLY_NL,
        )
        Language.EN -> teamCreated(
            subject = "Your team '$teamName' is ready",
            greeting = "Hi,",
            sentence = { name -> "Your team $name has been created and is ready to use. You're the admin of this team." },
            teamName = teamName,
            noReply = NO_REPLY_EN,
        )
    }

    private fun teamCreated(
        subject: String,
        greeting: String,
        sentence: (String) -> String,
        teamName: String,
        noReply: String,
    ) = RenderedEmail(
        subject = subject,
        text = """
            $greeting

            ${sentence("'$teamName'")}

            $noReply
        """.trimIndent(),
        html = """
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
              <p style="font-size:20px;font-weight:bold;">TeamBalance</p>
              <p>$greeting</p>
              <p>${sentence("<strong>$teamName</strong>")}</p>
              <p style="font-size:12px;color:#999;">$noReply</p>
            </div>
        """.trimIndent(),
    )

    fun creationCodeConsumed(teamName: String, teamSlug: String, founderEmail: String): RenderedEmail {
        val subject = "Aanmaakcode gebruikt — team '$teamName' aangemaakt"
        val line = "Er is een aanmaakcode gebruikt: team '$teamName' (slug $teamSlug) is aangemaakt door $founderEmail."
        return RenderedEmail(
            subject = subject,
            text = """
                $line

                $NO_REPLY_NL
            """.trimIndent(),
            html = """
                <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
                  <p style="font-size:20px;font-weight:bold;">TeamBalance</p>
                  <p>$line</p>
                  <p style="font-size:12px;color:#999;">$NO_REPLY_NL</p>
                </div>
            """.trimIndent(),
        )
    }
}
