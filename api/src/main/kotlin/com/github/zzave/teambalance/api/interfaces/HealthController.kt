package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.interfaces.generated.endpoint.HealthCheck
import com.github.zzave.teambalance.api.interfaces.generated.model.HealthStatus
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthController : HealthCheck.Handler {
    override suspend fun healthCheck(request: HealthCheck.Request): HealthCheck.Response<*> =
        HealthCheck.Response200(HealthStatus(status = "UP"))
}
