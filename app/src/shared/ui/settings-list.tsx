import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

// A settings card: rows share the same warm surface, hairline dividers and soft lift as the
// appearance control, so the Account and Team settings screens read as one grouped list (ADR-0027 §2).
export const CARD = 'overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]'
export const ROW = 'flex items-center gap-3 px-4 py-3 text-small'
// Links / buttons get a hover wash and an inset focus ring so keyboard focus stays visible on a row.
export const ROW_INTERACTIVE =
  `${ROW} w-full text-left transition-colors hover:bg-muted/60 ` +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50'
export const ICON = 'shrink-0 text-muted-foreground'

interface NavRowContentProps {
  icon: ReactNode
  title: string
  /** A second line: what the row holds, or its current value. */
  hint?: string
}

/** The inside of a NavRow, for a row that opens a dialog instead of a route. */
export function NavRowContent({ icon, title, hint }: NavRowContentProps) {
  return (
    <>
      <span className={ICON} aria-hidden="true">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{title}</span>
        {hint && <span className="block text-caption text-muted-foreground">{hint}</span>}
      </span>
      <ChevronRight size={16} className="shrink-0 text-muted-foreground/60" aria-hidden="true" />
    </>
  )
}

/** One row of a settings list that opens another screen. */
export function NavRow({ to, ...content }: NavRowContentProps & { to: string }) {
  return (
    <Link to={to} className={ROW_INTERACTIVE}>
      <NavRowContent {...content} />
    </Link>
  )
}
