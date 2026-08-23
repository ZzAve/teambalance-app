package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import java.time.Instant
import java.util.UUID

/**
 * An in-memory stand-in for the `public` schema — Teams, who is an active Member of which, and each
 * user's remembered Active Team — behind the three ports that read it.
 *
 * Shared by the tests that exercise the Active Team seam because the interesting cases are *shapes of
 * the directory* (two memberships, a remembered Team whose membership was revoked, a deactivated row)
 * rather than shapes of a single port's answers. Building those from one holder keeps the three ports
 * consistent with each other the way the database keeps them consistent — a fake that let
 * `findTeamsOf` and `findTenantRouting` disagree could not reproduce the bug this seam fixes.
 */
internal class TeamDirectory {
    private data class TeamRow(val summary: TeamSummary, val schemaName: SchemaName)

    private val teams = mutableMapOf<TeamId, TeamRow>()

    /** (userId, teamId) -> role, present only while the membership is active. */
    private val memberships = mutableMapOf<Pair<UserId, TeamId>, Role>()
    private val remembered = mutableMapOf<UserId, TeamId>()

    fun addTeam(name: String, slug: String): TeamId {
        val id = TeamId(UUID.randomUUID())
        teams[id] = TeamRow(
            summary = TeamSummary(id = id, name = TeamName(name), slug = Slug(slug)),
            schemaName = SchemaName("team_${slug.replace("-", "_")}"),
        )
        return id
    }

    fun join(userId: UserId, teamId: TeamId, role: Role = Role.USER) {
        memberships[userId to teamId] = role
    }

    /** Ends the membership the way `active = false` does: the row is gone for every read. */
    fun leave(userId: UserId, teamId: TeamId) {
        memberships.remove(userId to teamId)
    }

    fun rememberedTeamOf(userId: UserId): TeamId? = remembered[userId]

    fun schemaOf(teamId: TeamId): SchemaName = teams.getValue(teamId).schemaName

    fun summaryOf(teamId: TeamId): TeamSummary = teams.getValue(teamId).summary

    private fun routing(teamId: TeamId) =
        teams[teamId]?.let { TenantRouting(teamId = teamId, schemaName = it.schemaName) }

    fun teamRepository(): TeamRepository = object : TeamRepository {
        override fun findAllSchemaNames(): List<SchemaName> = teams.values.map { it.schemaName }
        override fun existsBySlug(slug: Slug): Boolean = teams.values.any { it.summary.slug == slug }
        override fun findTeamsOf(userId: UUID): List<TeamSummary> =
            memberships.keys
                .filter { it.first.value == userId }
                .mapNotNull { teams[it.second]?.summary }
                .sortedBy { it.name.value }
        override fun findBySlug(slug: Slug): TeamSummary? =
            teams.values.firstOrNull { it.summary.slug == slug }?.summary
    }

    fun userRepository(vararg users: User): UserRepository = object : UserRepository {
        private val byId = users.associateBy { it.id }
        override fun findById(id: UserId): User? = byId[id]
        override fun findByEmail(email: Email): User? = byId.values.firstOrNull { it.email == email }
        override fun save(user: User): User = user
        override fun findLastActiveTeamId(userId: UserId): TeamId? = remembered[userId]
        override fun rememberActiveTeam(userId: UserId, teamId: TeamId) {
            remembered[userId] = teamId
        }
    }

    @Suppress("TooManyFunctions")
    fun teamMemberRepository(): TeamMemberRepository = object : TeamMemberRepository {
        override fun findRole(teamId: TeamId, userId: UserId): Role? = memberships[userId to teamId]

        override fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting? =
            routing(teamId)?.takeIf { memberships.containsKey(userId to teamId) }

        override fun findSoleTenantRouting(userId: UserId): TenantRouting? =
            memberships.keys.filter { it.first == userId }.singleOrNull()?.let { routing(it.second) }

        override fun addMember(teamId: TeamId, userId: UserId) = join(userId, teamId)

        override fun findByTeamId(teamId: TeamId): List<TeamMember> = emptyList()
        override fun findDisplayName(userId: UserId): DisplayName? = null
        override fun findMembersByUserIds(userIds: Set<UserId>): Map<UserId, TeamMember> = emptyMap()
        override fun updateRole(teamId: TeamId, userId: UserId, role: Role) = join(userId, teamId, role)
        override fun deactivate(teamId: TeamId, userId: UserId) = leave(userId, teamId)
        override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) = Unit
        override fun markOnboarded(teamId: TeamId, userId: UserId, at: Instant) = Unit
        override fun applyMemberEdit(
            teamId: TeamId,
            userId: UserId,
            displayName: DisplayName,
            role: Role,
            positionId: PositionId?,
            markOnboardedAt: Instant?,
        ) = Unit
        override fun countAdmins(teamId: TeamId): Int =
            memberships.count { it.key.second == teamId && it.value == Role.ADMIN }
    }
}

/**
 * Records every pin in order. Order matters: the pin IS the session-memo invalidation (ADR-0021 §2),
 * so "was the last pin the Team we switched to?" is the assertion that a switch cannot be read back
 * as the previous tenant.
 */
internal class RecordingTenantRoutingGateway : TenantRoutingGateway {
    /** Every pin and clear in order — `null` is a clear. */
    val writes = mutableListOf<TenantRouting?>()

    val pins: List<TenantRouting> get() = writes.filterNotNull()
    val lastPinned: TenantRouting? get() = pins.lastOrNull()

    /** What the session would actually be carrying now: the last write, pin or clear. */
    val pinned: TenantRouting? get() = writes.lastOrNull()

    override fun pinRouting(routing: TenantRouting) {
        writes += routing
    }

    override fun clearRouting() {
        writes += null
    }
}

internal fun TeamDirectory.activeTeamService(
    routingGateway: TenantRoutingGateway,
    vararg users: User,
) = ActiveTeamService(
    teamMemberRepository = teamMemberRepository(),
    teamRepository = teamRepository(),
    userRepository = userRepository(*users),
    tenantRoutingGateway = routingGateway,
)
