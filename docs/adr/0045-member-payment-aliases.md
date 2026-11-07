# ADR-0045: Member payment aliases: how a payer is recognised

- Status: Accepted
- Date: 2026-11-07
- Relates to: [ADR-0042](0042-money-pool-bunq-oauth-connection-held-in-memory.md) (payments are held in
  memory only), [ADR-0026](0026-member-team-profile-owned-by-the-tenant.md) (team profile in the tenant),
  [ADR-0038](0038-shirt-numbers-and-two-photos-copied-not-linked.md) (leaving the team deletes team
  profile data), [ADR-0007](0007-money-pool-v1-scope.md) (Hall of Fame deferred), issue #10 slice 6

## Context

The Money Pool shows payments read from Bunq. To say who paid (the per-member contribution graph, later
the Hall of Fame) the app has to match a payment's counterparty to a Member. Bunq gives the counterparty
display name, IBAN and the payment description. The only signal the app controls is the top-up
description, which carries the Member's user id ([`TopUpDescription`](../../api/src/main/kotlin/com/github/zzave/teambalance/api/domain/model/TopUpDescription.kt)).
A Member who pays from their own banking app, or from another account, is recognised only if the app
knows how they appear on Bunq.

ADR-0042 says payments are never written to the database. A payment alias is not a payment, but it is
personal data about a person's bank account. (Receipts, ADR-0044, are the other payment-related data the app
keeps, keyed by Bunq's payment id.)

## Decision

