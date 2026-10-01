import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTeamRoutes } from '@shared/lib/team-routes'

interface TeamPageViewProps {
  /** Only admins get the entry into /team/settings; the page itself is read-only for everyone. */
  isAdmin: boolean
  /** The admin's invite-link action, rendered in the header beside the settings gear. */
  inviteAction?: ReactNode
  /** The member roster — the live container in the route, the prop-only View in a story. */
  roster: ReactNode
}

/**
 * The team page laid out (ADR-0032 §3): the header (title, and for admins the invite action plus
 * the gear into /team/settings) over the roster. Read-only for everyone, admins included — member
 * management lives under settings.
 */
export function TeamPageView({ isAdmin, inviteAction, roster }: TeamPageViewProps) {
  const routes = useTeamRoutes()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-title font-bold">Team</h2>
        {isAdmin && (
          <div className="flex items-center gap-2">
            {inviteAction}
            <Link
              to={routes.teamSettings}
              aria-label="Team settings"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground"
            >
              <Settings size={20} />
            </Link>
          </div>
        )}
      </div>
      {roster}
    </div>
  )
}
