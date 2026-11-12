package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.maps.shouldBeEmpty
import io.micrometer.registry.otlp.OtlpMeterRegistry
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext

/**
 * Without the opt-in, the app makes no OTLP registry: a local run or a container without Cockpit
 * configured does not try to push to Micrometer's default localhost:4318 once a minute.
 */
class OtlpMetricsExportDisabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var context: ApplicationContext

    init {
        test("no OTLP meter registry exists unless the export is switched on") {
            context.getBeansOfType(OtlpMeterRegistry::class.java).shouldBeEmpty()
        }
    }
}
