// Chromatic modes for the theme axis (ADR-0027 §3).
// Theme is a preview *global* (see preview.ts — the `theme` toolbar + `.dark` decorator), so a
// second-theme baseline belongs in a mode, not a hand-written `*Dark` twin story. A mode re-renders
// a story with a global flipped: same args, same `play`, one extra snapshot with its own baseline.
// Apply these at the meta level on the token-sensitive components (attendance colours, the hero, the
// money surfaces, event-type chits, the bottom nav) so every state inherits both a light and a dark
// picture. This mirrors the exemplar `features/theme-toggle/ThemeToggleView` `Dark` story, which
// opts into the dark layer via `globals: { theme: 'dark' }`.
export const allModes = {
  light: { theme: 'light' },
  dark: { theme: 'dark' },
} as const
