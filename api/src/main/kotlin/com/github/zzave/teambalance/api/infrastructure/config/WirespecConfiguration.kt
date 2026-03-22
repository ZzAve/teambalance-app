package com.github.zzave.teambalance.api.infrastructure.config

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import community.flock.wirespec.integration.spring.kotlin.configuration.WirespecWebMvcConfiguration
import community.flock.wirespec.kotlin.Wirespec
import community.flock.wirespec.kotlin.serde.DefaultParamSerialization
import community.flock.wirespec.kotlin.serde.DefaultPathSerialization
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.core.MethodParameter
import org.springframework.http.MediaType
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice
import kotlin.reflect.KType
import kotlin.reflect.javaType

/**
 * Wirespec Spring configuration bridging wirespec 0.17.x (Jackson 2.x) with Spring Boot 4 (Jackson 3.x).
 *
 * Uses a custom ResponseBodyAdvice that extracts the body from wirespec Response wrappers
 * and lets Spring Boot 4's native Jackson 3.x handle serialization.
 */
@Configuration
@Import(WirespecWebMvcConfiguration::class)
class WirespecConfiguration {

    @Bean
    fun wirespecSerialization(): Wirespec.Serialization {
        val objectMapper = jacksonObjectMapper()
        return object : Wirespec.Serialization {
            private val paramSerialization = DefaultParamSerialization()
            private val pathSerialization = DefaultPathSerialization()

            @OptIn(ExperimentalStdlibApi::class)
            override fun <T> serializeBody(t: T, kType: KType): ByteArray =
                objectMapper.writeValueAsBytes(t)

            @OptIn(ExperimentalStdlibApi::class)
            override fun <T> deserializeBody(raw: ByteArray, kType: KType): T =
                objectMapper.readValue(raw, objectMapper.constructType(kType.javaType))

            override fun <T> serializePath(value: T, kType: KType): String =
                pathSerialization.serializePath(value, kType)

            override fun <T> deserializePath(raw: String, kType: KType): T =
                pathSerialization.deserializePath(raw, kType)

            override fun <T> serializeParam(value: T, kType: KType): List<String> =
                paramSerialization.serializeParam(value, kType)

            override fun <T> deserializeParam(values: List<String>, kType: KType): T =
                paramSerialization.deserializeParam(values, kType)
        }
    }
}

/**
 * Unwraps wirespec Response objects, extracting the body and setting the HTTP status code.
 * Lets Spring Boot 4's Jackson 3.x message converter handle the actual JSON serialization.
 */
@ControllerAdvice
class WirespecResponseUnwrapper : ResponseBodyAdvice<Any> {

    override fun supports(returnType: MethodParameter, converterType: Class<out HttpMessageConverter<*>>): Boolean =
        Wirespec.Response::class.java.isAssignableFrom(returnType.parameterType)

    override fun beforeBodyWrite(
        body: Any?,
        returnType: MethodParameter,
        selectedContentType: MediaType,
        selectedConverterType: Class<out HttpMessageConverter<*>>,
        request: ServerHttpRequest,
        response: ServerHttpResponse,
    ): Any? {
        if (body is Wirespec.Response<*>) {
            response.setStatusCode(org.springframework.http.HttpStatusCode.valueOf(body.status))
            return body.body
        }
        return body
    }
}
