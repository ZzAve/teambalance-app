package com.github.zzave.teambalance.api.infrastructure.email

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * Scaleway Transactional Email "send email" REST payload
 * (POST /transactional-email/v1alpha1/regions/{region}/emails).
 */
data class TemSendEmailRequest(
    val from: TemAddress,
    val to: List<TemAddress>,
    val subject: String,
    val text: String,
    val html: String,
    @JsonProperty("project_id") val projectId: String,
)

data class TemAddress(
    val email: String,
    val name: String? = null,
)

/** Maps the rendered email onto the external TEM payload (outbound: internal -> external DTO). */
fun RenderedEmail.externalize(from: TemAddress, to: TemAddress, projectId: String): TemSendEmailRequest =
    TemSendEmailRequest(
        from = from,
        to = listOf(to),
        subject = subject,
        text = text,
        html = html,
        projectId = projectId,
    )
