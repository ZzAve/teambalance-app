// PROTOTYPE ONLY. Variant C "Bottom chrome": no top bar at all. Title and team context are part of the
// scrolling content; all navigation sits in the thumb zone. On a nested page the tab bar is swapped for a
// contextual toolbar (back + page action), as many native apps hide tabs on pushed screens.
import { ArrowLeft, Pencil } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { APP_COLUMN } from '@shared/ui/AppShellFrame'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { TeamSwitcherView } from '@features/switch-team/ui/TeamSwitcherView'
import { EventsBody, EventDetailBody, ProtoBottomNav, NESTED_TITLE, TEAM, TEAMS, type PageContext } from './prototype-parts'

export const name = 'Bottom chrome'

export function VariantBottomChrome({ page, onNavigate }: { page: PageContext; onNavigate: (p: PageContext) => void }) {
  const nested = page === 'nested'
  return (
    <div className="min-h-dvh bg-background">
      {/* Only a safe-area strip, so scrolled content never sits under the notch / status bar. */}
      <div className="sticky top-0 z-40 h-[env(safe-area-inset-top)] bg-background" />
      <main className={`${APP_COLUMN} pt-6 pb-[calc(10rem+env(safe-area-inset-bottom))]`}>
        {nested ? (
          <SectionLabel as="p">Events · Thu 14 Nov</SectionLabel>
        ) : (
          <div className="flex items-center justify-between">
            <img src="/tb-monogram.svg" alt="TeamBalance" className="h-8 w-8 rounded-md" />
            <TeamSwitcherView teams={TEAMS} activeTeam={TEAM} onSelect={() => {}} />
          </div>
        )}
        <h1 className={`mt-2 mb-5 font-display font-bold ${nested ? 'text-title' : 'text-page'}`}>{nested ? NESTED_TITLE : 'Events'}</h1>
        {nested ? <EventDetailBody /> : <EventsBody onOpen={() => onNavigate('nested')} />}
      </main>
      {nested ? (
        <ProtoBottomNav>
          <div className="flex w-full items-center justify-between">
            <Button variant="ghost" className="h-11 gap-2 px-3 text-body" onClick={() => onNavigate('top')}>
              <ArrowLeft size={18} /> Events
            </Button>
            <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Edit event">
              <Pencil size={18} />
            </Button>
          </div>
        </ProtoBottomNav>
      ) : (
        <ProtoBottomNav />
      )}
    </div>
  )
}
