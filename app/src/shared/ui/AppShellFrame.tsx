import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

/**
 * The centred content column every in-shell page renders in. Exported so a story can host a
 * component in the same column the app does, which is what makes a wider viewport show the width
 * the component actually gets (up to the column's cap) rather than an unbounded stretch.
 */
export const APP_COLUMN = 'mx-auto max-w-2xl px-4'

/**
 * Spread onto a page's root element to opt that page out of the centred phone column from `lg` up
 * (ADR-0033): `<div {...WIDE_COLUMN}>`. The frame reads it with `:has()` rather than taking a prop,
 * because the frame is rendered once by the root route around an `<Outlet/>` and never learns which
 * page is inside it — a prop would have to be threaded back out through the router.
 *
 * It only lifts the cap. What a page does with the extra room is the page's own business, and a
 * page that keeps a single column is still capped at `max-w-2xl` by its own content.
 */
export const WIDE_COLUMN = { 'data-wide-column': '' } as const

interface AppShellFrameProps {
  /** Top-right identity slot — the live TeamSwitcher in the app, a prop-only view in a story. */
  teamSwitcher: ReactNode
  /** Sits under the header and outside <main> so it stays put on every screen (ADR-0024 §4). */
  banner?: ReactNode
  /** The fixed tab bar. */
  nav: ReactNode
  children: ReactNode
}

/**
 * The in-shell page frame: sticky header (wordmark + team identity), an optional banner, the centred
 * `max-w-2xl` main column and the fixed bottom nav. The root route renders it around the router
 * outlet; the Storybook app-shell decorator renders the same frame around a page composite, so a
 * story's snapshot is the phone's actual screen rather than a floating component (ADR-0032 §3).
 */
export function AppShellFrame({ teamSwitcher, banner, nav, children }: AppShellFrameProps) {
  return (
    // min-h-dvh (not min-h-screen/100vh) so the layout measures the *visible* viewport on mobile —
    // the dynamic unit accounts for browser chrome and pairs with viewport-fit=cover.
    <div className="min-h-dvh bg-background">
      {/* The tab bar (BottomNav) is the single primary nav — the header carries only identity
          (wordmark + real team name, top-right), no nav links. Horizontal safe-area insets keep it
          clear of a landscape notch now that viewport-fit=cover lets content into the inset region.
          Its height is fixed to --header-height (global.css) rather than left to fall out of the
          padding: that same variable is what every sticky PageHeader offsets by, so the sub-header
          can no longer drift out of alignment when this header changes (F12, #159). */}
      <header
        className="sticky top-0 z-40 h-[var(--header-height)] border-b border-border/40 bg-card/88 backdrop-blur-lg"
        style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}
      >
        <div className="flex h-full items-center justify-between px-5">
          <Link to="/" className="font-display text-title font-bold text-blue">
            Team<span className="text-green">Balance</span>
          </Link>
          {teamSwitcher}
        </div>
      </header>
      {banner}
      {/* Bottom padding clears the fixed nav (~6rem) plus the home-indicator inset, so the last
          row of content is never hidden behind the bar on notched devices. */}
      {/* `lg:has-[[data-wide-column]]` is the one per-page override (ADR-0033): a page that spreads
          WIDE_COLUMN on its root widens this cap from 42rem to 66rem at `lg`, which is 64rem of
          content beside the 1rem edge padding. Below `lg` every page is the same centred column. */}
      <main
        className={`${APP_COLUMN} py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:has-[[data-wide-column]]:max-w-[66rem]`}
      >
        {children}
      </main>
      {nav}
    </div>
  )
}
