package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MagicLinkTokenJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataMagicLinkTokenRepository : JpaRepository<MagicLinkTokenJpaEntity, UUID>
