package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.interfaces.generated.HealthCheckEndpoint
import com.github.zzave.teambalance.api.interfaces.generated.HealthStatus
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthController : HealthCheckEndpoint.Handler {
    override suspend fun healthCheck(request: HealthCheckEndpoint.Request): HealthCheckEndpoint.Response<*> =
        HealthCheckEndpoint.Response200(HealthStatus(status = "UP"))
}
