package com.github.zzave.teambalance.api.domain.model

/**
 * The database schema a team's tenant-scoped rows live in — the third and last of the strings a team
 * carries, alongside its [TeamName] (prose) and its [Slug] (the URL address this name is derived from).
 * A `@JvmInline` value class, so it costs nothing at runtime while the type system keeps the three
 * apart: until now they were interchangeable `String`s on the same data class, where a positional swap
 * compiled silently. This is the one of the three that is interpolated into `CREATE SCHEMA` and
 * `SET search_path`, so a swap here would route a request into the wrong tenant.
 *
 * **Deliberately unguarded**, and the reason is particular to this type: it has *two provenances*, and
 * only one of them obeys the `^team_[a-z0-9_]+$` rule.
 *  - **Derived** by [TeamNaming.validate] from an already-validated [Slug]. That rule is asserted
 *    there, immediately after the derivation, as defence in depth for the injection boundary. Its
 *    message names what it guards (`derived schema '…' is not a safe identifier`); it is a statement
 *    about the slug rules two lines above it, not about this type.
 *  - **Read back** from `public.teams.schema_name` — by `JdbcTeamRepositoryAdapter.findAllSchemaNames`
 *    for the startup migration runner, and by the routing lookup behind [TenantRouting]. Those values
 *    need not match the derivation's rule: the column is merely `VARCHAR(100) NOT NULL UNIQUE` (V001)
 *    with no CHECK — and wider than the 63-byte identifier limit the derivation caps at — two live
 *    write paths insert schema names as raw SQL (`db/seed/demo_data.sql`, `db/e2e/seed.sql`), and the
 *    integration suite deliberately routes its shared team at the platform schema `public`, which does
 *    not begin with `team_` at all.
 *
 * So hoisting that `require()` onto the type would make every read-back assert a rule only the
 * derivation obeys, turning a working GET into a 500. Same trap [Slug] and [TeamName] avoided, reached
 * from the other side: here the rule genuinely exists and is genuinely enforced — just not on every
 * value of this type.
 *
 * Internal representation only. The column, the Flyway/DDL calls and the session memo all stay plain
 * strings, so conversion happens at the JDBC/JPA and session edges alone; nothing exposes a schema name
 * on the wire (create-team deliberately omits it from its DTO).
 */
@JvmInline
value class SchemaName(val value: String) {
    override fun toString(): String = value
}
