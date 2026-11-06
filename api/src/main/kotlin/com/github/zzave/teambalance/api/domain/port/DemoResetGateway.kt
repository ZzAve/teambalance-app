package com.github.zzave.teambalance.api.domain.port

/**
 * Empties the whole demo database (sessions included) and rebuilds it: schemas, migrations, demo seed (ADR-0043).
 * Refuses to run unless the demo switch is on and the environment passes the demo boot check.
 */
interface DemoResetGateway {
    fun reset()
}
