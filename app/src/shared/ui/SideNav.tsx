import { Link } from '@tanstack/react-router'
import { useNavTabs } from './BottomNav'

/** The primary tabs as a vertical list, for the sidebar AppShellFrame shows from `lg` instead of BottomNav. Profile sits at the bottom. */
export function SideNav() {
  const { pathname, tabs } = useNavTabs()

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {tabs.map(({ id, icon: Icon, label, to, isActive }) => {
        const active = isActive(pathname)
        return (
          <Link
            key={id}
            to={to}
            className={[
              'flex items-center gap-3 rounded-lg px-3 py-2 text-body transition-colors',
              id === 'profile' ? 'mt-auto' : '',
              active ? 'bg-blue/10 font-medium text-blue' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ].join(' ')}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
