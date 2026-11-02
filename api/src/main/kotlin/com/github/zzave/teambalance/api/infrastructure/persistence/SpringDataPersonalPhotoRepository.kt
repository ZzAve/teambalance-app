package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.PersonalPhotoJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface SpringDataPersonalPhotoRepository : JpaRepository<PersonalPhotoJpaEntity, UUID> {
    // Selects the version column alone so checking for a photo never reads the image bytes.
    @Query("SELECT p.version FROM PersonalPhotoJpaEntity p WHERE p.userId = :userId")
    fun findVersionByUserId(@Param("userId") userId: UUID): String?
}
