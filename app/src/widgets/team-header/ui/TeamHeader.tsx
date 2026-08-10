import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

interface TeamHeaderProps {
  /** Only admins get the entry into /team/settings; the page itself is read-only for everyone. */
  isAdmin: boolean
}

/**
 * Presentational header for the /team page: the "Team" title plus, for admins only, a gear that
 * links to /team/settings. Prop-only (no store/query access) so both visibility states render from
 * props in Storybook — the container (routes/team/index.tsx) reads the role and passes isAdmin.
 */
export function TeamHeader({ isAdmin }: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-2xl font-bold">Team</h2>
      {isAdmin && (
        <Link
          to="/team/settings"
          aria-label="Team settings"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground"
        >
          <Settings size={20} />
        </Link>
      )}
    </div>
  )
}
