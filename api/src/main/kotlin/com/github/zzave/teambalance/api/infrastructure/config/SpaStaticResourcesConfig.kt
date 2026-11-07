package com.github.zzave.teambalance.api.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.Resource
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver

/**
 * Serves the SPA's built files from `teambalance.spa.static-location` when it is set (the demo container,
 * ADR-0043; prod keeps the SPA on its own bucket). A path without a file extension that matches no file is
 * a client route and gets `index.html`; a missing asset stays 404. Resource handlers rank below every
 * controller mapping, so the API routes are unaffected. Read at runtime, not as a bean condition, because
 * Spring AOT fixes conditions when the image is built.
 */
@Configuration
class SpaStaticResourcesConfig(
    @param:Value("\${teambalance.spa.static-location:}") private val location: String,
) : WebMvcConfigurer {

    // The resource handler does not take the empty path of "/".
    override fun addViewControllers(registry: ViewControllerRegistry) {
        if (location.isNotBlank()) registry.addViewController("/").setViewName("forward:/index.html")
    }

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        if (location.isBlank()) return
        registry.addResourceHandler("/**")
            .addResourceLocations(location)
            .resourceChain(true)
            .addResolver(SpaFallbackResolver)
    }

    private object SpaFallbackResolver : PathResourceResolver() {
        override fun getResource(resourcePath: String, location: Resource): Resource? =
            super.getResource(resourcePath, location)
                ?: if (isClientRoute(resourcePath)) location.createRelative("index.html") else null

        // An unknown API or internal path stays a 404 for everyone, signed in or not.
        private fun isClientRoute(path: String) =
            '.' !in path.substringAfterLast('/') && path.substringBefore('/') !in setOf("api", "internal")
    }
}
