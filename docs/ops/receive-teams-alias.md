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
> setup (Step 2) — left in place at priority 10 it would collide with ForwardEmail's MX and some
> senders would keep hitting the dead self-pointer. Receiving needs a *separate* inbound path — MX
> records pointing at a forwarding provider that routes `teams@teambalance.nl` → a monitored private
> inbox. Sending
> (SPF/DKIM/DMARC for TEM) is untouched by this; the one record they share is SPF — see the
> **merge, don't duplicate** warning below.

**Chosen mechanism: [ForwardEmail.net](https://forwardemail.net)** — open-source, privacy-first,
free forwarding. DNS **stays on Scaleway**; we add MX + TXT records and one forwarding rule. Nothing
to log into day-to-day: mail lands in the owner's existing inbox.

- **Alias:** `teams@teambalance.nl`
- **Destination:** `<owner-inbox@example.com>` — the platform owner's monitored private inbox.
  Fill this in at setup; it is never exposed to users (the whole point of the role alias).

---

## Prerequisites

- Access to the **`teambalance.nl` DNS zone** (Scaleway console → Domains & DNS, or wherever the
  zone's nameservers are authoritative). You will add records here.
- A **ForwardEmail.net account** (free plan is sufficient for a low-volume role alias).
- The destination inbox address.

> **All steps below are console/DNS operations** performed by the platform owner — they cannot be
> done from CI or a code change (there is no DNS-as-code in this repo). This runbook is the
> deliverable; follow it once, then the alias is live.

---

## Step 1 — Add the domain in ForwardEmail

1. Sign in at <https://forwardemail.net>, **Add Domain** → `teambalance.nl`.
2. On the free plan, choose **DNS-based** forwarding (aliases live in TXT records, below — no
   dashboard alias needed). ForwardEmail's domain page will show the exact records to add; treat the
   values below as the current defaults and **reconcile against what the dashboard shows** (providers
   occasionally rename hostnames).

## Step 2 — Add DNS records on the Scaleway zone

Add these to `teambalance.nl`. **Do not remove** the existing TEM sending records (DKIM
`*._domainkey`, `_dmarc`); only SPF is shared — see the warning.

**MX — ⚠ first DELETE the stale self-pointing record, then add ForwardEmail's:**

The zone currently has exactly one MX: `teambalance.nl. IN MX 10 teambalance.nl.` (a self-pointer at
the Edge/S3 apex — no SMTP there). **Remove it.** If it stays at priority 10 it ties with
`mx1.forwardemail.net` and roughly half of senders will try the dead host first. Then add:

| Type | Name / host | Priority | Value |
|------|-------------|----------|-------|
| MX | `@` (root) | 10 | `mx1.forwardemail.net.` |
| MX | `@` (root) | 20 | `mx2.forwardemail.net.` |

After the change, `dig MX teambalance.nl` should return **only** the two `*.forwardemail.net` hosts.

**TXT — the forwarding rule** (this is what maps the alias; specific alias, not a catch-all, so only
`teams@` is forwarded and nothing else is silently accepted):

| Type | Name / host | Value |
|------|-------------|-------|
| TXT | `@` (root) | `forward-email=teams:<owner-inbox@example.com>` |

**TXT — SPF (⚠ MERGE, do not add a second SPF record):**

`teambalance.nl` **already has one `v=spf1` record** for Scaleway TEM sending. **Two SPF records is a
permanent SPF `permerror` and would break TEM's outbound authentication.** Edit the *existing* SPF
record and add ForwardEmail's include **before** the closing `all`:

```
v=spf1 include:_spf.scaleway-tem.com include:spf.forwardemail.net -all
```

- Keep whatever Scaleway include/mechanisms are already there (`include:_spf.scaleway-tem.com` shown
  as a placeholder — use the real one from the current record); just append
  `include:spf.forwardemail.net`.
- If the current record ends in `~all`, leave the qualifier as-is; only insert the include.

**Leave untouched:** the TEM **DKIM** selector record(s) (`<selector>._domainkey.teambalance.nl`) and
the **`_dmarc.teambalance.nl`** record. ForwardEmail uses SRS + ARC when it forwards, so existing
DMARC alignment at the destination is preserved without changes here.

## Step 3 — Verify the domain in ForwardEmail

Back on the ForwardEmail domain page, click **Verify Records**. DNS propagation is usually minutes but
can take up to a few hours. Green across MX + TXT means inbound is wired.

## Step 4 — End-to-end test (this is the issue's acceptance criterion)

1. From an **external** account (e.g. a personal Gmail — *not* the destination inbox, to prove the
   full external → MX → forward → inbox path), send a mail to **`teams@teambalance.nl`** with a
   distinctive subject (e.g. `teams-alias smoke test <today>`).
2. Confirm it **lands in `<owner-inbox@example.com>`** within a few minutes.
3. Check the received headers show it arrived via `mx1/mx2.forwardemail.net` and that SPF/DKIM/DMARC
   on the **forwarded** message are not `fail` (ForwardEmail's SRS/ARC handle this).
4. *(Optional)* Reply-ability: replying **from** `teams@` is a separate concern — ForwardEmail can
   also **send-as** the alias, but it is not required by this issue. The founder-contact flow only
   needs inbound to work.

Once the test mail lands, the `mailto:teams@teambalance.nl` line on the create-team page is safe to
consider **"live"** for users (see the issue's non-blocking dependency note).

## Rollback / change the alias

- **Change destination:** edit the `forward-email=teams:…` TXT value to the new inbox; re-verify.
- **Different alias name** (e.g. `hello@` instead of `teams@`): change the TXT rule *and* update the
  create-team copy (`app/src/routes/create-team/…` / the onboarding-fork PR that adds the `mailto:`
  line) so the address shown matches the one that actually receives.
- **Tear down:** remove the two MX records and the `forward-email=…` TXT, and drop
  `include:spf.forwardemail.net` back out of the SPF record. Sending (TEM) is unaffected either way.

## References

- Issue: **#201** — Set up receiving/forwarding for `teams@teambalance.nl`
- [ADR-0019](../adr/0019-self-service-team-onboarding.md) §7 — TEM notifications (send-only sending path)
- [`docs/ops/deploy.md`](deploy.md) — Scaleway prod topology (TEM, container, Edge/S3)
- [ForwardEmail free-plan setup](https://forwardemail.net/en/faq) — authoritative for current record
  values; reconcile Step 2 against the dashboard at setup time
