package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Language

/**
 * Fire-and-forget notifications emitted after a team is created. Implementations MUST swallow their own
 * failures (a bounced email must never fail team creation) — callers treat every method as best-effort.
 */
interface TeamNotificationGateway {
    /** Tells the founder their new team is ready, in [language]. */
    fun teamCreated(founderEmail: String, teamName: String, teamSlug: String, language: Language)

    /** Audit trail to the platform admins: a creation code was consumed and a team was created. */
    fun creationCodeConsumed(teamName: String, teamSlug: String, founderEmail: String)
}
