package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.application.DemoResetService
import com.github.zzave.teambalance.api.application.DemoSessionService
import com.github.zzave.teambalance.api.domain.port.DemoResetGateway
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock
import java.time.Duration

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
        demoResetService: DemoResetService,
    ) = DemoSessionService(enabled, authService, demoResetService)

    @Bean
    fun demoResetService(
        gateway: DemoResetGateway,
        clock: Clock,
        @Value("\${teambalance.demo.reset-after:1h}") resetAfter: Duration,
    ) = DemoResetService(gateway, clock, resetAfter)
}
