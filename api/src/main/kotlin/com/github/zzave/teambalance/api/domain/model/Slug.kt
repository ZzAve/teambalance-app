package com.github.zzave.teambalance.api.domain.model

/**
 * A team's URL identity — the address its founder chooses on create-team (#158: validated, not
 * derived) and the string `team_` + slug is built from to name its tenant schema. A `@JvmInline`
 * value class, so it costs nothing at runtime while the type system keeps it apart from the two
 * other strings a team carries: its [TeamName] (prose) and its `schemaName` (the derived tenant
 * identifier the slug is only the *source* of). All three were interchangeable `String`s until now,
 * and a positional swap between them compiled silently — separation is the point of this type.
 *
 * **Deliberately unguarded**, and this one is the clearest case in the rollout. The slug's rules —
 * the `^[a-z0-9]+(-[a-z0-9]+)*$` whitelist and the ≤58-character cap — live in [TeamNaming], and
 * unlike [PositionLabel]'s cap they cannot move onto the type, because the database does not enforce
 * them: `teams.slug` is merely `VARCHAR(100) NOT NULL UNIQUE` (V001), with no CHECK on the format and
 * a length allowance nearly twice the cap. Two live write paths bypass [TeamNaming] entirely and
 * insert slugs as raw SQL — `db/seed/demo_data.sql` and `db/e2e/seed.sql` — so a guard here could
 * reject a row the database happily stores, turning a working `GET /auth/me` into a 500 instead of
 * the 400 the write path already returns. A type guard would also answer with a different failure
 * than the clause it was extracted from: [TeamNaming] raises a *typed* `InvalidSlugException`, which
 * the API maps to 400 `INVALID_SLUG` — a code the client keys on to blame the address field rather
 * than the name.
 *
 * That leaves the injection question, and it is answered where it arises rather than here:
 * `TeamNaming.validate` re-asserts `^team_[a-z0-9_]+$` on the schema name it derives, immediately
 * after deriving it, so the safety of the identifier fed to `CREATE SCHEMA` / `SET search_path` never
 * depended on the slug's type. No schema name is ever derived from a slug read back out of the
 * database — that column is stored, not recomputed.
 *
 * Internal representation only: the wire contract and the column stay plain strings, so conversion
 * happens at the JDBC and Wirespec edges alone.
 */
@JvmInline
value class Slug(val value: String) {
    override fun toString(): String = value
}
