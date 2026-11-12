import { Link, useRouterState } from '@tanstack/react-router'
import { Calendar, Users, PiggyBank, User, Megaphone, type LucideIcon } from 'lucide-react'
import { useAuthMe } from '@shared/api/auth'
import { ACCOUNT_PATH, teamRoutes, teamSlugFromPath, type TeamRoutes } from '@shared/lib/team-routes'
import { useTranslation } from 'react-i18next'
import { i18n } from '@shared/i18n/i18n'
import { useBulletinVariant, useUnread, PROTOTYPE_ON } from '@widgets/bulletin-prototype/ui/BulletinPrototype'

interface TabConfig {
  // Stable React key, independent of the language (label) and the slug (`to` is `/` for Events, Team and Money until /me loads).
  id: 'events' | 'team' | 'money' | 'profile' | 'board'
  icon: LucideIcon
  label: string
  to: string
  // How to match the current path to this tab. Events is the Team home, so it cannot prefix-match
  // (that would light it on every screen); it owns the home and the screens opened from it (an
  // event's detail, the calendar links). Team owns its nested routes (e.g. .../team/settings).
  isActive: (pathname: string) => boolean
}

// Built from the slug in the URL rather than a store, so switching Team makes every tab follow.
// Only the team-independent routes (/account) carry no slug; there the Active Team stands in.
function tabsFor(routes: TeamRoutes, showMoney: boolean): TabConfig[] {
  const exact = (path: string) => (p: string) => p.replace(/\/$/, '') === path
  const prefix = (path: string) => (p: string) => p === path || p.startsWith(`${path}/`)
  return [
    {
      id: 'events',
      icon: Calendar,
      label: i18n.t('nav.events'),
      to: routes.events,
      isActive: (p) =>
        exact(routes.events)(p) || prefix(`${routes.events}/events`)(p) || prefix(routes.calendar)(p),
    },
    { id: 'team', icon: Users, label: i18n.t('nav.team'), to: routes.team, isActive: prefix(routes.team) },
    ...(showMoney ? [{ id: 'money' as const, icon: PiggyBank, label: i18n.t('nav.money'), to: routes.money, isActive: prefix(routes.money) }] : []),
    // Profile points at the team-independent /account (ADR-0027 §1) — a constant, not a slug-built
    // destination — so it resolves and logout stays reachable on every in-shell screen, teamless
    // and mid-onboarding included.
    { id: 'profile', icon: User, label: i18n.t('nav.profile'), to: ACCOUNT_PATH, isActive: prefix(ACCOUNT_PATH) },
  ]
}

export function BottomNav() {
  useTranslation() // re-render the tab labels on a language change
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const me = useAuthMe().data
  const slug = teamSlugFromPath(pathname) ?? me?.activeTeam?.slug ?? null
  const routes = teamRoutes(slug)
  const allTabs = tabsFor(routes, me?.moneyPoolEnabled !== false)
  // With no Team, or not yet onboarded (parked on get-started), Events, Team and Money would only bounce
  // back to where the caller is, so they get Profile alone: the way to Log out stays (ADR-0027), the dead
  // tabs go (as Money does, ADR-0042).
  const parked = slug === null || pathname.replace(/\/$/, '') === routes.getStarted
  const bulletinVariant = useBulletinVariant()
  const unread = useUnread()
  const boardPath = `/t/${slug}/board`
  const withBoard: TabConfig[] = PROTOTYPE_ON && bulletinVariant === 'C' && slug
    ? [...allTabs.slice(0, 2), { id: 'board', icon: Megaphone, label: 'Board', to: boardPath, isActive: (p: string) => p.startsWith(boardPath) }, ...allTabs.slice(2)]
    : allTabs
  const TABS = parked ? allTabs.filter((tab) => tab.id === 'profile') : withBoard

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg"
      // Fixed to the viewport bottom, so pad past the home-indicator inset (viewport-fit=cover) to
      // keep the tabs tappable above it. Zero on devices without an inset.
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-1">
        {TABS.map(({ id, icon: Icon, label, to, isActive }) => {
          const active = isActive(pathname)
          return (
            <Link
              key={id}
              to={to}
              className={[
                'flex flex-col items-center gap-0.5 px-4 py-2 text-caption transition-colors',
                active ? 'text-blue' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              <span className="relative flex items-center justify-center">
                <span
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-11 rounded-full transition-transform duration-300 bg-blue/10 ${active ? 'scale-100' : 'scale-0'}`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                />
                {id === 'board' && unread && !active && <span className="absolute -right-1.5 -top-1 z-10 h-2.5 w-2.5 rounded-full bg-red ring-2 ring-card" />}
                <Icon size={22} strokeWidth={active ? 2.5 : 1.75} className="relative z-10" />
              </span>
              <span className={active ? 'font-medium' : ''}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