**A Member records Payment Aliases: how they appear on Bunq payments.** An alias is a name, an IBAN or
both; a Member may have several (another account, a partner's name).

- **Stored in the tenant schema**, table `member_payment_aliases`, next to `member_profiles`. Rows are
  keyed by user id without a foreign key to `public.users`, like `member_profiles`. They are per team:
  the Admin's right to set them and the deletion on leaving are per team. A person in two teams records
  their aliases in each.
- **Stored: the alias, not the payments.** Payments, counterparty IBANs and descriptions read from Bunq
  stay in memory (ADR-0042). The IBAN is stored normalised (capitals, no spaces) after the ISO 13616
  mod-97 check; a bad IBAN is a 400. The IBAN is not encrypted at rest: it has to be compared with the
  counterparty IBAN of every payment, and an IBAN is printed on every payment a person sends. The database
  is protected as the rest of the tenant data is.
- **The IBAN is write-only.** No endpoint returns a full IBAN, to anyone, the owner and Admins included.
  Alias responses (list, create, update, claim) carry `ibanMasked` (country and check digits and the last
  four characters, `NL02 •••• •••• ••67 89`, built by `Iban.masked()`) and `hasIban`. An update treats
  name and IBAN alike: an omitted (or null) field keeps the stored value, a value replaces it. An empty
  name removes the name; the IBAN, which cannot be read back, is removed with `clearIban: true`. `iban`
  together with `clearIban: true` is a 400. The result must keep a name or an IBAN (400). To correct an
  IBAN, enter the new one.
- **Visible only to the Member who owns it and to team Admins**, through every endpoint. Another Member
  gets 403, also on the list of someone else's aliases and without a count. The Admin rule is the one
  that already applies to editing another Member's profile (ADR-0013): the treasurer usually recognises
  the names on the statement, and a Member may not know their own IBAN.
- **Unique within the team**: one IBAN, and one name compared without regard to case, belong to at most
  one alias. A clash is 409 `PAYMENT_ALIAS_TAKEN`; the answer does not say whose alias holds the value.
- **Leaving the team deletes the Member's aliases** (same moment as the Shirt Number and Team Photo).
- **Names ignore capitals and white space.** A name is stored trimmed with inner white space collapsed
  to one space, and compared case-insensitively, so "Tom  Bakker" and "tom bakker" are one name, for
  matching and for uniqueness.
- **Attribution** is a pure domain rule, [`PaymentAttribution`](../../api/src/main/kotlin/com/github/zzave/teambalance/api/domain/model/PaymentAttribution.kt).
  It runs on each read of the pool, after the cache, so a saved alias counts at once. **Only incoming
  payments are attributed**; a payment out never gets a member. In order: the description is in the
  top-up format and its user id is a current Member (the id is the one signal the app wrote itself); the
  counterparty IBAN equals an alias IBAN; the counterparty name equals an alias name. No match leaves the
  payment unattributed. The order is the one place in `memberOf` to change.
- **Names in the pool list.** A payment attributed to a Member shows that Member's display name in
  `name` to everyone. `counterpartyName`, the name on the bank statement, is set only for Admins and for
  that Member, so another Member never sees the alias name of someone else. An unattributed payment shows
  the counterparty name to everyone. This is decided per viewer after the cache read.
- **"That's mine" claim.** A payment in the pool list carries Bunq's payment id. A Member can claim an
  unattributed incoming payment for themselves, and an Admin for any Member
  (`POST /api/team/money-pool/payments/{paymentId}/claim`), which stores an alias from that payment's
  counterparty. The request says which parts to store: name, IBAN or both (default both; the Member may
  leave the IBAN out for a shared or family account). The server finds the payment in the (cached) pool
  by its id and reads the IBAN there; the answer is the new alias with the IBAN masked. Nothing about the
  payment is stored. A counterparty name that cannot be an alias name (empty, over 100 characters) is left
  out when both parts are the default, so the IBAN is stored alone; it is a 400 when the name was asked
  for, or is the only part asked for. Refused with 403 for anyone else. 404 for an unknown payment or a
  user who is not a Member. 409 `PAYMENT_NOT_CLAIMABLE` for a payment out or one already attributed. 409
  `MONEY_POOL_NOT_READABLE` when the pool is off, not connected or rejected by Bunq; 503 when Bunq did not
  answer. 400 when the chosen parts are empty or absent from the payment. 409 `PAYMENT_ALIAS_TAKEN` as for
  any alias.
- **What a payment carries.** Each payment has Bunq's payment id and the derived `memberId`. For an
  attributed payment, `name` is the member's display name and `counterpartyName` (the bank-statement
  name) is set only for Admins and the member (see "Names in the pool list"). The counterparty IBAN
  and the description are never in a response (issue #10, user story 4). `Payment`, `PaymentAlias`,
  `PaymentAliasName`, `Iban` and `PaymentDescription` print no value in `toString()`, so they do not
  reach logs. Alias values do not appear in error messages.

## Consequences

- CONTEXT.md no longer says "the app keeps none of [the payments]" without qualification: the app keeps
  no payments, and keeps how to recognise a payer. The glossary has "Payment Alias".
- Name matching is weak. A joint account or a parent may show another name than the Member's, and two
  payers can share a name. Uniqueness within the team prevents two Members claiming one name, not a
  stranger with the same name paying the pool.
- Whoever claims a name first holds it. A Member can claim a payment that is not theirs (for example by
  choosing the wrong one), and then the name belongs to them in the team until an Admin removes or moves
  the alias. This is accepted; the Admin can edit every alias.
- Only the first page of payments (200) is read, so attribution covers those. Pagination is separate.
- A Platform Admin acting as a team (ADR-0024) has the Admin rights here, as everywhere else.
- Adding encryption later is possible behind the repository port; it would need a blind index to keep the
  IBAN comparison and the uniqueness check.

## Considered options

- **A `public.user_payment_aliases` table per person.** Set once, every team benefits. Rejected: an Admin
  of team A would see an IBAN the Member recorded for team B, and the per-team deletion on leaving does
  not fit.
- **Owner-only visibility.** Rejected: the Admin could not help a Member, and could not correct a wrong
  alias that attributes payments to the wrong person.
- **Allow duplicates and attribute ambiguous payments to nobody.** Rejected: silent misses are harder to
  notice than a 409 at the moment of saving.
- **Match on name only.** Rejected: an IBAN is exact, and the description id covers payers who never
  recorded anything.
