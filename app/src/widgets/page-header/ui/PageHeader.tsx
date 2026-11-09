import { useTranslation } from 'react-i18next'
import { useLayoutEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { usePageHeaderSlot } from '@shared/ui/AppShellFrame'

interface PageHeaderProps {
  /** Page title, truncated to one line so a long user-authored title can't push the actions out. Empty renders no title (a page still loading). */
  title: string
  /** Route the back control navigates to. Omit for a top-level (tab) page, which has no parent to return to. */
  backTo?: string
  /** Accessible name for the back control — say where it goes ("Back to events"), not just "Back". */
  backLabel?: string
  /** Trailing controls (edit, a gear, …), rendered right-aligned. Supplied by the caller. */
  actions?: ReactNode
}

/**
 * The page's part of the app header (the context bar, #505). It renders nothing where it is placed:
 * it portals the back control, the title and the actions into AppShellFrame's header slot.
 *
 * Without `backTo` the page is top-level: the title sits between the monogram and the team chip and
 * is the page's `h1`. With `backTo` the page is nested: the monogram and the team chip leave the bar
 * while this is mounted, and the title is an `h2`, because nested pages carry their full, unclipped
 * name as the `h1` in their content.
 *
 * Prop-only (no store, no query) so every state renders from props in Storybook; the routes that use
 * it stay thin wiring (ADR-0017). Outside the frame (no slot) it renders nothing.
 */
export function PageHeader({ title, backTo, backLabel, actions }: PageHeaderProps) {
  const { t } = useTranslation()
  const header = usePageHeaderSlot()
  const nested = backTo !== undefined
  const setNested = header?.setNested

  // Layout effect, so the monogram and the team chip are gone before the first paint of a nested page.
  useLayoutEffect(() => {
    if (!setNested || !nested) return
    setNested(true)
    return () => setNested(false)
  }, [setNested, nested])

  if (!header?.slot) return null

  const Heading = nested ? 'h2' : 'h1'
  return createPortal(
    <>
      {backTo && (
        // asChild so the 44px touch target (F7) is the anchor itself — a real link, not a button
        // nested inside one.
        <Button asChild variant="ghost" size="icon" className="h-11 w-11 shrink-0">
          <Link to={backTo} aria-label={backLabel ?? t('pageHeader.back')}>
            <ArrowLeft size={18} />
          </Link>
        </Button>
      )}
      {title && (
        <Heading
          className={`min-w-0 flex-1 truncate font-display ${nested ? 'text-body font-semibold' : 'pl-1 text-title font-bold'}`}
        >
          {title}
        </Heading>
      )}
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </>,
    header.slot,
  )
}
