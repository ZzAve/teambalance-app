# ADR-0048: Bulletin board: Markdown posts with an edit audit

- Status: Accepted
- Date: 2026-11-14
- Relates to: [ADR-0016](0016-structured-event-references-over-rich-text.md) (no rich text on events),
  [ADR-0033](0033-substitutes-are-not-members.md) (Substitutes are not Members)

## Context

A Team needs a place for notices that are not Events: a rotation for who takes the balls home, a
municipality rule about the clubhouse closing time, other team news. Today these go to a group chat,
where they scroll away.

ADR-0016 refused rich text in an Event's description because of the cost of a sanitiser and the risk of
missing a case. A notice is different: its whole value is the text, and lists and bold text are the
normal way to write a rotation or a set of rules.

## Decision

**Admins write Posts in Markdown; every Member reads them on the Bulletin Board at the top of the Team
page.** Members cannot reply or react.

- **Markdown, rendered safe by construction.** The SPA renders Posts with `react-markdown` and no
  `rehype-raw`, so the Markdown becomes React elements, never HTML. Raw HTML in a Post shows as text.
  Only a short list of elements is allowed (paragraphs, emphasis, lists, headings, block quotes, code,
  links); images are not. Links open in a new tab with `rel="noopener noreferrer"` and must be http or
  https, like Event References (ADR-0016 §2). The API stores the Markdown as written, with a length
  limit, and needs no sanitiser.
- **This does not reopen ADR-0016.** Event descriptions stay plain text. The renderer is a shared UI
  component, so a later decision to use it elsewhere is a separate decision.
- **Stored in the tenant schema**, tables `bulletin_posts` and `bulletin_post_edits`.
- **Edit audit: who and when, not what.** Each save of an existing Post adds a row with the editor and
  the time, also a save that changes nothing or changes only the pin or the end date. The old text is
  not kept. A Post shows "edited" when it has edits, and the full list behind an info button.
- **Delete is deactivation, and the row goes after 14 days.** An Admin's delete hides the Post at once;
  the row and its edits are removed 14 days later, by a job that runs every 6 hours while the backend
  runs (a backend scaled to zero removes them on its next run, so never sooner). Until then an Admin
  can restore it from the deleted list.
- **Members only.** Substitutes have no account (ADR-0033), so they do not see the board.
- **Pinning.** An Admin can pin a Post; pinned Posts come first and also show in a one-line strip under
  the header on every team page. A Member can close the strip; it stays closed, per team on that
  device, until the pinned Posts change (one pinned, unpinned or edited).
- **Show until.** An Admin can give a Post an end day; Members see it to the end of that day, in the
  time zone of the Admin who set it. After that, Members do not get it from the API. Admins still see
  it, dimmed and last, so they can extend it or delete it. An ended Post is not removed automatically.

## Consequences

- One more admin-only tenant write path, with the same authorisation as Positions.
- The SPA gets `react-markdown` (about 36 KB gzipped), loaded only with the Team page code and when a
  Member opens the pinned strip. The strip is in the app shell, so it loads the renderer lazily; a static
  import would put the parser in the entry bundle of every page.
- The strip is a new element in the app shell; the PWA screenshots change only when the seed data has a
  pinned Post.
- An admin can see who changed a Post but not what changed. If teams need the old text, that is a new
  decision.
