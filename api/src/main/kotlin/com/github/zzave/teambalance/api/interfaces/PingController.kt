package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.interfaces.generated.endpoint.Ping
import org.springframework.web.bind.annotation.RestController

/**
 * The cheapest possible "are you awake?" probe. Unlike [HealthController] it touches nothing —
 * no DB, no [com.github.zzave.teambalance.api.infrastructure.identity.UserContext] — and returns
 * an empty 204. The frontend fires this at page load to kick a scale-to-zero container awake in
 * parallel with the bundle boot, so the container is already warming by the time the session probe
 * runs. Kept separate from /api/health so browser wake traffic doesn't muddy liveness/uptime signal.
 */
@RestController
class PingController : Ping.Handler {
    override suspend fun ping(request: Ping.Request): Ping.Response<*> =
        Ping.Response204(Unit)
}
