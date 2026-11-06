package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import java.util.UUID

/** The guests a visitor can play on the demo team (ADR-0043). The ids are the literals in `db/seed/demo_team.sql`. */
enum class DemoPersona(val userId: UserId) {
    MEMBER(UserId(UUID.fromString("d0000000-0000-0000-0000-000000000011"))),
    ADMIN(UserId(UUID.fromString("d0000000-0000-0000-0000-000000000012"))),
    ;

    companion object {
        val TEAM_ID = TeamId(UUID.fromString("d0000000-0000-0000-0000-000000000001"))
        const val SCHEMA = "team_de_smashers"
        const val SLUG = "de-smashers"
    }
}

enum class DemoSessionOutcome { STARTED, DISABLED, UNKNOWN_PERSONA }

/**
 * Guest login for the demo team (ADR-0043). The session and tenant pin are the ones a magic-link sign-in
 * makes ([AuthService.startSession]); only the proof of identity differs: there is none, which is why the
 * switch is [enabled] only in the demo container, whose boot check refuses to start next to real mail,
 * Bunq or data.
 */
class DemoSessionService(
    private val enabled: Boolean,
    private val authService: AuthService,
    private val demoResetService: DemoResetService,
) {
    fun start(persona: String): DemoSessionOutcome {
        val known = DemoPersona.entries.firstOrNull { it.name == persona }
        return when {
            !enabled -> DemoSessionOutcome.DISABLED
            known == null -> DemoSessionOutcome.UNKNOWN_PERSONA
            else -> {
                // Before the session: a reset drops every session, and this one must survive it.
                demoResetService.resetIfDue()
                authService.startSession(known.userId)
                DemoSessionOutcome.STARTED
            }
        }
    }
}
