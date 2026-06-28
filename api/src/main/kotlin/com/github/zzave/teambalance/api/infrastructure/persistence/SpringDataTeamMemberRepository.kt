package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamMemberJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface SpringDataTeamMemberRepository : JpaRepository<TeamMemberJpaEntity, UUID> {
    fun findByTeamIdAndActiveTrue(teamId: UUID): List<TeamMemberJpaEntity>

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
}

interface MemberSummaryProjection {
    fun getUserId(): String
    fun getDisplayName(): String
    fun getTeamRole(): String?
    fun getPermissionRole(): String
}
