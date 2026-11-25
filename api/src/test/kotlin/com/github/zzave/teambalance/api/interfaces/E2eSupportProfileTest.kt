package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.E2eMagicLinkTokenRecorder
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.infrastructure.email.ConsoleEmailAdapter
import com.github.zzave.teambalance.api.infrastructure.email.RecordingEmailAdapter
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import org.springframework.boot.test.context.runner.ApplicationContextRunner

/** The magic-link token endpoint exists in dev (the login page's dev link) and e2e, never next to prod. */
class E2eSupportProfileTest : FunSpec({

    fun runner(profile: String) = ApplicationContextRunner()
        .withUserConfiguration(
            ConsoleEmailAdapter::class.java,
            RecordingEmailAdapter::class.java,
            E2eMagicLinkTokenRecorder::class.java,
            E2eSupportController::class.java,
        )
        .withPropertyValues("spring.profiles.active=$profile")

    listOf("dev", "e2e", "dev,e2e").forEach { profile ->
        test("'$profile' wires the token endpoint and the recording adapter") {
            runner(profile).run { ctx ->
                ctx.startupFailure.shouldBeNull()
                ctx.getBeansOfType(E2eSupportController::class.java).size shouldBe 1
                ctx.getBean(EmailGateway::class.java).shouldBeInstanceOf<RecordingEmailAdapter>()
            }
        }
    }

    listOf("test", "prod", "dev,prod", "e2e,prod").forEach { profile ->
        test("'$profile' has no token endpoint") {
            runner(profile).run { ctx ->
                ctx.startupFailure.shouldBeNull()
                ctx.getBeansOfType(E2eSupportController::class.java).size shouldBe 0
                ctx.getBeansOfType(E2eMagicLinkTokenRecorder::class.java).size shouldBe 0
            }
        }
    }
})
