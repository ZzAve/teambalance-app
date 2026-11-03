package com.github.zzave.teambalance.api.codegen

import org.flywaydb.core.Flyway
import org.jooq.codegen.GenerationTool
import org.jooq.meta.jaxb.Configuration
import org.jooq.meta.jaxb.Database as JooqDatabase
import org.jooq.meta.jaxb.Generator
import org.jooq.meta.jaxb.Jdbc
import org.jooq.meta.jaxb.SchemaMappingType
import org.jooq.meta.jaxb.Target
import org.testcontainers.containers.PostgreSQLContainer

private const val TENANT_TEMPLATE_SCHEMA = "tenant_template"
private const val PUBLIC_SCHEMA = "public"
private const val TARGET_PACKAGE = "com.github.zzave.teambalance.api.infrastructure.persistence.jooq"

private const val JDBC_URL_ENV = "JOOQ_CODEGEN_JDBC_URL"
private const val JDBC_USER_ENV = "JOOQ_CODEGEN_JDBC_USER"
private const val JDBC_PASSWORD_ENV = "JOOQ_CODEGEN_JDBC_PASSWORD"

/**
 * Generates the jOOQ classes from the real Flyway migrations: migrates `public` and one tenant schema
 * of an empty Postgres, then reads that schema back. Tenant tables are generated without a schema
 * qualifier so the connection's current schema (set per tenant) decides where they resolve; `public`
 * tables keep their `public.` qualifier.
 *
 * The Postgres comes from `JOOQ_CODEGEN_JDBC_URL` (+ `_USER`, `_PASSWORD`) when set, otherwise from a
 * throwaway Testcontainers container.
 *
 * Arguments: `<migrationsRoot> <outputDirectory>`, where migrationsRoot holds `migration` and
 * `tenant-migration`.
 */
fun main(args: Array<String>) {
    val (migrationsRoot, outputDirectory) = args
    val configuredUrl = System.getenv(JDBC_URL_ENV)
    if (configuredUrl != null) {
        val user = System.getenv(JDBC_USER_ENV).orEmpty()
        val password = System.getenv(JDBC_PASSWORD_ENV).orEmpty()
        generate(configuredUrl, user, password, migrationsRoot, outputDirectory)
    } else {
        PostgreSQLContainer("postgres:17-alpine").use { postgres ->
            postgres.start()
            generate(postgres.jdbcUrl, postgres.username, postgres.password, migrationsRoot, outputDirectory)
        }
    }
}

private fun generate(url: String, user: String, password: String, migrationsRoot: String, outputDirectory: String) {
    migrate(url, user, password, migrationsRoot)
    GenerationTool.generate(configuration(url, user, password, outputDirectory))
}

private fun migrate(url: String, user: String, password: String, migrationsRoot: String) {
    Flyway.configure()
        .dataSource(url, user, password)
        .schemas(PUBLIC_SCHEMA)
        .locations("filesystem:$migrationsRoot/migration")
        .load()
        .migrate()
    Flyway.configure()
        .dataSource(url, user, password)
        .schemas(TENANT_TEMPLATE_SCHEMA)
        .locations("filesystem:$migrationsRoot/tenant-migration")
        .table("flyway_tenant_schema_history")
        .load()
        .migrate()
}

private fun configuration(url: String, user: String, password: String, outputDirectory: String) = Configuration()
    .withJdbc(
        Jdbc().withDriver("org.postgresql.Driver").withUrl(url).withUser(user).withPassword(password),
    )
    .withGenerator(
        Generator()
            .withDatabase(
                JooqDatabase()
                    .withName("org.jooq.meta.postgres.PostgresDatabase")
                    .withExcludes("flyway_.*|spring_session.*")
                    .withSchemata(
                        SchemaMappingType().withInputSchema(PUBLIC_SCHEMA),
                        SchemaMappingType().withInputSchema(TENANT_TEMPLATE_SCHEMA).withOutputSchemaToDefault(true),
                    ),
            )
            .withTarget(Target().withPackageName(TARGET_PACKAGE).withDirectory(outputDirectory).withClean(true)),
    )
