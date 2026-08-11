package com.github.zzave.teambalance.api.domain.model

/**
 * The name a person is shown under — the one string [User] and [TeamMember] both carry, because a
 * member's name IS their user's name (the member projection reads `u.display_name`). A `@JvmInline`
 * value class, so it costs nothing at runtime while the type system keeps it apart from the other
 * strings a member carries ([PositionLabel], the role).
 *
 * **Deliberately unguarded**, unlike [PositionLabel] and [EventReferenceText] whose caps moved onto
 * the type, for two reasons:
 *
 * 1. The 100-character cap in `MemberService` is one clause of a cohesive normalize-and-validate
 *    step — trim, then non-blank, then the cap, then per-team case-insensitive uniqueness. The
 *    uniqueness clause can never live on a type (it needs the team's roster to answer), and the cap
 *    without the trim that precedes it is a different rule. Splitting one rule set across two homes
 *    would buy less than it costs.
 * 2. There is a *second* write path that has never applied the cap: a first-time magic-link sign-in
 *    derives a placeholder from the email's local part (`AuthService.verifyMagicLink`). A cap on the
 *    type would newly reject there, turning today's database-level failure into a different status
 *    on the auth path — an observable change this refactor must not make.
 *
 * Blank is not guarded either, for [PositionLabel]'s reason: `users.display_name` is merely
 * `NOT NULL` (V001), so the only values a blank `require()` could trip are ones read back from the
 * database, where it would turn a working GET into a 500 instead of the 400 the write path returns.
 *
 * Internal representation only: the wire contract and the column stay plain strings, so conversion
 * happens at the JPA and Wirespec edges alone.
 */
@JvmInline
value class DisplayName(val value: String) {
    override fun toString(): String = value
}
