import { Link, useRouterState } from '@tanstack/react-router'
import { Calendar, Users, User, type LucideIcon } from 'lucide-react'
import { teamRoutes, teamSlugFromPath, type TeamRoutes } from '@shared/lib/team-routes'

interface TabConfig {
  icon: LucideIcon
  label: string
  to: string
  // How to match the current path to this tab. Events is exact (the Team home would otherwise
  // prefix-match every screen under it); Team also owns its nested routes (e.g. .../team/settings),
  // so it matches by prefix.
  isActive: (pathname: string) => boolean
}

// Built from the slug in the URL rather than a store, so switching Team makes every tab follow.
function tabsFor(routes: TeamRoutes): TabConfig[] {
  const exact = (path: string) => (p: string) => p.replace(/\/$/, '') === path
  const prefix = (path: string) => (p: string) => p === path || p.startsWith(`${path}/`)
  return [
    { icon: Calendar, label: 'Events', to: routes.events, isActive: exact(routes.events) },
    { icon: Users, label: 'Team', to: routes.team, isActive: prefix(routes.team) },
    { icon: User, label: 'Profile', to: routes.profile, isActive: prefix(routes.profile) },
  ]
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const TABS = tabsFor(teamRoutes(teamSlugFromPath(pathname)))

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg"
      // Fixed to the viewport bottom, so pad past the home-indicator inset (viewport-fit=cover) to
      // keep the tabs tappable above it. Zero on devices without an inset.
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-1">
        {TABS.map(({ icon: Icon, label, to, isActive }) => {
          const active = isActive(pathname)
          return (
            <Link
              key={label}
              to={to}
              className={[
                'flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors',
                active ? 'text-blue' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              <span className="relative flex items-center justify-center">
                <span
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-11 rounded-full transition-transform duration-300 bg-blue/10 ${active ? 'scale-100' : 'scale-0'}`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                />
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
