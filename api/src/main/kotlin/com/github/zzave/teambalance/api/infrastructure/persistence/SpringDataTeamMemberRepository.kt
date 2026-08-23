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

    // position_id is CAST so a null bind has an explicit type (Postgres cannot infer it otherwise).
    @Modifying
    @Query(
        "UPDATE public.team_members SET position_id = CAST(:positionId AS uuid) " +
            "WHERE team_id = :teamId AND user_id = :userId AND active = true",
        nativeQuery = true,
    )
    fun assignPosition(
        @Param("teamId") teamId: UUID,
        @Param("userId") userId: UUID,
        @Param("positionId") positionId: UUID?,
    ): Int

    @Modifying
    @Query(
        "UPDATE public.team_members SET position_id = NULL WHERE position_id = :positionId",
        nativeQuery = true,
    )
    fun clearPositionAssignments(@Param("positionId") positionId: UUID): Int

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

    @Query("SELECT u.display_name FROM public.users u WHERE u.id = :userId", nativeQuery = true)
    fun findDisplayNameByUserId(userId: UUID): String?

    @Query(
        value = """
            SELECT tm.user_id::text     AS userId,
                   u.display_name       AS displayName,
                   tm.position_id::text AS positionId,
                   tp.label             AS position,
                   tm.role              AS permissionRole,
                   (tm.onboarded_at IS NOT NULL) AS onboarded
            FROM   public.team_members tm
            JOIN   public.users u ON u.id = tm.user_id
            LEFT   JOIN public.team_positions tp ON tp.id = tm.position_id
            WHERE  tm.user_id IN :userIds
            AND    tm.active = true
        """,
        nativeQuery = true,
    )
    fun findMemberSummariesByUserIds(@Param("userIds") userIds: Collection<UUID>): List<MemberSummaryProjection>

    @Query(
        value = """
            SELECT tm.user_id::text     AS userId,
                   u.display_name       AS displayName,
                   tm.position_id::text AS positionId,
                   tp.label             AS position,
                   tm.role              AS permissionRole,
                   (tm.onboarded_at IS NOT NULL) AS onboarded
            FROM   public.team_members tm
            JOIN   public.users u ON u.id = tm.user_id
            LEFT   JOIN public.team_positions tp ON tp.id = tm.position_id
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
