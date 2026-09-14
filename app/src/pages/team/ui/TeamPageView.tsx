import type { ReactNode } from 'react'
import { TeamHeader } from '@widgets/team-header/ui/TeamHeader'

interface TeamPageViewProps {
  isAdmin: boolean
  /** The admin's invite-link action, rendered in the header beside the settings gear. */
  inviteAction?: ReactNode
  /** The member roster — the live container in the route, the prop-only View in a story. */
  roster: ReactNode
}

/**
 * The team page laid out (ADR-0031 §3): the header (title, and for admins the invite action plus
 * the gear into /team/settings) over the roster. Read-only for everyone, admins included — member
 * management lives under settings.
 */
export function TeamPageView({ isAdmin, inviteAction, roster }: TeamPageViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <TeamHeader isAdmin={isAdmin} actions={inviteAction} />
      {roster}
    </div>
  )
}
