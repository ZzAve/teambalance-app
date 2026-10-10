# ADR-0040: The hero offers all three answers, in the control words

- Status: Accepted
- Date: 2026-10-07
- Relates to: [ADR-0002](0002-attendance-is-the-core-pillar.md) (attendance is the core pillar),
  [ADR-0033](0033-substitutes-are-not-members.md) (a Substitute's Maybe means asked)

## Context

The Next Up hero carried two buttons, "I'm in" and "Can't make it", with the first drawn solid as
the invitation. That was deliberate: a binary nudge for the commonest action on the page. It left
the most prominent control in the app unable to say Maybe, and the hero's words were the fifth
set of words for the same four Attendance States (#335): the hero, the detail toggle, the attendee
rows, the lineup clusters and the Substitute surfaces each named them differently, and a Substitute
read "Maybe" in their Position group and "Asked" in the Substitutes block directly beneath it.

## Decision

The hero offers the three answers every other control offers, as three equal buttons that say the
control words from `CONTEXT.md`: Going / Maybe / Can't. With no answer yet, Going is still the solid
one — the invitation — and the status line says the answer in the pill's words, mid-sentence
("10 going · you said maybe").

One exported map (`app/src/entities/event/lib/attendance-words.ts`) holds the words for every
surface role — control / row / chip, card pill, hero status — and every surface reads from it.
Substitutes use the member words; "asked" is what a Substitute's Maybe *means*, said once in the
sheet's explanation line, not a word of its own.

## Considered options

**Keep the two-button hero.** Rejected. The hero is the most used control; a member whose honest
answer is "maybe" should not have to scroll past it to say so.

**Maybe as a quieter text link under the two buttons.** Rejected. It makes one answer second-class
and gives the most used surface a sub-44px target.

**"Asked" as the Substitute word everywhere.** Rejected. It needs a Substitute-aware branch in every
row and chip, and a fifth word in a vocabulary that is meant to have four.
