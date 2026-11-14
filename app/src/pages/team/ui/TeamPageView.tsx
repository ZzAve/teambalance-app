import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'

interface TeamPageViewProps {
  /** Only admins get the entry into /team/settings; the page itself is read-only for everyone. */
  isAdmin: boolean
  /** The admin's invite-link action, rendered in the header beside the settings gear. */
  inviteAction?: ReactNode
  /**
   * The member roster — the live container in the route, the prop-only View in a story. Called with
   * the admin actions so the roster can put them on its heading's line; undefined for members.
   */
  roster: (headerActions?: ReactNode) => ReactNode
  /** The Team's Substitutes (ADR-0033), read-only, under the roster: they are not Members. */
  substitutes: ReactNode
  /** The Bulletin Board (ADR-0048), above the roster. */
  bulletin?: ReactNode
}

/**
 * The team page laid out (ADR-0032 §3): the title in the app bar, the Bulletin Board, the roster (for admins with the
 * invite action and the gear into /team/settings on its heading's line), then the Team's Substitutes. Read-only for
 * everyone, admins included — managing both lives under settings.
 */
export function TeamPageView({ isAdmin, inviteAction, roster, substitutes, bulletin }: TeamPageViewProps) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('nav.team')} />
      {bulletin}
      {roster(
        isAdmin ? (
          <>
            {inviteAction}
            <Link
              to={routes.teamSettings}
              aria-label={t('teamPage.settings')}
              // h-11 w-11 (not p-2) keeps the gear a 44px touch target (F7), same as PageHeader's back link.
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-blue/8 hover:text-foreground"
            >
              <Settings size={20} />
            </Link>
          </>
        ) : undefined,
      )}
      {substitutes}
    </div>
  )
}
