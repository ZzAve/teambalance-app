# Ops: Receiving mail at `teams@teambalance.nl` (onboarding contact alias)

The create-team page tells founders **without** a creation code to email
**`teams@teambalance.nl`** (a role-based alias — no personal contact details exposed, see
ADR-0019). This runbook sets up **inbound** mail for that alias and verifies it end-to-end.

> **Why this is a separate system from sending.** Scaleway TEM (`ScalewayTemEmailSender`,
> ADR-0019 §7, `docs/ops/deploy.md`) is **send-only** — transactional API, no mailbox, no IMAP,
> no inbound MX. So `teams@` cannot receive anything today. The zone's **only** MX is a
> **self-pointing stub** — `teambalance.nl. IN MX 10 teambalance.nl.` — which directs mail at the apex
> host, i.e. the **Edge/S3 landing page**, not an SMTP server. Nothing listens on port 25 there, so
> mail to `teams@` is refused/times out and **bounces**. This stub **must be removed** as part of the
> setup (Step 2) — left in place at priority 10 it would collide with the forwarder's MX and some
> senders would keep hitting the dead self-pointer. Receiving needs a *separate* inbound path — MX
> records pointing at a forwarding provider that routes `teams@teambalance.nl` → a monitored private
> inbox. Sending (SPF/DKIM/DMARC for TEM) is untouched by this; the one record they share is SPF —
> see the **merge, don't duplicate** warning below.

