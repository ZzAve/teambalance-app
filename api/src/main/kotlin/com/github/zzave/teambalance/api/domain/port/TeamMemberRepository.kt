package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TeamMember
import java.util.UUID

interface TeamMemberRepository {
    fun findByTeamId(teamId: UUID): List<TeamMember>
    fun findDisplayName(userId: UUID): String?
}
