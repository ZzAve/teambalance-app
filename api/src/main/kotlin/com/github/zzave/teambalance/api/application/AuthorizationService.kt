package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import java.util.UUID

/**
 * Team-scoped authorization checks — the single chokepoint every team-scoped decision passes through
 * (ADR-0023 §1). Act-as (ADR-0024) will add a second *source* of a Role here (a synthesized Virtual
 * Member) rather than a second path around it.
 *
 * SECURITY CONTRACT — this primitive is only as safe as its arguments:
 * - [userId] MUST be the authenticated principal (from the session, e.g. `UserContext.get()`),
 *   never a user-supplied id from a request body/path/query — otherwise this is trivially bypassed.
 * - [teamId] MAY be caller-influenced — a slug in a shared link, a Team picked in the switcher — and
 *   is made safe by being validated *here* rather than by never reaching here. What that requires of
 *   callers: a team id that fails [findRole][TeamMemberRepository.findRole] must resolve to **no
 *   tenant** (`TenantContext.NO_TENANT_SCHEMA`), never to `public` and never to the caller's previous
 *   Team; and the rejection must be indistinguishable from "no such team", so the id space cannot be
 *   probed for which Teams exist.
 *
 * The check is fail-closed: a missing, inactive, or wrong-team membership yields no role and is
 * therefore neither a member nor an admin.
 */
class AuthorizationService(
    private val teamMemberRepository: TeamMemberRepository,
) {
    fun isAdmin(userId: UserId, teamId: TeamId): Boolean =
        teamMemberRepository.findRole(teamId, userId) == Role.ADMIN

    fun requireAdmin(userId: UserId, teamId: TeamId) {
        if (!isAdmin(userId, teamId)) throw NotTeamAdminException(userId, teamId)
    }

    /** True when [userId] is an active member of [teamId], regardless of role. */
    fun isMember(userId: UserId, teamId: TeamId): Boolean =
        teamMemberRepository.findRole(teamId, userId) != null

    /**
     * Asserts [userId] is an active member of [teamId] — the gate for team-scoped writes that any
     * member may perform (e.g. trust-based attendance editing, ADR-0003). Fail-closed: a non-member
     * yields no role and is rejected. Same security contract as [requireAdmin] on its arguments.
     */
    fun requireMember(userId: UserId, teamId: TeamId) {
        if (!isMember(userId, teamId)) throw NoTeamMembershipException(userId)
    }
}
