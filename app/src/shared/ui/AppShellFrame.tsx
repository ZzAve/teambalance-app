import { createContext, use, useMemo, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

/**
 * The centred content column every in-shell page renders in. Exported so a story can host a
 * component in the same column the app does, which is what makes a wider viewport show the width
 * the component actually gets (up to the column's cap) rather than an unbounded stretch.
 */
export const APP_COLUMN = 'mx-auto max-w-2xl px-4'

interface PageHeaderSlot {
  /** The header element a page's PageHeader portals its back link, title and actions into. */
  slot: HTMLElement | null
  /** A nested page (one with a back link) hides the monogram and the team chip while it is mounted. */
  setNested: (nested: boolean) => void
}

const PageHeaderSlotContext = createContext<PageHeaderSlot | null>(null)

/** The app header's page slot, or null outside the frame. Read by the PageHeader widget. */
export function usePageHeaderSlot() {
  return use(PageHeaderSlotContext)
}

interface AppShellFrameProps {
  /** Top-right identity slot — the live TeamSwitcher in the app, a prop-only view in a story. */
  teamSwitcher: ReactNode
  /** Sits under the header and outside <main> so it stays put on every screen (ADR-0024 §4). */
  banner?: ReactNode
  /** The fixed tab bar. Omitted on the sign-in routes, where no tab leads anywhere. */
  nav?: ReactNode
  children: ReactNode
}

/**
 * The in-shell page frame: sticky header (the context bar, #505), an optional banner, the centred
 * `max-w-2xl` main column and the fixed bottom nav. The header has a slot the page fills through the
 * PageHeader widget: a top-level page puts its title between the monogram and the team chip; a nested
 * page replaces both with its back link, title and actions. A page without a PageHeader gets the
 * monogram and the team chip only. The root route renders it around the router
 * outlet; the Storybook app-shell decorator renders the same frame around a page composite, so a
 * story's snapshot is the phone's actual screen rather than a floating component (ADR-0032 §3).
 */
export function AppShellFrame({ teamSwitcher, banner, nav, children }: AppShellFrameProps) {
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  const [nested, setNested] = useState(false)
  const pageHeader = useMemo(() => ({ slot, setNested }), [slot])

  return (
    // min-h-dvh (not min-h-screen/100vh) so the layout measures the *visible* viewport on mobile —
    // the dynamic unit accounts for browser chrome and pairs with viewport-fit=cover.
    <div className="min-h-dvh bg-background">
      {/* The tab bar (BottomNav) is the single primary nav — the header carries identity and the
          page's context, no nav links. Horizontal safe-area insets keep it clear of a landscape notch
          now that viewport-fit=cover lets content into the inset region. Its height is fixed to
          --header-height (global.css). Its row has the main column's width at every viewport, as the
          tab bar does, so the back link and the title line up with the page under them. */}
      <header
        className="sticky top-0 z-40 h-[var(--header-height)] border-b border-border/40 bg-card/88 backdrop-blur-lg"
        style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}
      >
        <div className="mx-auto flex h-full max-w-2xl items-center gap-2 px-2">
          {!nested && (
            <Link
              to="/"
              aria-label="TeamBalance"
              className="flex h-11 w-11 shrink-0 items-center justify-center md:w-auto md:px-2"
            >
              {/* From md up the header has room for the full wordmark; below it, the monogram. */}
              <span aria-hidden="true" className="hidden font-display text-title font-bold text-blue md:inline">
                Team<span className="text-green">Balance</span>
              </span>
              {/* public/tb-monogram.svg drawn with theme tokens instead of its literal hexes, so the
                  tile and the letters follow .dark; keep the paths in step with that file. */}
              <svg viewBox="0 0 512 512" aria-hidden="true" className="h-8 w-8 rounded-sm md:hidden">
                <rect width="512" height="512" fill="var(--color-background)" />
                <g transform="translate(2 0)" fill="none" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round">
                  <g stroke="var(--color-blue)">
                    <path d="M133 155H233" />
                    <path d="M183 155V357" />
                  </g>
                  <g stroke="var(--color-green)">
                    <path d="M285 155V357" />
                    <path d="M285 155H322A47.5 47.5 0 0 1 322 250H285" />
                    <path d="M285 250H322A53.5 53.5 0 0 1 322 357H285" />
                  </g>
                </g>
              </svg>
            </Link>
          )}
          <div ref={setSlot} className="flex min-w-0 flex-1 items-center gap-2" />
          {!nested && <div className="shrink-0 pr-2">{teamSwitcher}</div>}
        </div>
      </header>
      {banner}
      {/* Bottom padding clears the fixed nav (~6rem) plus the home-indicator inset, so the last
          row of content is never hidden behind the bar on notched devices. Without a nav only the
          normal py-6 gap and the inset remain. */}
      <main
        className={`${APP_COLUMN} py-6 ${nav ? 'pb-[calc(6rem+env(safe-area-inset-bottom))]' : 'pb-[calc(1.5rem+env(safe-area-inset-bottom))]'}`}
      >
        <PageHeaderSlotContext value={pageHeader}>{children}</PageHeaderSlotContext>
      </main>
      {nav}
    </div>
  )
}
