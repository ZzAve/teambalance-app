import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@shared/ui/button'

interface PageHeaderProps {
  /** Page title, truncated to one line so a long user-authored title can't push the actions out. */
  title: string
  /** Route the back control navigates to. Omit for a page that has no parent to return to. */
  backTo?: string
  /** Accessible name for the back control — say where it goes ("Back to events"), not just "Back". */
  backLabel?: string
  /** Trailing controls (edit/delete, a gear, …), rendered right-aligned. Supplied by the caller. */
  actions?: ReactNode
}

/**
 * The shared sticky sub-header: back control + page title + optional actions, pinned directly
 * beneath the app header.
 *
 * The offset is `top: var(--header-height)` — the same variable that sets the app header's box
 * height in `routes/__root.tsx`. That is the point of this widget: before it, each page hardcoded
 * its own pixel offset (`top-[57px]`) which silently drifted every time the header changed (F12,
 * #159). One variable now drives both sides, so they cannot disagree.
 *
 * Prop-only (no store, no query) so every state renders from props in Storybook; the routes that
 * use it stay thin wiring (ADR-0017).
 */
export function PageHeader({ title, backTo, backLabel = 'Back', actions }: PageHeaderProps) {
  return (
    <div className="sticky top-[var(--header-height)] z-30 -mx-4 mb-2 flex items-center gap-2 border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur-sm">
      {backTo && (
        // asChild so the 44px touch target (F7) is the anchor itself — a real link, not a button
        // nested inside one.
        <Button asChild variant="ghost" size="icon" className="h-11 w-11 shrink-0">
          <Link to={backTo} aria-label={backLabel}>
            <ArrowLeft size={18} />
          </Link>
        </Button>
      )}
      <h2 className="font-display truncate text-base font-semibold">{title}</h2>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
