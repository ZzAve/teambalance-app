package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamMemberJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.OffsetDateTime
import java.util.UUID

// Cohesive data-access surface for team_members; grew past the default 11-function limit with the
// member-management feature. Splitting it would be artificial.
@Suppress("TooManyFunctions")
interface SpringDataTeamMemberRepository : JpaRepository<TeamMemberJpaEntity, UUID> {
    fun findByTeamIdAndUserIdAndActiveTrue(teamId: UUID, userId: UUID): TeamMemberJpaEntity?

    @Modifying
    @Query(
        "UPDATE public.team_members SET role = :role " +
            "WHERE team_id = :teamId AND user_id = :userId AND active = true",
        nativeQuery = true,
    )
    fun updateRole(@Param("teamId") teamId: UUID, @Param("userId") userId: UUID, @Param("role") role: String): Int

    @Modifying
    @Query(
        "UPDATE public.team_members SET onboarded_at = :at " +
            "WHERE team_id = :teamId AND user_id = :userId AND active = true",
        nativeQuery = true,
    )
    fun markOnboarded(
        @Param("teamId") teamId: UUID,
        @Param("userId") userId: UUID,
        @Param("at") at: OffsetDateTime,
    ): Int

    @Modifying
    @Query(
        "UPDATE public.team_members SET active = false WHERE team_id = :teamId AND user_id = :userId",
        nativeQuery = true,
    )
    fun deactivate(@Param("teamId") teamId: UUID, @Param("userId") userId: UUID): Int

    // Re-joining after removal. The role resets to USER: a removed admin walking back in through a
    // shared invite link must not arrive holding their old rights.
    @Modifying
    @Query(
        "UPDATE public.team_members SET active = true, role = 'USER' " +
            "WHERE team_id = :teamId AND user_id = :userId AND active = false",
        nativeQuery = true,
    )
    fun reactivateAsUser(@Param("teamId") teamId: UUID, @Param("userId") userId: UUID): Int

    @Query(
        "SELECT COUNT(*) FROM public.team_members " +
            "WHERE team_id = :teamId AND role = 'ADMIN' AND active = true",
        nativeQuery = true,
    )
    fun countActiveAdmins(@Param("teamId") teamId: UUID): Int

    /**
     * Active members holding this position — what a delete would leave Unassigned (#219).
     *
     * Same shape as the member listing: the platform table drives (it owns membership and the active
     * flag) and the unqualified `member_profiles` joins in from the routed tenant schema, which is
     * where the assignment has lived since ADR-0026. The team id is still needed even though the
     * schema already scopes the profiles — without it, somebody removed from THIS team but active in
     * another would keep their profile row and be counted.
     */
    @Query(
        "SELECT COUNT(*) FROM public.team_members tm " +
            "JOIN member_profiles mp ON mp.user_id = tm.user_id " +
            "WHERE mp.position_id = :positionId AND tm.team_id = :teamId AND tm.active = true",
        nativeQuery = true,
    )
    fun countActiveByPosition(@Param("teamId") teamId: UUID, @Param("positionId") positionId: UUID): Int

    // The tenant's name for this member, falling back to the platform one (ADR-0026). The fallback is
    // not decoration: a member seeded outside the backfill has no profile row yet, and answering NULL
    // would blank a name that exists.
    @Query(
        value = """
            SELECT COALESCE(mp.display_name, u.display_name)
            FROM   public.users u
            LEFT   JOIN member_profiles mp ON mp.user_id = u.id
            WHERE  u.id = :userId
        """,
        nativeQuery = true,
    )
    fun findDisplayNameByUserId(userId: UUID): String?

    @Query(
        value = """
            SELECT tm.user_id::text     AS userId,
                   COALESCE(mp.display_name, u.display_name) AS displayName,
                   mp.position_id::text AS positionId,
                   p.label              AS position,
                   tm.role              AS permissionRole,
                   (tm.onboarded_at IS NOT NULL) AS onboarded
            FROM   public.team_members tm
            JOIN   public.users u ON u.id = tm.user_id
            -- Unqualified on purpose (ADR-0026): these resolve against the routed tenant schema, so
            -- the summary reports the name and position this member carries *in this team* — which
            -- is what multi-team membership (ADR-0023) made a distinction worth drawing.
            LEFT   JOIN member_profiles mp ON mp.user_id = tm.user_id
            LEFT   JOIN positions p ON p.id = mp.position_id
            WHERE  tm.user_id IN :userIds
            AND    tm.active = true
        """,
        nativeQuery = true,
    )
    fun findMemberSummariesByUserIds(@Param("userIds") userIds: Collection<UUID>): List<MemberSummaryProjection>

    @Query(
        value = """
            SELECT tm.user_id::text     AS userId,
                   COALESCE(mp.display_name, u.display_name) AS displayName,
                   mp.position_id::text AS positionId,
                   p.label              AS position,
                   tm.role              AS permissionRole,
                   (tm.onboarded_at IS NOT NULL) AS onboarded
            FROM   public.team_members tm
            JOIN   public.users u ON u.id = tm.user_id
            -- Unqualified on purpose (ADR-0026): these resolve against the routed tenant schema, so
            -- the summary reports the name and position this member carries *in this team* — which
            -- is what multi-team membership (ADR-0023) made a distinction worth drawing.
            LEFT   JOIN member_profiles mp ON mp.user_id = tm.user_id
            LEFT   JOIN positions p ON p.id = mp.position_id
            WHERE  tm.team_id = :teamId
            AND    tm.active = true
        """,
        nativeQuery = true,
    )
    fun findMemberSummariesByTeamId(@Param("teamId") teamId: UUID): List<MemberSummaryProjection>

    // The write schema and the authorized team id come from the same row, so they cannot diverge.
    // The `user_id AND active` predicate IS the membership check.
    @Query(
        value = """
            SELECT tm.team_id     AS teamId,
                   t.schema_name  AS schemaName
            FROM   public.team_members tm
            JOIN   public.teams t ON t.id = tm.team_id
            WHERE  tm.user_id = :userId
            AND    tm.team_id = :teamId
            AND    tm.active = true
        """,
        nativeQuery = true,
    )
    fun findTeamRouting(@Param("teamId") teamId: UUID, @Param("userId") userId: UUID): TeamRoutingProjection?

    // LIMIT 2 is the point: a second row means there is no sole team, and the adapter answers null
    // rather than picking one.
    @Query(
        value = """
            SELECT tm.team_id     AS teamId,
                   t.schema_name  AS schemaName
            FROM   public.team_members tm
            JOIN   public.teams t ON t.id = tm.team_id
            WHERE  tm.user_id = :userId
            AND    tm.active = true
            LIMIT  2
        """,
        nativeQuery = true,
    )
    fun findTeamRoutings(@Param("userId") userId: UUID): List<TeamRoutingProjection>
}

interface MemberSummaryProjection {
    fun getUserId(): String
    fun getDisplayName(): String
    fun getPositionId(): String?
    fun getPosition(): String?
    fun getPermissionRole(): String
    fun getOnboarded(): Boolean
}

interface TeamRoutingProjection {
    val teamId: UUID
    val schemaName: String
}
