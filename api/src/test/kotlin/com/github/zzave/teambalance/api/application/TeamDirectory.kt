package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotPlatformAdminException
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.ActAsRepository
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import java.time.Instant
import java.util.Base64
import java.util.UUID

/**
 * An in-memory stand-in for the `public` schema behind the three ports that read it.
 *
 * One holder rather than three independent fakes, because the interesting cases are shapes of the
 * *directory* (two memberships, a revoked one, a deactivated row) and the ports have to stay
 * consistent with each other the way the database keeps them consistent.
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

    /** Ends the membership the way `active = false` does: gone for every read. */
    fun leave(userId: UserId, teamId: TeamId) {
        memberships.remove(userId to teamId)
    }

    fun rememberedTeamOf(userId: UserId): TeamId? = remembered[userId]

    /** The `team_members` rows, as the security invariant reads them: act-as must never add one. */
    fun membershipsOf(userId: UserId): Set<TeamId> = memberships.keys.filter { it.first == userId }.map { it.second }.toSet()

    fun schemaOf(teamId: TeamId): SchemaName = teams.getValue(teamId).schemaName

    fun summaryOf(teamId: TeamId): TeamSummary = teams.getValue(teamId).summary

    fun tenantRoutingOf(teamId: TeamId): TenantRouting = routing(teamId)!!

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

        override fun findById(teamId: TeamId): TeamSummary? = teams[teamId]?.summary

        // Deliberately blind to `memberships` — the point of the unchecked lookup (ADR-0024).
        override fun findTenantRoutingUnchecked(teamId: TeamId): TenantRouting? = routing(teamId)

        override fun findAll(): List<TeamSummary> = teams.values.map { it.summary }.sortedBy { it.name.value }
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

        override fun addMember(teamId: TeamId, userId: UserId, role: Role) = join(userId, teamId, role)

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

        // This directory models membership and roles, not positions — assignPosition is a no-op here
        // — so nobody holds one. The position-usage counts (#219) are proven against a real Postgres
        // in EventTypeAdminIT and as pure logic in PositionServiceTest, both of which track positions.
        override fun countByPosition(teamId: TeamId, positionId: PositionId): Int = 0
    }
}

/**
 * In-memory `act_as_sessions`. Keyed by episode id, exactly like the table, so "one open grant per
 * user" is a property the tests can observe rather than one the fake enforces for them.
 */
internal class InMemoryActAsRepository : ActAsRepository {
    private val episodes = linkedMapOf<UUID, ActAs>()

    override fun findOpenFor(userId: UserId): ActAs? =
        episodes.values.lastOrNull { it.userId == userId && it.exitedAt == null }

    override fun save(actAs: ActAs) {
        episodes[actAs.id.value] = actAs
    }

    override fun findForTeam(teamId: TeamId): List<ActAs> =
        episodes.values.filter { it.teamId == teamId }.sortedByDescending { it.enteredAt }

    /** Every episode ever opened, including closed ones — the Act-as Record's raw material. */
    fun all(): List<ActAs> = episodes.values.toList()
}

/** The allowlist, reduced to its one decision. Fail-closed: nobody is on it unless named. */
internal class AllowlistedPlatformAdmins(private val admins: Set<UserId>) : PlatformAdminGateway {
    override fun isPlatformAdmin(userId: UUID): Boolean = admins.any { it.value == userId }
    override fun requirePlatformAdmin(userId: UUID) {
        if (!isPlatformAdmin(userId)) throw NotPlatformAdminException(userId)
    }
}

/** Stands in for what the request filter resolved — the only source of a Virtual Member. */
internal class FakeActAsGateway(
    private val grant: ActAs? = null,
    private val lapsed: ActAs? = null,
) : ActAsGateway {
    override fun current(): ActAs? = grant
    override fun lapsed(): ActAs? = lapsed
}