**Chosen mechanism: [ImprovMX](https://improvmx.com)** — free email forwarding. DNS **stays on
Scaleway**; we add MX + one SPF include, and the `teams@` → inbox alias is defined in the ImprovMX
dashboard (not in DNS). Nothing to log into day-to-day: mail lands in the owner's existing inbox.

> **Verify the free tier at signup.** Forwarding-provider pricing shifts (ForwardEmail's free
> custom-domain tier was withdrawn, which is why this runbook moved to ImprovMX). Confirm ImprovMX's
> free plan still covers one custom domain before committing; if it too has changed, the shape of this
> runbook (remove stub MX → add provider MX → merge SPF → define alias → test) transfers to any
> forwarder — only the hostnames change.

- **Alias:** `teams@teambalance.nl`
- **Destination:** `<owner-inbox@example.com>` — the platform owner's monitored private inbox.
  Fill this in at setup; it is never exposed to users (the whole point of the role alias).

---

## Prerequisites

- Access to the **`teambalance.nl` DNS zone** (Scaleway console → Domains & DNS, or wherever the
  zone's nameservers are authoritative). You will add/remove records here.
- An **ImprovMX account** (free plan; one domain is enough).
- The destination inbox address.

> **All steps below are console/DNS operations** performed by the platform owner — they cannot be
> done from CI or a code change (there is no DNS-as-code in this repo). This runbook is the
> deliverable; follow it once, then the alias is live.

---

## Step 1 — Add the domain and alias in ImprovMX

1. Sign in at <https://improvmx.com>, **Add Domain** → `teambalance.nl`.
2. Create the alias: **`teams`** → forwards to **`<owner-inbox@example.com>`**. (Use a specific
   alias, **not** the `*` catch-all, so only `teams@` is accepted and nothing else is silently
   forwarded.)
3. ImprovMX will show the exact MX + SPF records to add — treat the values in Step 2 as the current
   defaults and **reconcile against what the dashboard shows** (providers occasionally rename hosts).

## Step 2 — Add DNS records on the Scaleway zone

Add these to `teambalance.nl`. **Do not remove** the existing TEM sending records (DKIM
`*._domainkey`, `_dmarc`); only SPF is shared — see the warning.

**MX — ⚠ first DELETE the stale self-pointing record, then add ImprovMX's:**

The zone currently has exactly one MX: `teambalance.nl. IN MX 10 teambalance.nl.` (a self-pointer at
the Edge/S3 apex — no SMTP there). **Remove it.** If it stays at priority 10 it ties with
`mx1.improvmx.com` and roughly half of senders will try the dead host first. Then add:

| Type | Name / host | Priority | Value |
|------|-------------|----------|-------|
| MX | `@` (root) | 10 | `mx1.improvmx.com.` |
| MX | `@` (root) | 20 | `mx2.improvmx.com.` |

After the change, `dig MX teambalance.nl` should return **only** the two `*.improvmx.com` hosts.

**TXT — SPF (⚠ MERGE, do not add a second SPF record):**

`teambalance.nl` **already has one `v=spf1` record** for Scaleway TEM sending. **Two SPF records is a
permanent SPF `permerror` and would break TEM's outbound authentication.** Edit the *existing* SPF
record and add ImprovMX's include **before** the closing `all`:

```
v=spf1 include:_spf.scaleway-tem.com include:spf.improvmx.com -all
```

- Keep whatever Scaleway include/mechanisms are already there (`include:_spf.scaleway-tem.com` shown
  as a placeholder — use the real one from the current record); just append
  `include:spf.improvmx.com`.
- If the current record ends in `~all`, leave the qualifier as-is; only insert the include.

> There is **no forwarding-rule TXT record** with ImprovMX (unlike ForwardEmail) — the `teams@` → inbox
> mapping lives in the ImprovMX **dashboard** (Step 1), not in DNS.

**Leave untouched:** the TEM **DKIM** selector record(s) (`<selector>._domainkey.teambalance.nl`) and
the **`_dmarc.teambalance.nl`** record. ImprovMX uses SRS when it forwards, so existing DMARC
alignment at the destination is preserved without changes here.

## Step 3 — Verify the domain in ImprovMX

Back on the ImprovMX domain page, wait for the MX + SPF checks to go **green** (DNS propagation is
usually minutes but can take up to a few hours). Green means inbound is wired.

## Step 4 — End-to-end test (this is the issue's acceptance criterion)

1. From an **external** account (e.g. a personal Gmail — *not* the destination inbox, to prove the
   full external → MX → forward → inbox path), send a mail to **`teams@teambalance.nl`** with a
   distinctive subject (e.g. `teams-alias smoke test <today>`).
2. Confirm it **lands in `<owner-inbox@example.com>`** within a few minutes.
3. Check the received headers show it arrived via `mx1/mx2.improvmx.com` and that SPF/DKIM/DMARC on
   the **forwarded** message are not `fail` (ImprovMX's SRS handles this).
4. *(Optional)* Reply-ability: replying **from** `teams@` is a separate concern — ImprovMX offers an
   outbound SMTP send-as add-on, but it is not required by this issue. The founder-contact flow only
   needs inbound to work.

Once the test mail lands, the `mailto:teams@teambalance.nl` line on the create-team page is safe to
consider **"live"** for users (see the issue's non-blocking dependency note).

## Rollback / change the alias

- **Change destination:** edit the `teams` alias's forward address in the ImprovMX dashboard.
- **Different alias name** (e.g. `hello@` instead of `teams@`): rename the alias in ImprovMX *and*
  update the create-team copy (`app/src/routes/create-team/…` / the onboarding-fork PR that adds the
  `mailto:` line) so the address shown matches the one that actually receives.
- **Tear down:** remove the two MX records and drop `include:spf.improvmx.com` back out of the SPF
  record, then delete the domain in ImprovMX. Sending (TEM) is unaffected either way. (If you tear
  down, note the zone is left with **no** MX — that's fine; only re-add the old self-pointing stub if
  something actually depended on it, which nothing did.)

## References

- Issue: **#201** — Set up receiving/forwarding for `teams@teambalance.nl`
- [ADR-0019](../adr/0019-self-service-team-onboarding.md) §7 — TEM notifications (send-only sending path)
- [`docs/ops/deploy.md`](deploy.md) — Scaleway prod topology (TEM, container, Edge/S3)
- [ImprovMX setup docs](https://improvmx.com/guides/) — authoritative for current record values;
  reconcile Step 2 against the dashboard at setup time
