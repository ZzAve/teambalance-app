# ADR-0044: Receipts on expenses, stored in the tenant schema by Bunq payment id

- Status: Accepted
- Date: 2026-11-07
- Amends: [ADR-0042](0042-money-pool-bunq-oauth-connection-held-in-memory.md) (the app keeps one
  thing per payment: its receipt)
- Relates to: [ADR-0038](0038-shirt-numbers-and-two-photos-copied-not-linked.md) (image upload,
  storage and caching are done the same way)

## Context

Members want to see what the team's money was spent on. Bunq shows a counterparty and an amount; the
receipt is a paper slip or a webshop page that one member holds. ADR-0042 keeps no payment data in
the app: payments are read from Bunq and held in memory.

Bunq can store attachments on a payment itself, but that needs write access on the OAuth grant (every
Admin would reconnect) and a Bunq call for every view.

## Decision

- Any member attaches **one image per expense** (an outgoing payment). A new upload replaces it; any
  member removes it. Act-as may do this too: it is the team's own data (ADR-0024).
- The image is stored in a tenant table, `payment_receipts`, keyed by **Bunq's payment id**. The
  payment itself is still not stored.
- An upload is accepted only for an id that is an outgoing payment in the pool as the app reads it now
  (cache included), so members cannot store files under made-up ids.
- The browser shrinks the picture to at most 1600 px on the long side and encodes WebP, or JPEG where it
  cannot (Safari). The server reads the format from the bytes and accepts at most 500 KB.
- The bytes travel outside Wirespec at `/api/team/money-pool/payments/{id}/receipt`, as photos do. The
  contract's `Payment` carries `id` and `receiptVersion`; clients request `?v=<receiptVersion>` and the
  image is cached as immutable.
- Receipts stay when the Bunq Connection is removed or another account is picked. They show again when
  the payment does.

## Consequences

- A receipt for a payment older than the pool's history window stays in the table but is not shown.
- Bunq payment ids are global, so a receipt cannot show up on another account's payment.
- PDFs, several images per expense, and recording who uploaded are left out; each would be a change
  to this table and the dialog.