/** Order matters: the pin is the session-memo invalidation (ADR-0023 §2). */
internal class RecordingTenantRoutingGateway : TenantRoutingGateway {
    /** In order; `null` is a clear. */
    val writes = mutableListOf<TenantRouting?>()

    val pins: List<TenantRouting> get() = writes.filterNotNull()
    val lastPinned: TenantRouting? get() = pins.lastOrNull()

    /** What the session would be carrying now. */
    val pinned: TenantRouting? get() = writes.lastOrNull()

    override fun pinRouting(routing: TenantRouting) {
        writes += routing
    }

    override fun clearRouting() {
        writes += null
    }
}

internal fun TeamDirectory.actAsService(
    routingGateway: TenantRoutingGateway,
    actAsRepository: ActAsRepository,
    clock: java.time.Clock,
    platformAdmins: Set<UserId>,
    actAsGateway: ActAsGateway = FakeActAsGateway(),
) = ActAsService(
    platformAdminGateway = AllowlistedPlatformAdmins(platformAdmins),
    actAsRepository = actAsRepository,
    actAsGateway = actAsGateway,
    teamRepository = teamRepository(),
    tenantRoutingGateway = routingGateway,
    clock = clock,
)

internal fun TeamDirectory.activeTeamService(
    routingGateway: TenantRoutingGateway,
    vararg users: User,
) = ActiveTeamService(
    teamMemberRepository = teamMemberRepository(),
    teamRepository = teamRepository(),
    userRepository = userRepository(*users),
    tenantRoutingGateway = routingGateway,
)

/**
 * `invitations`, reduced to the one link a sign-in might carry. Readable by hash or by id, because a
 * magic link requested from an Invite Link remembers the invitation's id rather than its token (#342)
 * and so accepts through the id-shaped read.
 *
 * Hash matching is deliberately not modelled: a presented token resolves to whatever link is loaded,
 * the same shortcut InvitationServiceTest's fake takes, because hashing is never the subject here.
 * "No such link" is expressed by loading none.
 */
internal class InMemoryInvitationRepository(private var invitation: Invitation? = null) : InvitationRepository {
    private val consumed = mutableSetOf<UUID>()

    /** Swap the loaded link — how a test expires or rotates one between request and click. */
    fun put(value: Invitation?) {
        invitation = value
    }

    override fun save(invitation: Invitation) =
        invitation.also { this.invitation = it }

    override fun findByTokenHash(tokenHash: TokenHash) = invitation

    override fun findById(invitationId: UUID) = invitation?.takeIf { it.id == invitationId }

    override fun findActiveByTeam(teamId: TeamId, now: Instant) = invitation?.takeIf {
        it.role == Role.USER && it.teamId == teamId && it.expiresAt.isAfter(now)
    }

    override fun findActiveAdminByTeam(teamId: TeamId, now: Instant) = invitation?.takeIf {
        it.role == Role.ADMIN && it.id !in consumed && it.teamId == teamId && it.expiresAt.isAfter(now)
    }

    override fun consume(invitationId: UUID, now: Instant): Boolean = consumed.add(invitationId)

    override fun expireActive(teamId: TeamId, role: Role, now: Instant) {
        invitation = null
    }

    override fun rotate(teamId: TeamId, replacement: Invitation, now: Instant) =
        replacement.also { invitation = it }
}

internal fun TeamDirectory.invitationService(
    invitations: InvitationRepository,
    routingGateway: TenantRoutingGateway,
    clock: java.time.Clock,
    vararg users: User,
) = InvitationService(
    invitationRepository = invitations,
    teamMemberRepository = teamMemberRepository(),
    authorizationService = AuthorizationService(teamMemberRepository(), FakeActAsGateway()),
    activeTeamService = activeTeamService(routingGateway, *users),
    clock = clock,
    tokenSalt = "test-salt",
    tokenCipher = InviteTokenCipher.fromBase64Key(
        Base64.getEncoder().encodeToString(ByteArray(32) { it.toByte() }),
    ),
)
