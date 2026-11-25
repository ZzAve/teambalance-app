import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import type { Member } from '@shared/api/members'
import { MemberFace } from '@entities/member/ui/MemberFace'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { sortByShirtNumber } from '../lib/roster'

interface MemberRosterViewProps {
  members?: Member[]
  /** The members query is in flight — render the loading shell instead of the roster. */
  isLoading?: boolean
  /** The members query failed — render the error shell instead of the roster. */
  isError?: boolean
}

/**
 * The Team's Roster, heading and all (ADR-0038): round faces with the Shirt Number, ordered by
 * number, each opening that member's page. The same for everyone; an Admin edits a member on their
 * page, not here. Prop-only: the load/error shells render from props as stories (ADR-0017).
 */
export function MemberRosterView({ members = [], isLoading, isError }: MemberRosterViewProps) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()

  return (
    <div>
      <h2 className="font-display text-title font-bold">{t('members.heading')}</h2>

      {isLoading && <p className="mt-4 text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && <p className="mt-4 text-small text-red-ink">{t('members.loadFailed')}</p>}

      {!isLoading && !isError && (
        // A team with no members is the state a memberless team sits in until its first Admin
        // accepts the handover link (ADR-0024 §5).
        members.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border px-3 py-6 text-center text-small text-muted-foreground">
            {t('members.empty')}
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
            {sortByShirtNumber(members).map((member) => (
              <li key={member.userId}>
                <Link
                  to={routes.member(member.userId)}
                  aria-label={member.displayName}
                  className="flex flex-col items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <MemberFace
                    userId={member.userId}
                    name={member.displayName}
                    shirtNumber={member.shirtNumber}
                    photoVersion={member.photoVersion}
                    size="md"
                  />
                  <span className="w-full truncate text-center text-caption font-medium">
                    {member.displayName.split(' ')[0]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
