# demo-video — project notes

Quick reference for recording TeamBalance. Pull these at record time instead of rediscovering them.

## Stack the recording needs

```bash
docker compose up -d                                              # postgres + redis
./gradlew :api:wirespec-typescript                                # generated TS client must exist
./gradlew :api:bootRun --args='--spring.profiles.active=dev,e2e'  # NOT `make api` — see below
cd app && npm run dev                                             # 5173, proxies /api -> 8080
```

- **`make run-local` is not enough**: it runs the `dev` profile only. The scripted login needs `e2e`
  too, for `GET localhost:8080/internal/e2e/magic-link-token`. Use `dev,e2e`.
- **Playwright lives in `app/`, not the repo root.** Run the harness and every probe from `app/`
  (ESM resolves from the script's own directory). `check-deps.sh` at the repo root reports
  "playwright not installed" — that's the wrong cwd, not a missing dep.
- Maven Central 429s freely here; every gradle command may need 2–4 retries with backoff.
- `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` can hold a build older than the pinned Playwright
  ("Executable doesn't exist at …chromium_headless_shell-<n>") → `npx playwright install chromium
  chromium-headless-shell`.

## Login (no mailbox needed)

Magic link, three calls, as any demo user — admin is `jan@example.com`, members are `lisa@`, `tom@`,
`emma@`, `daan@`, `sophie@` `example.com`:

```
POST {app}/api/auth/magic-link/request  {email}
GET  {api}/internal/e2e/magic-link-token?email=…     -> {token}     # e2e profile only
POST {app}/api/auth/magic-link/verify   {token}
```

`app/scripts/capture-pwa-screenshots.mjs` is the reference implementation — read it before writing a
new harness; it also seeds events and answers as every member.

## Seeding for a good-looking list

- The `dev` seed has **no events**. Create a few (`POST /api/events`) and answer as each member
  (`PUT /api/events/{id}/attendances/{userId}`) or the overview is empty.
- **The roster disclosure needs targets.** Out of the box every event type has `trackRoster:false`,
  so a card's right-hand slot is the plain headcount and there is no `Show lineup` trigger at all.
  To get one: `POST /api/positions` (Setter/Libero/Middle), then `PUT /api/event-types/{id}` with
  `rosterDefault:{trackRoster:true,totalTarget:8,positionTargets:[…]}` on **Match**.
- **The hero eats the nearest event** — it renders above the list and that event is *not* a list
  card. So the card you want to demo must not be the soonest one; schedule it second.
- Creating events is not idempotent — re-running a seed duplicates them. De-dupe by title, or check
  the count first.

## Framing

- The app is a fixed ~640px centred column at any desktop width, so a 1440-wide take spends 55% of
  the frame on empty margin. **Record at `WIDTH=900 HEIGHT=900`** — the card fills the frame and the
  file is smaller. (Then don't let `to-mp4.sh` pad it back; it defaults to the source canvas now.)
- Accent colours come from `design-tokens/tokens.css`, not from eyeballing: `--color-green #249E6C`
  (= `--color-attending`), `--color-red #D93025`, `--color-gold #F4B400`. The #324 take used
  slightly muted variants (`#2f8f5b` / `#d0342c`) so the annotation outlines sat back from the
  app's own semantic chips instead of competing with them — either is fine, but start from the
  tokens. Display font is Grandstander, body DM Sans; title cards use a system stack, not app fonts.
- The card's answer strip sits ~100px below the card top; at 900x900 with the hero visible the first
  list card lands around y=366 and needs no scrolling.

## Useful selectors (events overview)

| what | locator |
|---|---|
| a list card | `[class*="card-enter"]` |
| the card with both disclosures | `…filter({ has: getByRole('button', { name: /lineup/i }) })` |
| answer trigger | `getByRole('button', { name: /Change your answer/ })` |
| lineup trigger | `getByRole('button', { name: /lineup/i })` — the name flips Show→Hide when open |
| the pill inside a trigger | `trigger.locator('span').first()` |
| the card's bottom strip | `.border-t.border-border\\/40` |

Avoid `getByText("You're in")`: a string arg is a case-insensitive **substring** match, so it also
hits the hero's "4 going · you're in" (verified: 2 matches, 1 with `{exact:true}`). Scope to the
card, or reach the pill through its trigger.
