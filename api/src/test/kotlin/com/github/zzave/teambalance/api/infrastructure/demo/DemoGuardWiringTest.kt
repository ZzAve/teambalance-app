package com.github.zzave.teambalance.api.infrastructure.demo

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.springframework.boot.autoconfigure.AutoConfigurations
import org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer
import org.springframework.boot.test.context.runner.ApplicationContextRunner

/**
 * The demo guard as the Spring context applies it: the real property names, with application.yml loaded, reach
 * [demoBootRefusal]. [DemoGuardTest] covers the decision itself; this proves it is fed the right values.
 */
class DemoGuardWiringTest : FunSpec({

    val safe = arrayOf(
        "teambalance.demo.enabled=true",
        "teambalance.email.send=false",
        "teambalance.bunq.environment=none",
        "spring.datasource.url=jdbc:postgresql://localhost:5432/teambalance",
    )

    fun startupFailureWith(vararg overrides: String): Throwable? {
        var failure: Throwable? = null
        ApplicationContextRunner()
            .withInitializer(ConfigDataApplicationContextInitializer())
            .withConfiguration(AutoConfigurations.of(PropertyPlaceholderAutoConfiguration::class.java))
            .withUserConfiguration(DemoGuard::class.java)
            .withPropertyValues("spring.profiles.active=prod", *safe, *overrides)
            .run { failure = it.startupFailure }
        return failure
    }

    fun Throwable?.mentions(part: String) =
        generateSequence(this) { it.cause }.mapNotNull { it.message }.any { part in it }

    test("a safe environment starts") {
        startupFailureWith() shouldBe null
    }

    test("email sending on refuses to start") {
        startupFailureWith("teambalance.email.send=true").shouldNotBeNull().mentions("email.send") shouldBe true
    }

    test("a Bunq environment other than none refuses to start") {
        startupFailureWith("teambalance.bunq.environment=sandbox").shouldNotBeNull()
            .mentions("bunq.environment") shouldBe true
    }

    test("a remote datasource refuses to start") {
        startupFailureWith("spring.datasource.url=jdbc:postgresql://db.scw.cloud:5432/teambalance").shouldNotBeNull()
            .mentions("datasource") shouldBe true
    }

    test("a host override in the datasource query string refuses to start") {
        startupFailureWith("spring.datasource.url=jdbc:postgresql://localhost/x?PGHOST=prod-db.internal").shouldNotBeNull()
            .mentions("datasource") shouldBe true
    }

    test("a remote Hikari jdbc-url refuses to start") {
        startupFailureWith("spring.datasource.hikari.jdbc-url=jdbc:postgresql://prod-db.internal/x").shouldNotBeNull()
            .mentions("datasource") shouldBe true
    }

    test("a Hikari data source class name refuses to start") {
        startupFailureWith("spring.datasource.hikari.data-source-class-name=org.postgresql.ds.PGSimpleDataSource")
            .shouldNotBeNull().mentions("datasource") shouldBe true
    }

    test("a Hikari data source JNDI name refuses to start") {
        startupFailureWith("spring.datasource.hikari.data-source-j-n-d-i=java:comp/env/jdbc/prod")
            .shouldNotBeNull().mentions("datasource") shouldBe true
    }

    test("a datasource JNDI name refuses to start") {
        startupFailureWith("spring.datasource.jndi-name=java:comp/env/jdbc/prod")
            .shouldNotBeNull().mentions("jndi-name") shouldBe true
    }

    test("switch off starts whatever the rest says") {
        startupFailureWith("teambalance.demo.enabled=false", "teambalance.email.send=true") shouldBe null
    }
})
