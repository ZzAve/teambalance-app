# ADR-0016: Structured references on events, not rich text in the description

- Status: Accepted
- Date: 2026-07-26

## Context

Teams want to attach links to an event — the Nevobo match page, the digital match
form (DWF) — so match-day info is one tap away. The obvious path is to let the
`description` carry rich text (Markdown or a WYSIWYG editor) so an admin can paste
labelled links inline. That path drags in a heavyweight, permanent cost: an
HTML-sanitiser dependency on the backend (tag/attribute allow-listing, `javascript:`
and `data:` href scrubbing), a CSP conversation, a WYSIWYG dependency on the
frontend, and an open-ended "did we sanitise everything?" liability — all to support
"a couple of links".

## Decision

Model links as **References** (see `CONTEXT.md`): a first-class, structured list on
the Event rather than free text in the description.

1. **Structured, not rich text.** A Reference is `{ title?, url }`. `description`
   stays plain text. Because we only ever store a URL plus a plain-text label, the
   render is always a plain `<a>` with the label as text — there is no HTML-injection
   surface to sanitise.
2. **`http`/`https` only.** URLs are validated on create *and* update; any other
   scheme (`javascript:`, `data:`, `mailto:`, `tel:`, …) is rejected with a 400.
   This single constraint is what makes the rendered anchor safe.
3. **Embedded, admin-only, replace-semantics.** References are a field on
   `CreateEventRequest`/`UpdateEventRequest`, not a sub-resource. They ride the
   existing admin-only event-write gate (no new authorization path, no new seam), and
   an update's array *is* the new full set.
4. **Relational storage.** A child table `event_references` (FK to `events`,
   `ON DELETE CASCADE`, ordered by `position`), mapped as a JPA `@ElementCollection`
   — consistent with the rest of the schema (no `jsonb` anywhere) and with how
   `attendances` already cascades off `events`.

Bounds: `url` ≤ 2048, `title` ≤ 100, ≤ 10 references per event, admin-controlled
order, no dedupe. A blank title renders as the URL host.

## Consequences

- No sanitiser, no WYSIWYG, no CSP change — the injection surface is closed by
  construction rather than defended at runtime.
- Links are machine-usable: the Nevobo RSS import can emit a labelled "Nevobo"
  reference instead of smuggling a URL into the description string.
- Inline links *within* prose are not possible. If that need ever materialises it is
  a deliberate, separate decision — as are `mailto`/`tel` schemes and non-admin adds,
  all explicitly deferred here.
