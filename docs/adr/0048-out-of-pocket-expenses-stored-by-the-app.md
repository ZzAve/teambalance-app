# ADR-0048: Out-of-pocket expenses: an expense a member paid, stored by the app

- Status: Accepted
- Date: 2026-11-14
- Amends: [ADR-0042](0042-money-pool-bunq-oauth-connection-held-in-memory.md) (the app now stores one kind
  of payment-like record itself), [ADR-0007](0007-money-pool-v1-scope.md) (a first manual entry; a manual
  pool is still not built), [ADR-0046](0046-member-payment-aliases.md) (an expense can now carry a member)
- Relates to: [ADR-0044](0044-receipts-on-expenses-stored-by-bunq-payment-id.md) (receipts),
  [ADR-0005](0005-clean-start-no-data-migration.md) (Bunq is the source of truth for the balance)

## Context

Members sometimes pay for the team with their own money: balls, a drink after the match. The pool's
account never sees that payment, so the app does not show the expense, and the member's money does not
count as their contribution. The usual repair is a transfer from the pool back to the member, which
costs an Admin time and adds two payments.

ADR-0042 keeps no payment in the database: every payment is read from Bunq. An expense that did not go
through Bunq has no other place to be recorded than the app.

## Decision

**A member records an Out-of-pocket Expense: who paid, the amount, the date and what it was for.** The
money pool counts it twice with the same amount: as an expense of the pool and as a contribution of the
member who paid. The two cancel out, so the balance does not change and no money has to move.

- **Stored in the tenant schema**, table `out_of_pocket_expenses`. It is the only payment-like record the
  app stores. Bunq payments are still read from Bunq and held in memory only, and the balance is still
  Bunq's figure.
- **Shown as one row** in the payment list, not as two payments. The contract's `Payment` has
  `outOfPocket: true`, direction `Out`, the description as `name` and the payer as `memberId`. Clients
  add the amount to money spent, to money in and to the member's contributions, and leave it out of the
  balance graph.
- **Who may write.** A member records for themselves; an Admin for any member (the rule of payment
  aliases, ADR-0046). The member who paid and an Admin may delete. There is no edit: delete and record
  again.
- **Only inside the history the pool shows.** The date is not in the future and not before the first day
  the pool's payments cover (season start, or the last 90 days), and the pool must be connected. A
  recorded expense is therefore always visible, and it stops counting when the period no longer covers
  its date, like a Bunq payment.
- **Receipt.** The expense's id shares the id space of Bunq payment ids under the prefix `oop-`, so a
  receipt is stored and served exactly as in ADR-0044. The form asks for a photo of the receipt; saving
  without one needs a second, explicit press. Deleting the expense deletes its receipt.
- The row stays when the member leaves the team; it then shows without a name.

## Consequences

- The app is the only record of these expenses. Nothing checks them against a bank; the pool is built on
  trust, and the receipt is the evidence.
- "Topped up" and the Toppers now include money that never reached the account. The balance and the
  balance graph do not.
- The sum of money in minus money spent is unchanged by an out-of-pocket expense, so the totals still
  agree with the balance.
- A reimbursement (the pool pays the member back through Bunq) is not modelled. A team that reimburses
  must not also record the expense here, or the member's contribution counts without being one.
- The consent text for connecting Bunq says TeamBalance "stores no payment data, only the receipts". That
  stays true for data read from Bunq; an out-of-pocket expense is entered by a member.
