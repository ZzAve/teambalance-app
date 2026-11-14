package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.BulletinService
import com.github.zzave.teambalance.api.domain.port.BulletinPostRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/** Composition root for the **bulletin board** area (ADR-0018, ADR-0048). */
@Configuration
class BulletinCompositionRoot {

    @Bean
    fun bulletinService(
        bulletinPostRepository: BulletinPostRepository,
        authorizationService: AuthorizationService,
        clock: Clock,
    ) = BulletinService(
        bulletinPostRepository = bulletinPostRepository,
        authorizationService = authorizationService,
        clock = clock,
    )
}
