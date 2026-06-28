import { Link } from '@tanstack/react-router'
import { Calendar, Wallet, Users } from 'lucide-react'

interface TabConfig {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  to: '/'
  active: boolean
  disabled: boolean
}

const TABS: TabConfig[] = [
  { icon: Calendar, label: 'Events', to: '/', active: true, disabled: false },
  { icon: Wallet, label: 'Money Pool', to: '/', active: false, disabled: true },
  { icon: Users, label: 'Team', to: '/', active: false, disabled: true },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-1">
        {TABS.map(({ icon: Icon, label, to, active, disabled }) => (
          <Link
            key={label}
            to={to}
            className={[
              'flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors',
              disabled
                ? 'pointer-events-none select-none text-muted-foreground/40'
                : active
                  ? 'text-blue'
                  : 'text-muted-foreground hover:text-foreground',
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
        ))}
      </div>
    </nav>
  )
}
