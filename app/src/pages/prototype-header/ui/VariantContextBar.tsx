// PROTOTYPE ONLY. Variant A "Context bar" (the user's idea): the top bar says where you are.
// Top-level: monogram + page title + team chip. Nested: back + page title + page action. One bar, no
// separate sticky PageHeader underneath.
import { ArrowLeft, Pencil } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { APP_COLUMN } from '@shared/ui/AppShellFrame'
import { TeamSwitcherView } from '@features/switch-team/ui/TeamSwitcherView'
import { EventsBody, EventDetailBody, ProtoBottomNav, NESTED_TITLE, TEAM, TEAMS, type PageContext } from './prototype-parts'

export const name = 'Context bar'

export function VariantContextBar({ page, onNavigate }: { page: PageContext; onNavigate: (p: PageContext) => void }) {
  const nested = page === 'nested'
  return (
    <div className="min-h-dvh bg-background">
      <header
        className="sticky top-0 z-40 h-[var(--header-height)] border-b border-border/40 bg-card/88 backdrop-blur-lg"
        style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}
      >
        <div className="mx-auto flex h-full max-w-2xl items-center gap-2 px-2">
          {nested ? (
            <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" aria-label="Back to events" onClick={() => onNavigate('top')}>
              <ArrowLeft size={18} />
            </Button>
          ) : (
            <img src="/tb-monogram.svg" alt="TeamBalance" className="ml-2 h-8 w-8 shrink-0 rounded-md" />
          )}
          <h1 className={`min-w-0 flex-1 truncate font-display font-bold ${nested ? 'text-body' : 'pl-1 text-title'}`}>
            {nested ? NESTED_TITLE : 'Events'}
          </h1>
          {nested ? (
            <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" aria-label="Edit event">
              <Pencil size={18} />
            </Button>
          ) : (
            <div className="pr-2">
              <TeamSwitcherView teams={TEAMS} activeTeam={TEAM} onSelect={() => {}} />
            </div>
          )}
        </div>
      </header>
      <main className={`${APP_COLUMN} py-6 pb-[calc(10rem+env(safe-area-inset-bottom))]`}>
        {nested ? <EventDetailBody /> : <EventsBody onOpen={() => onNavigate('nested')} />}
      </main>
      <ProtoBottomNav />
    </div>
  )
}
