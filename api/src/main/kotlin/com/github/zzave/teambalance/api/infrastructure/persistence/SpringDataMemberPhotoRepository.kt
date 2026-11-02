package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MemberPhotoJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

// Tenant-routed, like SpringDataMemberProfileRepository.
interface SpringDataMemberPhotoRepository : JpaRepository<MemberPhotoJpaEntity, UUID>
