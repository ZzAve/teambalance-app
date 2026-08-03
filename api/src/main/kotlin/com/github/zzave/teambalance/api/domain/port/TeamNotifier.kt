package com.github.zzave.teambalance.api.domain.port

/**
 * Fire-and-forget notifications emitted after a team is created. Implementations MUST swallow their own
 * failures (a bounced email must never fail team creation) — callers treat every method as best-effort.
 */
interface TeamNotifier {
    /** Tells the founder their new team is ready. */
    fun teamCreated(founderEmail: String, teamName: String, teamSlug: String)

    /** Audit trail to the platform admins: a creation code was consumed and a team was created. */
    fun creationCodeConsumed(teamName: String, teamSlug: String, founderEmail: String)
}
