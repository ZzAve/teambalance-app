# ADR-0043: jOOQ replaces Hibernate; the tenant schema is set when a transaction starts

- Status: Accepted
- Date: 2026-11-04
- Relates to: [ADR-0023](0023-active-team-explicit-tenant-resolution.md) (tenant resolution),
  [ADR-0036](0036-jvm-startup-time-tuning-without-native-image.md) (startup time)
- Supersedes: the Hibernate multitenancy setup (`SchemaMultiTenantConnectionProvider`,
  `TenantIdentifierResolver`) described in ADR-0039 and #176

## Context

Persistence was split in two. Tenant tables went through Hibernate/JPA, which set `search_path` per
connection through a multi-tenant connection provider. Platform tables (`public`) went through
`JdbcTemplate`, because the JPA path fails closed when no tenant is resolved (#176 asked to move them
to JPA). Hibernate and a `JdbcTemplate` in one Spring transaction used different physical connections,
so a lock or a write on one did not cover the other (ADR-0039).

Hibernate's bootstrap (`jpaMappingContext`) took about 2.2 s of a 6.7 s cold start (ADR-0036), and the SQL
it generated was hidden behind entity mappings and `@Modifying` queries (#105).

## Decision

- **jOOQ replaces Hibernate/JPA for all persistence**, platform and tenant. The adapters write explicit SQL
  through the DSL. #176 is moot.
- **jOOQ classes are generated at build time from the Flyway migrations.** The `jooqCodegen` Gradle task
  applies the migrations to an empty Postgres and reads the schema back. That Postgres is a Testcontainers
  container, or the one named by `JOOQ_CODEGEN_JDBC_URL` (with `_USER` and `_PASSWORD`) when the build runs
  inside Docker.
- **The tenant schema is set when a transaction begins.** `TenantRoutingTransactionManager` sets the
  connection schema to `TenantContext.routingSchema()` in `doBegin` and puts it back on `public` before the
  connection returns to the pool. With no tenant set, the schema is `__no_tenant__`, which does not exist, so
  tenant tables fail closed while schema-qualified `public` tables still work. `JdbcTemplate` and Spring
  Session join the transaction's connection through the transaction manager. jOOQ uses
  `TenantRoutingDataSource`, which hands out that same connection inside a transaction and routes each
  statement to the tenant schema outside one.
- **A transaction has one connection and one schema**, so platform and tenant writes in the same
  transaction no longer sit on different connections.
- **A connection that cannot be reset is evicted from the pool and the failure is logged.** The
  transaction has already completed, so it is not reported as failed.
- **`spring.datasource.hikari.schema` is `public`**: Hikari resets any connection a caller left on another
  schema when it is returned.

## Consequences

- No ORM conveniences: no dirty checking, lazy loading or derived queries. Each adapter writes the SQL
  for its reads and writes, and maps records to domain objects itself.
- Startup is about 0.5 s shorter (median 2.07 s to 1.57 s on 4 vCPU, both with the AOT cache from #430);
  the Hibernate bootstrap and Spring Data repository scan are gone. jOOQ's `DSLContext` takes about 0.2 s.
- Adapter transaction behaviour is tested with `SqlFaultInjector`, a test-only jOOQ execute listener that
  fails a chosen statement inside the adapter's own `@Transactional` boundary, to show the rollback.
- The generated classes depend on the migrations, so a build needs Docker or a reachable Postgres.

## Links

PRs #439 to #451 (the migration, adapter by adapter), #105 (the issue), #176 (obsolete).
