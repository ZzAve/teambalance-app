package com.github.zzave.teambalance.api.infrastructure.config

import org.springframework.boot.EnvironmentPostProcessor
import org.springframework.boot.SpringApplication
import org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor
import org.springframework.core.Ordered
import org.springframework.core.env.ConfigurableEnvironment
import org.springframework.core.env.MapPropertySource

/**
 * Perf-testing toggle for the Spring `startup` actuator endpoint (the BufferingApplicationStartup
 * per-step boot-timing tree — see TeamBalanceApplication).
 *
 * An actuator endpoint is only reachable if it appears in `management.endpoints.web.exposure.include`,
 * so a plain boolean flag can't switch it on by itself. When `teambalance.startup-actuator.enabled`
 * is true this post-processor appends `startup` to that include list (composing with whatever the
 * active profile already exposes). Default false: `startup` stays out of the prod list and the
 * endpoint 404s. InternalEndpointGuardFilter is the second gate on the same flag — both open together
 * so `/internal/actuator/startup` can be read from the live container during a perf-test window, then
 * both close when the flag is unset. See issue #95.
 *
 * Runs after config data is loaded so it reads the profile-merged include list.
 */
class StartupActuatorExposureEnvironmentPostProcessor : EnvironmentPostProcessor, Ordered {

    override fun postProcessEnvironment(environment: ConfigurableEnvironment, application: SpringApplication) {
        val enabled = environment.getProperty(ENABLED_PROPERTY, Boolean::class.java, false)
        if (!enabled) {
            return
        }
        val exposed = environment.getProperty(INCLUDE_PROPERTY, "")
            .split(",")
            .map { it.trim() }
            .filter { it.isNotEmpty() }
        if (STARTUP_ENDPOINT in exposed || WILDCARD in exposed) {
            return
        }
        val merged = (exposed + STARTUP_ENDPOINT).joinToString(",")
        environment.propertySources.addFirst(
            MapPropertySource(PROPERTY_SOURCE_NAME, mapOf(INCLUDE_PROPERTY to merged)),
        )
    }

    // After ConfigDataEnvironmentPostProcessor so the profile-merged include list is already resolved.
    override fun getOrder(): Int = ConfigDataEnvironmentPostProcessor.ORDER + 1

    private companion object {
        const val ENABLED_PROPERTY = "teambalance.startup-actuator.enabled"
        const val INCLUDE_PROPERTY = "management.endpoints.web.exposure.include"
        const val STARTUP_ENDPOINT = "startup"
        const val WILDCARD = "*"
        const val PROPERTY_SOURCE_NAME = "startupActuatorExposure"
    }
}
