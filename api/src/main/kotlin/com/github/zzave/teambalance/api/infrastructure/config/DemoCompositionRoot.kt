package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.application.DemoSessionService
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * Composition root for the guest login (ADR-0043). The bean always exists: Spring AOT fixes bean
 * conditions when the image is built, so the switch is a runtime value, not a condition.
 */
@Configuration
class DemoCompositionRoot {

    @Bean
    fun demoSessionService(
        @Value("\${teambalance.demo.enabled:false}") enabled: Boolean,
        authService: AuthService,
    ) = DemoSessionService(enabled, authService)
}
