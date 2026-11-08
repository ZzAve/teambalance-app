// PROTOTYPE ONLY. Variant B "Large title": the page title is a big in-content heading; a compact bar
// fades in with the small title once that heading scrolls away. Top-level has no visible bar at rest
// (team chip sits above the title); nested always shows "< Events" back in the bar, and the full
// (wrapping) title in content.
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { APP_COLUMN } from '@shared/ui/AppShellFrame'
import { TeamSwitcherView } from '@features/switch-team/ui/TeamSwitcherView'
import { EventsBody, EventDetailBody, ProtoBottomNav, NESTED_TITLE, TEAM, TEAMS, type PageContext } from './prototype-parts'

export const name = 'Large title'

export function VariantLargeTitle({ page, onNavigate }: { page: PageContext; onNavigate: (p: PageContext) => void }) {
  const nested = page === 'nested'
  const title = nested ? NESTED_TITLE : 'Events'
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    // rootMargin = the bar's height, so "collapsed" flips exactly when the big title slides under the bar.
    const io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting), { rootMargin: '-52px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [page])

  return (
    <div className="min-h-dvh bg-background">
      <header
        className={`fixed inset-x-0 top-0 z-40 h-[var(--header-height)] transition-colors duration-200 ${
          collapsed ? 'border-b border-border/40 bg-card/88 backdrop-blur-lg' : 'border-b border-transparent bg-background'
        }`}
      >
        <div className="relative mx-auto flex h-full max-w-2xl items-center px-1">
          {nested && (
            <Button variant="ghost" className="h-11 gap-0.5 px-2 text-body text-blue" onClick={() => onNavigate('top')}>
              <ChevronLeft size={22} /> Events
            </Button>
          )}
          <span
            aria-hidden={!collapsed}
            className={`pointer-events-none absolute inset-x-24 truncate text-center text-body font-semibold transition-opacity duration-200 ${
              collapsed ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {title}
          </span>
        </div>
      </header>
      <main className={`${APP_COLUMN} pt-[calc(var(--header-height)+0.5rem)] pb-[calc(10rem+env(safe-area-inset-bottom))]`}>
        {!nested && (
          <div className="flex justify-start">
            <TeamSwitcherView teams={TEAMS} activeTeam={TEAM} onSelect={() => {}} />
          </div>
        )}
        <h1 ref={titleRef} className="mt-2 mb-5 font-display text-page font-bold">
          {title}
        </h1>
        {nested ? <EventDetailBody /> : <EventsBody onOpen={() => onNavigate('nested')} />}
      </main>
      <ProtoBottomNav />
    </div>
  )
}
