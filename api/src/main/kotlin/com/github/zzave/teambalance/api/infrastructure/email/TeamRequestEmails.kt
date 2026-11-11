package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Language
import org.springframework.web.util.HtmlUtils
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

/**
 * Pure, framework-free copy for the team-request mails (ADR-0047): the Platform Admin "new request" mail
 * (Dutch only, like [TeamNotificationEmails.creationCodeConsumed]) and the three requester mails
 * (received, approved, rejected) in the requester's language. Team name, purpose and reason are user
 * input, so they are HTML-escaped in the HTML part.
 */
object TeamRequestEmails {

    fun adminCreationCodesUrl(frontendBaseUrl: String) = "$frontendBaseUrl/admin/creation-codes"

    fun createTeamUrl(frontendBaseUrl: String, code: String, teamName: String) =
        "$frontendBaseUrl/create-team?code=${encode(code)}&name=${encode(teamName)}"

    fun requested(requesterEmail: String, teamName: String, purpose: String, adminUrl: String): RenderedEmail =
        render(
            subject = "Teamaanvraag '$teamName' van $requesterEmail",
            noReply = NO_REPLY_NL,
            lines = listOf(
                "$requesterEmail vraagt een team aan.",
                "Teamnaam: $teamName",
                "Waarvoor: $purpose",
                "Beoordeel de aanvraag: $adminUrl",
            ),
        )

    fun received(teamName: String, purpose: String, language: Language): RenderedEmail = when (language) {
        Language.NL -> render(
            subject = "We hebben je aanvraag voor $teamName ontvangen",
            noReply = NO_REPLY_NL,
            lines = listOf(
                "Hoi,",
                "We hebben je aanvraag voor het team $teamName ontvangen.",
                "Waarvoor: $purpose",
                "Je krijgt een e-mail zodra de aanvraag is goedgekeurd.",
            ),
        )
        Language.EN -> render(
            subject = "We received your request for $teamName",
            noReply = NO_REPLY_EN,
            lines = listOf(
                "Hi,",
                "We received your request for the team $teamName.",
                "What for: $purpose",
                "You will get an email when it is approved.",
            ),
        )
    }

    fun approved(teamName: String, createTeamUrl: String, language: Language): RenderedEmail = when (language) {
        Language.NL -> render(
            subject = "Je aanvraag voor $teamName is goedgekeurd",
            noReply = NO_REPLY_NL,
            lines = listOf(
                "Hoi,",
                "Je aanvraag voor het team $teamName is goedgekeurd. Je kunt het team nu aanmaken:",
                createTeamUrl,
                "Deze link werkt 30 dagen en één keer.",
            ),
        )
        Language.EN -> render(
            subject = "Your request for $teamName is approved",
            noReply = NO_REPLY_EN,
            lines = listOf(
                "Hi,",
                "Your request for the team $teamName is approved. You can create the team now:",
                createTeamUrl,
                "This link works for 30 days and once.",
            ),
        )
    }

    fun rejected(teamName: String, reason: String?, language: Language): RenderedEmail = when (language) {
        Language.NL -> render(
            subject = "Je aanvraag voor $teamName is niet goedgekeurd",
            noReply = NO_REPLY_NL,
            lines = listOfNotNull(
                "Hoi,",
                "Je aanvraag voor het team $teamName is deze keer niet goedgekeurd.",
                reason?.let { "Reden: $it" },
            ),
        )
        Language.EN -> render(
            subject = "Your request for $teamName was not approved",
            noReply = NO_REPLY_EN,
            lines = listOfNotNull(
                "Hi,",
                "Your request for the team $teamName was not approved this time.",
                reason?.let { "Reason: $it" },
            ),
        )
    }

    private fun render(subject: String, noReply: String, lines: List<String>) = RenderedEmail(
        subject = subject,
        text = (lines + noReply).joinToString("\n\n"),
        html = """
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
              <p style="font-size:20px;font-weight:bold;">TeamBalance</p>
              ${lines.joinToString("\n") { "<p>${HtmlUtils.htmlEscape(it)}</p>" }}
              <p style="font-size:12px;color:#999;">$noReply</p>
            </div>
        """.trimIndent(),
    )

    private fun encode(value: String) = URLEncoder.encode(value, StandardCharsets.UTF_8)
}
