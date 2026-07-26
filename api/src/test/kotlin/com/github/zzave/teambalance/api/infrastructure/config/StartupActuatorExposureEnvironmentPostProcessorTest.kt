package com.github.zzave.teambalance.api.infrastructure.config

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import org.springframework.boot.SpringApplication
import org.springframework.mock.env.MockEnvironment

/**
 * Pure unit for the exposure toggle. Proves the single `teambalance.startup-actuator.enabled` flag
 * appends `startup` to the actuator exposure list (composing with the profile's existing include),
 * and is a no-op when off or already exposed — the lowest layer that proves the exposure half of the
 * perf-testing toggle. The prod wiring seam (post-processor actually registered + guard reading the
 * same flag) is covered by StartupActuatorExposureIT.
 */
class StartupActuatorExposureEnvironmentPostProcessorTest : FunSpec({

    val processor = StartupActuatorExposureEnvironmentPostProcessor()
    val application = SpringApplication()

    fun include(environment: MockEnvironment) =
        environment.getProperty("management.endpoints.web.exposure.include")

    test("appends startup to the prod include list when the flag is on") {
        val environment = MockEnvironment()
            .withProperty("teambalance.startup-actuator.enabled", "true")
            .withProperty("management.endpoints.web.exposure.include", "health")

        processor.postProcessEnvironment(environment, application)

        include(environment) shouldBe "health,startup"
    }

    test("leaves the include list untouched when the flag is off") {
        val environment = MockEnvironment()
            .withProperty("teambalance.startup-actuator.enabled", "false")
            .withProperty("management.endpoints.web.exposure.include", "health")

        processor.postProcessEnvironment(environment, application)

        include(environment) shouldBe "health"
    }

    test("defaults to off when the flag is absent") {
        val environment = MockEnvironment()
            .withProperty("management.endpoints.web.exposure.include", "health")

        processor.postProcessEnvironment(environment, application)

        include(environment) shouldBe "health"
    }

    test("does not duplicate startup when it is already exposed (e.g. the dev include)") {
        val environment = MockEnvironment()
            .withProperty("teambalance.startup-actuator.enabled", "true")
            .withProperty("management.endpoints.web.exposure.include", "health,info,metrics,startup")

        processor.postProcessEnvironment(environment, application)

        include(environment) shouldBe "health,info,metrics,startup"
    }

    test("leaves a wildcard include untouched") {
        val environment = MockEnvironment()
            .withProperty("teambalance.startup-actuator.enabled", "true")
            .withProperty("management.endpoints.web.exposure.include", "*")

        processor.postProcessEnvironment(environment, application)

        include(environment) shouldBe "*"
    }
})
