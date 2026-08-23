package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.ActAsExpiredException
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository

/**
 * Team-scoped authorization checks — the single chokepoint every team-scoped decision passes through
 * (ADR-0023 §1).
 *
 * It answers from one of two sources: a real `team_members` row, or the **Virtual Member** a
 * **Platform Admin** holds inside a Team during **Act-as** (ADR-0024 §2). The synthesis lives here,
 * in the application layer, because this is where act-as state is knowable; the repository keeps
 * answering the truth (`null` — they are not a member), since a data-access adapter has no business
 * inventing memberships that every roster and count would then have to remember to filter out.
 *
 * SECURITY CONTRACT — this primitive is only as safe as its arguments:
 * - [userId] MUST be the authenticated principal (from the session, e.g. `UserContext.get()`),
 *   never a user-supplied id from a request body/path/query — otherwise this is trivially bypassed.
 * - [teamId] MAY be caller-influenced — a slug in a shared link, a Team picked in the switcher — and
 *   is made safe by being validated here rather than by never reaching here. A team id that fails
 *   both sources must resolve to **no tenant** (`TenantContext.NO_TENANT_SCHEMA`), never to `public`
 *   and never to the caller's previous Team, and must be indistinguishable from "no such team".
 * - The Virtual Member keys off an **actively entered, unexpired** grant for *this* caller and *this*
 *   team, never off `isPlatformAdmin` — that would make an ordinary session silently admin of
 *   whatever tenant it happened to be routed to (ADR-0024 §2).
 *
 * The check is fail-closed: a missing, inactive, or wrong-team membership with no grant behind it
 * yields no role and is therefore neither a member nor an admin.
 */
class AuthorizationService(
    private val teamMemberRepository: TeamMemberRepository,
    private val actAsGateway: ActAsGateway,
) {
    fun isAdmin(userId: UserId, teamId: TeamId): Boolean = findRole(userId, teamId) == Role.ADMIN

    fun requireAdmin(userId: UserId, teamId: TeamId) {
        if (isAdmin(userId, teamId)) return
        throw lapsedOr(userId) { NotTeamAdminException(userId, teamId) }
    }

    /** True when [userId] is an active member of [teamId], regardless of role. */
    fun isMember(userId: UserId, teamId: TeamId): Boolean = findRole(userId, teamId) != null

    /**
     * Asserts [userId] is an active member of [teamId] — the gate for team-scoped writes that any
     * member may perform (e.g. trust-based attendance editing, ADR-0003). Fail-closed: a non-member
     * yields no role and is rejected. Same security contract as [requireAdmin] on its arguments.
     */
    fun requireMember(userId: UserId, teamId: TeamId) {
        if (isMember(userId, teamId)) return
        throw lapsedOr(userId) { NoTeamMembershipException(userId) }
    }

    /**
     * The caller's Role here: their real one, or `ADMIN` synthesized for the duration of the request
     * from an act-as grant. Nothing is written — the roster, the attendance denominator, the Position
     * breakdown and the contributor rankings never see a Virtual Member.
     */
    private fun findRole(userId: UserId, teamId: TeamId): Role? =
        teamMemberRepository.findRole(teamId, userId)
            ?: Role.ADMIN.takeIf { isActingAs(userId, teamId) }

    // Both the caller and the team must match the grant: `userId` is not always the principal (a
    // service may ask about another member), and a grant on one team says nothing about another.
    private fun isActingAs(userId: UserId, teamId: TeamId): Boolean =
        actAsGateway.current()?.let { it.userId == userId && it.teamId == teamId } == true

    /**
     * A lapsed act-as is reported as itself, not as a bare denial: the frontend returns the Platform
     * Admin to the console on `ACT_AS_EXPIRED`, and would have no way to tell that from "you may not
     * do this" if both arrived as the same 403.
     */
    private inline fun lapsedOr(userId: UserId, otherwise: () -> RuntimeException): RuntimeException =
        if (actAsGateway.isLapsed()) ActAsExpiredException(userId) else otherwise()
}
