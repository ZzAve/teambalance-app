import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

interface TeamHeaderProps {
  /** Only admins get the entry into /team/settings; the page itself is read-only for everyone. */
  isAdmin: boolean
  /**
   * Admin-only actions rendered to the left of the settings gear (e.g. the invite-link dialog).
   * Passed in by the container so this stays prop-only/network-free — never rendered for non-admins.
   */
  actions?: ReactNode
}

/**
 * Presentational header for the /team page: the "Team" title plus, for admins only, an actions
 * area (invite link + gear into /team/settings). Prop-only (no store/query access) so both
 * visibility states render from props in Storybook — the container (routes/team/index.tsx) reads
 * the role and supplies isAdmin and the admin actions.
 */
export function TeamHeader({ isAdmin, actions }: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-2xl font-bold">Team</h2>
      {isAdmin && (
        <div className="flex items-center gap-2">
          {actions}
          <Link
            to="/team/settings"
            aria-label="Team settings"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground"
          >
            <Settings size={20} />
          </Link>
        </div>
      )}
    </div>
  )
}
