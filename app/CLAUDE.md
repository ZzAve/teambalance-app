# TeamBalance SPA

## Translations (ADR-0043)

- Every new user-visible string goes through `t()` from `react-i18next` (also `aria-label`, `alt`, error texts),
  with its key added to both `src/shared/i18n/locales/en.json` and `nl.json`. `npm run lint` rejects
  hard-coded JSX text and `aria-label`/`alt`/`title` literals outside stories and tests.
- English is the source catalogue: a key missing from `en.json` fails `tsc`. A key missing from `nl.json`
  fails `catalogues.test.ts`.
- Use the Dutch UI words from the table in `CONTEXT.md` (e.g. Money Pool = "Teampot", Top-up = "Inleg").
- API error `code`s are mapped to translated messages in the SPA; the API sends no text for the UI.
- Stories and tests run in English unless they set Dutch explicitly.
