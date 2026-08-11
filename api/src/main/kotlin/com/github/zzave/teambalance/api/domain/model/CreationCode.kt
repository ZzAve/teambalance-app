package com.github.zzave.teambalance.api.domain.model

/**
 * A one-time team-creation code (#154, ADR-0019) — the platform-minted secret a prospective founder
 * must present to `POST /api/teams`. The only value in this rollout that is a **credential** rather
 * than a display string, and both decisions below follow from that.
 *
 * [toString] is **masked**, like [InviteToken]'s: a code is a bearer credential, so anyone who reads
 * one in a log line, an exception message or a debugger can create a team with it. [value] is the
 * single deliberate reach-through, used at the JDBC binds and the two Wirespec edges (the admin list,
 * which shows codes to the platform admin who issued them, and the create-team request). Note the
 * masking has teeth the [Slug]/[SchemaName] pass-through `toString` does not: an accidental `"$code"`
 * now renders the mask rather than the secret.
 *
 * **Deliberately unguarded**, and unlike the display strings this is a security argument rather than
 * a cohesion one. There *is* a format — `CreationCodeAdminService` mints three dash-separated groups
 * of four from an unambiguous alphabet — but it is a rule about the *issuer*, not about the type:
 *  - a code arrives verbatim from the founder (`TeamController` trims it and nothing else, on
 *    purpose: "the code format is the issuer's concern"), and is matched **as-is** in SQL by the
 *    redeemability peek and the conditional consume UPDATE — never re-checked against the shape;
 *  - a construction-time guard would answer a malformed code differently from an unknown one, and
 *    [com.github.zzave.teambalance.api.domain.exception.InvalidCreationCodeException] is *opaque by
 *    design* precisely so a caller cannot probe which codes exist or learn their shape. A guard would
 *    hand back exactly that oracle;
 *  - codes are also written as raw SQL by fixtures and by `db/e2e/seed.sql`
 *    (`'E2E-CREATE-TEAM'` — neither the group count nor the group size of a minted code), against a
 *    `VARCHAR(100) NOT NULL UNIQUE` column with no CHECK, so a guard could reject a value the
 *    database happily stores and turn a working admin GET into a 500.
 *
 * Internal representation only: the wire contract and the column stay plain strings, so conversion
 * happens at the JDBC and Wirespec edges alone.
 */
@JvmInline
value class CreationCode(val value: String) {
    override fun toString(): String = "CreationCode(****)"
}
