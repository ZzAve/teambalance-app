package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.DemoPersonaProtectedException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * The write blocks of the demo team (ADR-0043): its personas stay on the roster with their role. Scoped to the demo team
 * id, so the same user ids in another team are ordinary members. Only built while `teambalance.demo.enabled` is on.
 */
class DemoProtection(private val teamId: TeamId, private val protectedUsers: Set<UserId>) {
    fun protects(team: TeamId, user: UserId) = team == teamId && user in protectedUsers

    fun requireNotProtected(team: TeamId, user: UserId) {
        if (protects(team, user)) throw DemoPersonaProtectedException()
    }

    companion object {
        fun ofDemoTeam() = DemoProtection(DemoPersona.TEAM_ID, DemoPersona.entries.map { it.userId }.toSet())
    }
}
