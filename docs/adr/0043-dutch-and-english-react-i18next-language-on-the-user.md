# ADR-0043: Dutch and English — react-i18next in the SPA, the language stored on the user

- Status: Accepted
- Date: 2026-11-05
- Issue: [#464](https://github.com/ZzAve/teambalance-app/issues/464)
- Relates to: [ADR-0027](0027-logout-reachable-everywhere-account-tab.md) (the Account tab gets the switch),
  [ADR-0028](0028-chromatic-snapshot-budget-turbosnap-full-builds-and-ci-levers.md) /
  [ADR-0032](0032-composite-snapshots-three-stories-per-view-and-a-viewport-axis.md) /
  [ADR-0035](0035-snapshot-policy-disable-behavioral-only-stories-modes-for-theme.md) (snapshot budget),
  [ADR-0041](0041-hero-offers-all-three-answers-in-the-control-words.md) (the attendance words map)

## Context

TeamBalance serves Dutch volleyball teams, and some members do not read Dutch. Today the SPA text is
English, while dates and money are formatted with a hard-coded `'nl-NL'` in about 17 places, so an
English screen shows Dutch weekday and month names. The emails the API sends are Dutch, hard-coded in
`infrastructure/email/`. `www` and the PWA manifest are English. There is no i18n library, no locale
state, and no language column. #464 has the full inventory.

The product owner answered the open questions of #464 on 2026-11-05. This ADR records the answers.

## Decision

### 1. Two languages, nl and en; English is the fallback and the test default

The SPA, the emails, the PWA manifest and `www` speak Dutch and English. A third language must be
content work: a new catalogue file, no code change beyond registering it.

When nothing is chosen and the browser prefers neither nl nor en, the SPA uses **English**. Every
Storybook story, Vitest test and real e2e spec runs in **English** unless it sets Dutch explicitly, so
the existing text queries stay valid.

### 2. react-i18next with bundled catalogues

The SPA uses `i18next` + `react-i18next`. The catalogues are JSON files imported into the bundle
(`shared/i18n`), so there is no runtime fetch and the PWA works offline.

- **English is the source catalogue.** The i18next `CustomTypeOptions` resources type is the English
  catalogue, so `t('a.key.that.does.not.exist')` fails `tsc`.
- **Completeness is a Vitest check.** One unit test asserts the nl and en catalogues have the same
  keys (plural suffixes included). A missing Dutch key fails `make test` and therefore CI.
- **Plurals** use i18next's `_one` / `_other` suffixes, which resolve through `Intl.PluralRules`.
  Composed sentences ("10 going · you're in") are interpolated messages, not string concatenation.
- **Rejected: Lingui.** Compile-time extraction and ICU messages, but its macros need a Babel or SWC
  transform in Vite, Storybook and Vitest. On Vite 8 with `@vitejs/plugin-react` 6, which no longer
  runs Babel by default, that is build wiring in three places.
- **Rejected: typed TS catalogues without a library.** No dependency and a compile-time completeness
  check, but every plural and interpolation helper is ours to keep, and translators edit TypeScript.

### 3. The language lives on the user, with a device fallback

- `public.users` gets a nullable `language` column (`nl` | `en`). Null means "not chosen".
- `/api/auth/me` (and the sign-in response) return it as `language: String?` on `AuthenticatedUser`.
- The Account tab (ADR-0027) gets a Language row. Setting it calls `PUT /api/account/language` and
  stores the value on the user, so it follows the person to every device.
- The SPA resolves the language in this order:
  1. the signed-in user's `language`, when set;
  2. the device value in `localStorage`;
  3. the first of `navigator.languages` that is nl or en;
  4. English.
- When a signed-in user's `language` is set, the SPA copies it to `localStorage`, so the next
  logged-out page on that device (login, invite, verify) already matches.

### 4. Emails: the recipient's language, then the page's

Applies from the email slice on; the tracer does not touch emails.

- **Magic link:** the recipient's stored `language`. If none (a new email, or never chosen), the
  language of the page that sent the request, passed in the request body.
- **Team created** (to the founder): the founder's language, with the same fallback.
- **Creation code consumed** (to the Platform Admin): one fixed language, Dutch as today.

### 5. The Dutch UI words

`CONTEXT.md` gets a per-language UI-words table. The domain names in code, payloads and docs stay
English. The Dutch UI words:

| Domain term | en (UI) | nl (UI) |
|---|---|---|
| Attendance State, control / row / chip | Going / Maybe / Can't / Not responded | Aanwezig / Misschien / Afwezig / Geen reactie |
| Card answer pill | You're in / You said maybe / You're out / Respond | Je bent erbij / Je zei misschien / Je bent er niet bij / Reageer |
| Hero status, mid-sentence | you're in / you said maybe / you're out / you haven't responded | je bent erbij / je zei misschien / je bent er niet bij / je hebt nog niet gereageerd |
| Shirt Number | Shirt number | Rugnummer |
| Substitute | Substitute | Invaller |
| Money Pool | Money pool | Teampot |
| Top-up | Top up / Top-up | Inleggen / Inleg |
| Position | Position | Positie |
| Event | Event | Event |
| Match / Training | Match / Training | Wedstrijd / Training |

### 6. Dates and money follow the language

The formatting locale is `nl-NL` for Dutch and `en-GB` for English ("Thu 5 Nov", 24-hour clock).
Money stays in euro in both, with the locale's separators ("€ 12,50" / "€12.50"). `en-NL` is not used:
it is not a locale browsers ship data for. Technical formatting that is not display (the `en-CA`
`YYYY-MM-DD` trick in `CreateEventSheet.tsx`) stays as it is.

### 7. User content is never translated; seeded defaults use the founder's language

Event titles, team names, Position names, notes and every other value a user typed are shown as
typed. The defaults a new Team is seeded with (today the Event Types Training / Match / Other from
the tenant migration; no Positions are seeded) are created in the founder's language, and after that
they are Team data like any other.

### 8. Chromatic: one Dutch snapshot per page composite

A new `xsNl` Chromatic mode (phone width, Dutch) is added to the `Data` story of each of the five page
composites (Events, Event detail, Team, Money, Account) as that page is extracted. That is 5 extra
baselines when all slices have landed; the tracer adds 1 (Events). No other story gets a Dutch mode.

### 9. www: Dutch at the root, English under /en/

`teambalance.nl/` is Dutch and `teambalance.nl/en/` is English. Both carry `hreflang` links (nl, en,
`x-default` = `/`) and a visible language switch. A small build script renders both pages from one
HTML template and two string files; the deploy uploads both.

### 10. PWA: one Dutch manifest

One manifest with `lang: "nl"`, a Dutch description and Dutch install screenshots. The manifest is
read at install time, before the app knows the user's language, and the main audience is Dutch.

## Slices

1. **Tracer.** Library wired in; `attendance-words.ts` and the events overview with the Next Up hero
   in nl and en; the Language row in Account, stored on the user, returned by `/api/auth/me`; dates on
   that screen follow the language; the key-completeness Vitest check; the `xsNl` mode on the Events
   composite.
2. **Extraction**, one FSD layer at a time (`entities` → `features` → `widgets` → `pages`).
3. **Emails** in both languages; `language` on the magic-link request.
4. **Error codes** mapped to translated messages in the SPA.
5. **www** in nl and en (with #152).
6. **PWA manifest and screenshots** in Dutch.

## Consequences

- Every new user-visible string goes into both catalogues. A missing Dutch key fails CI through the
  completeness test; a typo in a key fails `tsc`.
- Stories and e2e specs keep querying English text. A test that needs Dutch sets it explicitly.
- `CONTEXT.md` keeps the English domain names; the Dutch words on its "avoid" lists (rugnummer,
  invaller) are about naming in code and docs, and are the right words in the Dutch UI column.
- The API learns a user's language. It uses it only to pick an email language; responses stay
  language-free, and errors keep their stable `code` for the SPA to translate.
- The install screenshots become Dutch in slice 6, so they are regenerated in Dutch from then on.
