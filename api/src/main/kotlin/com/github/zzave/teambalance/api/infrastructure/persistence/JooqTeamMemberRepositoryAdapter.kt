package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.PhotoVersion
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.ShirtNumber
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.MEMBER_PAYMENT_ALIASES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.MEMBER_PHOTOS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.MEMBER_PROFILES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.POSITIONS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.TEAMS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.TEAM_MEMBERS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.USERS
import org.jooq.Condition
import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.impl.DSL
import org.jooq.impl.DSL.excluded
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

// Cohesive data-access surface for team_members; the member-management feature grew it past the
// default 11-function limit. Splitting a single adapter/port would be artificial.
@Suppress("TooManyFunctions")
@Repository
class JooqTeamMemberRepositoryAdapter(
    private val dsl: DSLContext,
) : TeamMemberRepository {
    override fun findByTeamId(teamId: TeamId): List<TeamMember> =
        memberSummaries(TEAM_MEMBERS.TEAM_ID.eq(teamId.value))

    // The tenant's name for this member, falling back to the platform one (ADR-0026). The fallback is
    // not decoration: a member seeded outside the backfill has no profile row yet, and answering NULL
    // would blank a name that exists.
    override fun findDisplayName(userId: UserId): DisplayName? =
        dsl.select(TENANT_OR_PLATFORM_NAME)
            .from(USERS)
            .leftJoin(MEMBER_PROFILES).on(MEMBER_PROFILES.USER_ID.eq(USERS.ID))
            .where(USERS.ID.eq(userId.value))
            .fetchOne(TENANT_OR_PLATFORM_NAME)
            ?.let(::DisplayName)

    override fun findMembersByUserIds(teamId: TeamId, userIds: Set<UserId>): Map<UserId, TeamMember> {
        if (userIds.isEmpty()) return emptyMap()
        return memberSummaries(
            TEAM_MEMBERS.TEAM_ID.eq(teamId.value).and(TEAM_MEMBERS.USER_ID.`in`(userIds.map { it.value })),
        ).associateBy { it.userId }
    }

    // Unqualified tenant joins on purpose (ADR-0026): they resolve against the routed tenant schema, so
    // the summary reports the name and position this member carries *in this team* — which is what
    // multi-team membership (ADR-0023) made a distinction worth drawing.
    private fun memberSummaries(condition: Condition): List<TeamMember> =
        dsl.select(
            TEAM_MEMBERS.USER_ID,
            TENANT_OR_PLATFORM_NAME,
            MEMBER_PROFILES.POSITION_ID,
            POSITIONS.LABEL,
            MEMBER_PROFILES.SHIRT_NUMBER,
            MEMBER_PHOTOS.VERSION,
            TEAM_MEMBERS.ROLE,
            ONBOARDED,
        )
            .from(TEAM_MEMBERS)
            .join(USERS).on(USERS.ID.eq(TEAM_MEMBERS.USER_ID))
            .leftJoin(MEMBER_PROFILES).on(MEMBER_PROFILES.USER_ID.eq(TEAM_MEMBERS.USER_ID))
            .leftJoin(POSITIONS).on(POSITIONS.ID.eq(MEMBER_PROFILES.POSITION_ID))
            .leftJoin(MEMBER_PHOTOS).on(MEMBER_PHOTOS.USER_ID.eq(TEAM_MEMBERS.USER_ID))
            .where(condition)
            .and(TEAM_MEMBERS.ACTIVE.isTrue)
            .fetch { it.toTeamMember() }

    private fun Record.toTeamMember() = TeamMember(
        userId = UserId(this[TEAM_MEMBERS.USER_ID]),
        displayName = DisplayName(this[TENANT_OR_PLATFORM_NAME]),
        permission = Role.valueOf(this[TEAM_MEMBERS.ROLE]),
        positionId = this[MEMBER_PROFILES.POSITION_ID]?.let(::PositionId),
        position = this[POSITIONS.LABEL]?.let(::PositionLabel),
        onboarded = this[ONBOARDED],
        shirtNumber = this[MEMBER_PROFILES.SHIRT_NUMBER]?.let { ShirtNumber(it.toInt()) },
        photoVersion = this[MEMBER_PHOTOS.VERSION]?.let(::PhotoVersion),
    )

    override fun findRole(teamId: TeamId, userId: UserId): Role? =
        activeRoleName(teamId, userId)?.let { name -> Role.entries.firstOrNull { it.name == name } }

    private fun activeRoleName(teamId: TeamId, userId: UserId): String? =
        dsl.select(TEAM_MEMBERS.ROLE)
            .from(TEAM_MEMBERS)
            .where(TEAM_MEMBERS.TEAM_ID.eq(teamId.value))
            .and(TEAM_MEMBERS.USER_ID.eq(userId.value))
            .and(TEAM_MEMBERS.ACTIVE.isTrue)
            .fetchOne(TEAM_MEMBERS.ROLE)

    // The write schema and the authorized team id come from the same row, so they cannot diverge.
    // The `user_id AND active` predicate IS the membership check.
    override fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting? =
        routings(TEAM_MEMBERS.USER_ID.eq(userId.value).and(TEAM_MEMBERS.TEAM_ID.eq(teamId.value)), limit = 1)
            .singleOrNull()

    // Null on 0 rows AND on 2: "several teams" is not a routing, it is a question for the user. Two
    // rows are enough to tell the cases apart, so the query stops there.
    override fun findSoleTenantRouting(userId: UserId): TenantRouting? =
        routings(TEAM_MEMBERS.USER_ID.eq(userId.value), limit = 2).singleOrNull()

    private fun routings(condition: Condition, limit: Int): List<TenantRouting> =
        dsl.select(TEAM_MEMBERS.TEAM_ID, TEAMS.SCHEMA_NAME)
            .from(TEAM_MEMBERS)
            .join(TEAMS).on(TEAMS.ID.eq(TEAM_MEMBERS.TEAM_ID))
            .where(condition)
            .and(TEAM_MEMBERS.ACTIVE.isTrue)
            .limit(limit)
            .fetch { TenantRouting(teamId = TeamId(it[TEAM_MEMBERS.TEAM_ID]), schemaName = SchemaName(it[TEAMS.SCHEMA_NAME])) }

    override fun updateRole(teamId: TeamId, userId: UserId, role: Role) {
        setRole(teamId, userId, role)
    }

    // Leaving the team frees the Shirt Number and discards the Team Photo (ADR-0038), so a member who
    // re-joins starts without either.
    @Transactional
    override fun deactivate(teamId: TeamId, userId: UserId) {
        dsl.update(TEAM_MEMBERS)
            .set(TEAM_MEMBERS.ACTIVE, false)
            .where(TEAM_MEMBERS.TEAM_ID.eq(teamId.value))
            .and(TEAM_MEMBERS.USER_ID.eq(userId.value))
            .execute()
        dsl.update(MEMBER_PROFILES)
            .setNull(MEMBER_PROFILES.SHIRT_NUMBER)
            .where(MEMBER_PROFILES.USER_ID.eq(userId.value))
            .execute()
        dsl.deleteFrom(MEMBER_PHOTOS).where(MEMBER_PHOTOS.USER_ID.eq(userId.value)).execute()
        dsl.deleteFrom(MEMBER_PAYMENT_ALIASES).where(MEMBER_PAYMENT_ALIASES.USER_ID.eq(userId.value)).execute()
    }

    /**
     * The assignment lives in the tenant's `member_profiles` (ADR-0026), so it is scoped by the
     * routed schema and [teamId] no longer selects the row — it stays in the signature because the
     * port is a team-scoped contract and callers authorize against it.
     */
    @Transactional
    override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) {
        val shirtNumber = dsl.select(MEMBER_PROFILES.SHIRT_NUMBER)
            .from(MEMBER_PROFILES)
            .where(MEMBER_PROFILES.USER_ID.eq(userId.value))
            .fetchOne(MEMBER_PROFILES.SHIRT_NUMBER)
        writeProfile(userId, displayName = null, positionId = positionId, shirtNumber = shirtNumber?.let { ShirtNumber(it.toInt()) })
    }

    /**
     * One place for the tenant-side profile write, shared by the single-field and whole-member paths
     * so they cannot drift.
     *
     * The position and shirt number are authoritative on both paths (null clears them); [displayName]
     * is optional, since assignPosition must not blank a name it was never given. A member with no profile row yet gets
     * one, seeded from the platform name — the only moment that column is read for this purpose.
     */
    private fun writeProfile(
        userId: UserId,
        displayName: DisplayName?,
        positionId: PositionId?,
        shirtNumber: ShirtNumber?,
    ) {
        val name = displayName?.value ?: profileName(userId) ?: platformName(userId) ?: ""
        dsl.insertInto(MEMBER_PROFILES)
            .set(MEMBER_PROFILES.USER_ID, userId.value)
            .set(MEMBER_PROFILES.DISPLAY_NAME, name)
            .set(MEMBER_PROFILES.POSITION_ID, positionId?.value)
            .set(MEMBER_PROFILES.SHIRT_NUMBER, shirtNumber?.value?.toShort())
            .onConflict(MEMBER_PROFILES.USER_ID)
            .doUpdate()
            .set(MEMBER_PROFILES.DISPLAY_NAME, excluded(MEMBER_PROFILES.DISPLAY_NAME))
            .set(MEMBER_PROFILES.POSITION_ID, excluded(MEMBER_PROFILES.POSITION_ID))
            .set(MEMBER_PROFILES.SHIRT_NUMBER, excluded(MEMBER_PROFILES.SHIRT_NUMBER))
            .execute()
    }

    private fun profileName(userId: UserId): String? =
        dsl.select(MEMBER_PROFILES.DISPLAY_NAME)
            .from(MEMBER_PROFILES)
            .where(MEMBER_PROFILES.USER_ID.eq(userId.value))
            .fetchOne(MEMBER_PROFILES.DISPLAY_NAME)

    private fun platformName(userId: UserId): String? =
        dsl.select(USERS.DISPLAY_NAME).from(USERS).where(USERS.ID.eq(userId.value)).fetchOne(USERS.DISPLAY_NAME)

    @Transactional
    override fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: DisplayName,
        role: Role,
        positionId: PositionId?,
        shirtNumber: ShirtNumber?,
        markOnboardedAt: Instant?,
    ) {
        // The platform name is deliberately NOT written here (ADR-0026): it is the teamless fallback
        // and the onboarding seed, and a team-scoped edit updating it is exactly the cross-team
        // rename that multi-team membership turned into a bug.
        setRole(teamId, userId, role)
        writeProfile(userId, displayName = displayName, positionId = positionId, shirtNumber = shirtNumber)
        if (markOnboardedAt != null) {
            markOnboarded(teamId, userId, markOnboardedAt)
        }
    }

    override fun markOnboarded(teamId: TeamId, userId: UserId, at: Instant) {
        dsl.update(TEAM_MEMBERS)
            .set(TEAM_MEMBERS.ONBOARDED_AT, at.atOffset(ZoneOffset.UTC))
            .where(TEAM_MEMBERS.TEAM_ID.eq(teamId.value))
            .and(TEAM_MEMBERS.USER_ID.eq(userId.value))
            .and(TEAM_MEMBERS.ACTIVE.isTrue)
            .execute()
    }

    override fun countAdmins(teamId: TeamId): Int =
        dsl.fetchCount(
            TEAM_MEMBERS,
            TEAM_MEMBERS.TEAM_ID.eq(teamId.value).and(TEAM_MEMBERS.ROLE.eq(Role.ADMIN.name)).and(TEAM_MEMBERS.ACTIVE.isTrue),
        )

    /**
     * Active members holding this position — what a delete would leave Unassigned (#219).
     *
     * Same shape as the member listing: the platform table drives (it owns membership and the active
     * flag) and the unqualified `member_profiles` joins in from the routed tenant schema, which is
     * where the assignment has lived since ADR-0026. The team id is still needed even though the
     * schema already scopes the profiles — without it, somebody removed from THIS team but active in
     * another would keep their profile row and be counted.
     */
    override fun countByPosition(teamId: TeamId, positionId: PositionId): Int =
        dsl.fetchCount(
            dsl.selectOne()
                .from(TEAM_MEMBERS)
                .join(MEMBER_PROFILES).on(MEMBER_PROFILES.USER_ID.eq(TEAM_MEMBERS.USER_ID))
                .where(MEMBER_PROFILES.POSITION_ID.eq(positionId.value))
                .and(TEAM_MEMBERS.TEAM_ID.eq(teamId.value))
                .and(TEAM_MEMBERS.ACTIVE.isTrue),
        )

    // On an existing row the invitation's role decides only for a removed member (re-joining after
    // removal); an active member is promoted by an ADMIN link and never demoted by a USER link, whichever
    // accept commits first.
    // (team_id, user_id) is UNIQUE, so a removed member's row is reactivated rather than re-inserted.
    override fun addMember(teamId: TeamId, userId: UserId, role: Role) {
        dsl.insertInto(TEAM_MEMBERS)
            .set(TEAM_MEMBERS.ID, UUID.randomUUID())
            .set(TEAM_MEMBERS.TEAM_ID, teamId.value)
            .set(TEAM_MEMBERS.USER_ID, userId.value)
            .set(TEAM_MEMBERS.ROLE, role.name)
            .onConflict(TEAM_MEMBERS.TEAM_ID, TEAM_MEMBERS.USER_ID)
            .doUpdate()
            .set(TEAM_MEMBERS.ACTIVE, true)
            .set(
                TEAM_MEMBERS.ROLE,
                DSL.case_()
                    .`when`(TEAM_MEMBERS.ACTIVE.isFalse, excluded(TEAM_MEMBERS.ROLE))
                    .`when`(excluded(TEAM_MEMBERS.ROLE).eq(Role.ADMIN.name), Role.ADMIN.name)
                    .else_(TEAM_MEMBERS.ROLE),
            )
            .execute()
    }

    private fun setRole(teamId: TeamId, userId: UserId, role: Role) {
        dsl.update(TEAM_MEMBERS)
            .set(TEAM_MEMBERS.ROLE, role.name)
            .where(TEAM_MEMBERS.TEAM_ID.eq(teamId.value))
            .and(TEAM_MEMBERS.USER_ID.eq(userId.value))
            .and(TEAM_MEMBERS.ACTIVE.isTrue)
            .execute()
    }

    private companion object {
        val TENANT_OR_PLATFORM_NAME = DSL.coalesce(MEMBER_PROFILES.DISPLAY_NAME, USERS.DISPLAY_NAME)
        val ONBOARDED = DSL.field(TEAM_MEMBERS.ONBOARDED_AT.isNotNull)
    }
}
