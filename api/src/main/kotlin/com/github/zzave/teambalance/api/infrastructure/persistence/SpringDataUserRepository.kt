package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.UserJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface SpringDataUserRepository : JpaRepository<UserJpaEntity, UUID> {
    fun findByEmail(email: String): UserJpaEntity?

    @Modifying
    @Query("UPDATE public.users SET display_name = :displayName WHERE id = :id", nativeQuery = true)
    fun updateDisplayName(@Param("id") id: UUID, @Param("displayName") displayName: String): Int

    @Query("SELECT u.last_active_team_id FROM public.users u WHERE u.id = :id", nativeQuery = true)
    fun findLastActiveTeamId(@Param("id") id: UUID): UUID?

    @Modifying
    @Query("UPDATE public.users SET last_active_team_id = :teamId WHERE id = :id", nativeQuery = true)
    fun updateLastActiveTeamId(@Param("id") id: UUID, @Param("teamId") teamId: UUID): Int
}
