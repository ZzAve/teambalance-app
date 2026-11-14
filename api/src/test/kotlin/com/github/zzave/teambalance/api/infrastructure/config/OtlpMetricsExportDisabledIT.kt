package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.maps.shouldBeEmpty
import io.micrometer.registry.otlp.OtlpMeterRegistry
import io.opentelemetry.sdk.trace.export.SpanExporter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext

/**
 * Without the opt-in, the app makes no OTLP registry and no span exporter: a local run or a container
 * without Cockpit configured does not try to push metrics or traces to the default localhost:4318.
 */
class OtlpMetricsExportDisabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var context: ApplicationContext

    init {
        test("no OTLP meter registry exists unless the export is switched on") {
            context.getBeansOfType(OtlpMeterRegistry::class.java).shouldBeEmpty()
        }

        test("no span exporter exists unless a traces endpoint is set") {
            context.getBeansOfType(SpanExporter::class.java).shouldBeEmpty()
        }
    }
}
