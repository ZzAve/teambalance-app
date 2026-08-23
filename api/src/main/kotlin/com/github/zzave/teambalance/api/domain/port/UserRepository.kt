package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId

interface UserRepository {
    fun findById(id: UserId): User?
    fun findByEmail(email: Email): User?
    fun save(user: User): User

    /**
     * The Team this user last had active, or null when nothing is remembered yet. It is a *hint*, not
     * an authorization: the membership behind it may since have been revoked, so a reader must
     * re-verify it before routing anything to that tenant (ADR-0021 §3).
     */
    fun findLastActiveTeamId(userId: UserId): TeamId?

    /**
     * Remembers [teamId] as the user's Active Team, so a later sign-in — on another device, weeks
     * later — lands them back where they were. Written on every switch, link-induced ones included.
     */
    fun rememberActiveTeam(userId: UserId, teamId: TeamId)
}
