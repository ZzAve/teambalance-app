// A settings card: rows share the same warm surface, hairline dividers and soft lift as the
// appearance control, so the Account screens read as one grouped list (ADR-0027 §2).
export const CARD = 'overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]'
export const ROW = 'flex items-center gap-3 px-4 py-3 text-small'
// Links / buttons get a hover wash and an inset focus ring so keyboard focus stays visible on a row.
export const ROW_INTERACTIVE =
  `${ROW} w-full text-left transition-colors hover:bg-muted/60 ` +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50'
export const ICON = 'shrink-0 text-muted-foreground'
