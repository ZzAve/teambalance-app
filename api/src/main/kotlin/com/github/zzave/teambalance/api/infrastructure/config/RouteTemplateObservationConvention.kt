package com.github.zzave.teambalance.api.infrastructure.config

import io.micrometer.common.KeyValue
import org.springframework.http.server.observation.DefaultServerRequestObservationConvention
import org.springframework.http.server.observation.ServerRequestObservationContext
import org.springframework.stereotype.Component

/**
 * Spring's default puts the real request path on each server span as `http.url`. Some paths hold a
 * secret: the calendar-feed token (`/api/calendar/{teamSlug}/{token}.ics`) and the invite token
 * (`/api/invitations/{token}/accept`). The spans are pushed to Cockpit Tempo, so `http.url` is the
 * route template instead, the same value as the `uri` tag.
 */
@Component
class RouteTemplateObservationConvention : DefaultServerRequestObservationConvention() {

    override fun httpUrl(context: ServerRequestObservationContext): KeyValue =
        KeyValue.of(HTTP_URL, context.pathPattern ?: UNKNOWN)

    private companion object {
        const val HTTP_URL = "http.url"
        const val UNKNOWN = "UNKNOWN"
    }
}
