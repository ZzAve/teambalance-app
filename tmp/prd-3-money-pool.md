## Problem Statement

A team's shared pot lives in a real Bunq account, but members can't see it without bank
access. They want to glance at the balance — ideally in terms they care about, beers — see
who's recently chipped in, and top up without Tikkie-ing each other every week. Today the
new app has none of this; the money pool exists only in the design.

## Solution

A read-only window into the team's Bunq-backed **Money Pool** — live balance, a **Beer
Counter**, and transaction history — plus a **Top-up** flow that opens a `bunq.me` deep
link for preset or custom amounts (mobile-first, no QR). The pool is **optional per team**:
a team without Bunq simply has no pool, and attendance still delivers full value
(ADR-0002, ADR-0007).

## User Stories

1. As a member, I want to see the current pool balance prominently, so that I know the team's financial standing at a glance.
2. As a member, I want the balance translated into an approximate number of beers, so that the pot feels tangible and fun.
3. As an admin, I want to configure the beer price, so that the beer counter reflects our actual canteen price.
4. As a member, I want to browse recent transactions, so that I can see who has topped up and when.
5. As a member, I want to top up with a preset amount (€10 / €20 / €50), so that chipping in is one tap.
6. As a member, I want to top up a custom amount, so that I'm not limited to presets.
7. As a member on my phone, I want top-up to open the team's bunq.me link directly, so that I pay in my banking app without scanning a QR.
8. As a member of a team without Bunq, I want the money-pool section to be hidden, so that the app doesn't show an empty or broken feature.
9. As an admin, I want the beer counter to recompute when I change the beer price, so that it stays accurate.
10. As a member, I want the balance to be reasonably fresh without the app hammering the bank, so that it loads fast and stays reliable.
11. As the owner, I want Bunq credentials and the bunq.me handle configured back-office, so that v1 works for my team without a connection UI.
12. As a member, I want the pool to read live from Bunq as the source of truth, so that the balance is always correct without a separate ledger.

## Implementation Decisions

- **New bounded context: Money Pool** (hexagonal, like events). Domain concepts: pool
  Balance, Transaction, BeerPrice (config).
- **Bunq port (the one new external seam):** an outbound `BunqClient` port
  (`getBalance()`, `listTransactions()`) in the application/domain layer; an infrastructure
  adapter calls the real Bunq API. **Faked in tests.** Bunq credentials + the `bunq.me`
  handle are per-team config in the tenant schema, set back-office in v1.
- **Beer Counter:** `balance ÷ beerPrice`, where `beerPrice` is admin-configurable per team
  (tenant schema), e.g. €2.70.
- **Top-up:** no server-side money movement. The server returns a `bunq.me` deep link for a
  given amount (presets €10/€20/€50 + custom); the client opens it. The handle stays
  server-side so the client never hardcodes it.
- **Optional per team (ADR-0007):** when a team has no Bunq config, the pool endpoint
  returns a `configured: false` state and the frontend hides the Money Pool tab.
- **Endpoints (new Wirespec `money-pool.ws`):**
  - `GET /api/money-pool` → `{ configured, balance, beerCount, beerPrice, transactions[] }`.
  - `GET /api/money-pool/transactions` (paginated) if the list grows.
  - `PUT /api/money-pool/config { beerPrice, ... }` (admin) to set beer price / handle.
  - `GET /api/money-pool/top-up?amount=` → `{ bunqMeUrl }`.
- **Caching:** Bunq reads are cached with a short TTL (Caffeine, already in the stack) so
  the app doesn't hammer Bunq; minute-scale balance freshness is acceptable.
- **Frontend (FSD):** a Money Pool page — balance + Beer Counter as a Grandstander stat, a
  transaction list, and a top-up sheet (presets + custom → open `bunqMeUrl`). The tab is
  hidden when `configured` is false.

## Testing Decisions

- **Good tests assert external behavior** — the JSON the money-pool API returns and the
  `bunq.me` URL produced — not how the Bunq adapter is wired.
- **Seam:** the money-pool REST API over a **fake `BunqClient`** (returns canned balance +
  transactions) plus **Testcontainers Postgres** for per-team config. No real Bunq calls.
- **Cases to cover:**
  - `GET /api/money-pool` returns balance, transactions, and a `beerCount` computed from the
    configured beer price.
  - Changing `beerPrice` (admin) recomputes `beerCount`.
  - A team with no Bunq config returns `configured: false` and no balance.
  - `top-up?amount=` returns the correct `bunq.me` URL for preset and custom amounts.
  - Non-admin cannot change config.
- **Prior art:** existing controller integration tests; the port-faking pattern shared with
  the auth PRD's `EmailSender`.

## Out of Scope

- Hall of Fame (Toppers) / Hall of Shame (Floppers) rankings (deferred — ADR-0007).
- Transaction-exclusion filtering.
- Manual / non-Bunq pools and multi-currency.
- Any in-app payment processing or reconciliation/ledger — `bunq.me` handles payment and
  Bunq is the source of truth (ADR-0005).
- A self-service Bunq connection UI (credentials are back-office in v1).

## Further Notes

- Bunq is the source of truth for the balance (ADR-0005 — clean start, no migrated ledger).
- The money pool is secondary to attendance (ADR-0002): a solid-but-simple v1, polished
  later.
- Depends on the auth PRD for real identity (top-up attribution, admin-gated config).
- Glossary terms: **Money Pool**, **Beer Counter**, **Top-up** (see CONTEXT.md).
