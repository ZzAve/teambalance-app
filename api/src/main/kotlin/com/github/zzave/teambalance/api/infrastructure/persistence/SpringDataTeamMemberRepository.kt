package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamMemberJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface SpringDataTeamMemberRepository : JpaRepository<TeamMemberJpaEntity, UUID> {
    fun findByTeamIdAndActiveTrue(teamId: UUID): List<TeamMemberJpaEntity>
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
        "UPDATE public.team_members SET active = false WHERE team_id = :teamId AND user_id = :userId",
        nativeQuery = true,
    )
    fun deactivate(@Param("teamId") teamId: UUID, @Param("userId") userId: UUID): Int

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
            SELECT tm.user_id::text AS userId,
                   u.display_name  AS displayName,
                   tm.team_role    AS teamRole,
                   tm.role         AS permissionRole
            FROM   public.team_members tm
            JOIN   public.users u ON u.id = tm.user_id
            WHERE  tm.user_id IN :userIds
            AND    tm.active = true
        """,
        nativeQuery = true,
    )
    fun findMemberSummariesByUserIds(@Param("userIds") userIds: Collection<UUID>): List<MemberSummaryProjection>

    // Resolves the tenant routing (team id + schema) for a user in ONE query, so the request's write
    // schema and its authorized team id come from the same row and cannot diverge. v1 assumes one team
    // per user; the deterministic ORDER BY makes the single picked row stable if that is ever violated.
    @Query(
        value = """
            SELECT tm.team_id     AS teamId,
                   t.schema_name  AS schemaName
            FROM   public.team_members tm
            JOIN   public.teams t ON t.id = tm.team_id
            WHERE  tm.user_id = :userId
            AND    tm.active = true
            ORDER  BY tm.team_id
            LIMIT  1
        """,
        nativeQuery = true,
    )
    fun findTeamRoutingByUserId(@Param("userId") userId: UUID): TeamRoutingProjection?

    // v1 assumes one team per user; the deterministic ORDER BY makes the single picked row stable.
    @Query(
        value = """
            SELECT tm.team_id
            FROM   public.team_members tm
            WHERE  tm.user_id = :userId
            AND    tm.active = true
            ORDER  BY tm.team_id
            LIMIT  1
        """,
        nativeQuery = true,
    )
    fun findTeamIdByUserId(@Param("userId") userId: UUID): UUID?
}

interface MemberSummaryProjection {
    fun getUserId(): String
    fun getDisplayName(): String
    fun getTeamRole(): String?
    fun getPermissionRole(): String
}

interface TeamRoutingProjection {
    val teamId: UUID
    val schemaName: String
}
