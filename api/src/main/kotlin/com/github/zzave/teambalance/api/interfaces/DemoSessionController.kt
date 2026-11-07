package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.DemoSessionOutcome
import com.github.zzave.teambalance.api.application.DemoSessionService
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateDemoSession
import org.springframework.web.bind.annotation.RestController

/** Guest login for the demo team (ADR-0043). Answers 404 like an unknown route while the demo switch is off. */
@RestController
class DemoSessionController(private val demoSessionService: DemoSessionService) : CreateDemoSession.Handler {

    override suspend fun createDemoSession(request: CreateDemoSession.Request): CreateDemoSession.Response<*> =
        when (demoSessionService.start(request.body.persona)) {
            DemoSessionOutcome.STARTED -> CreateDemoSession.Response204
            DemoSessionOutcome.UNKNOWN_PERSONA -> CreateDemoSession.Response400
            DemoSessionOutcome.DISABLED -> CreateDemoSession.Response404
        }
}
