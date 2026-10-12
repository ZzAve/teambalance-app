package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.BunqConnectionJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface SpringDataBunqConnectionRepository : JpaRepository<BunqConnectionJpaEntity, Short>
