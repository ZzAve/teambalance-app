import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import type { Substitute } from '@shared/api/substitutes'
import { SubstituteFace } from '@entities/event/ui/SubstituteFace'
import { useTeamRoutes } from '@shared/lib/team-routes'

interface SubstituteRosterViewProps {
  substitutes?: Substitute[]
  /** The substitutes query is in flight — render the loading shell instead of the faces. */
  isLoading?: boolean
  /** The substitutes query failed — render the error shell instead of the faces. */
  isError?: boolean
}

/**
 * The Team's Substitutes (ADR-0033) under the Roster, in the Roster's design: a face grid, each face
 * opening that Substitute's page. The dashed ring and the "Substitute" line keep them apart from
 * Members. Prop-only: every state renders from props as a story (ADR-0017).
 */
export function SubstituteRosterView({ substitutes = [], isLoading, isError }: SubstituteRosterViewProps) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()

  return (
    <div>
      <h2 className="font-display text-title font-bold">{t('manageSubstitutes.heading')}</h2>

      {isLoading && <p className="mt-4 text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && <p className="mt-4 text-small text-red-ink">{t('manageSubstitutes.loadFailed')}</p>}

      {!isLoading && !isError && (
        substitutes.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border px-3 py-6 text-center text-small text-muted-foreground">
            {t('manageSubstitutes.empty')}
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
            {substitutes.map((substitute) => (
              <li key={substitute.id}>
                <Link
                  to={routes.substitute(substitute.id)}
                  aria-label={t('manageSubstitutes.faceLabel', { name: substitute.name })}
                  className="flex flex-col items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <SubstituteFace name={substitute.name} shirtNumber={substitute.shirtNumber} size="md" />
                  <span className="w-full truncate text-center text-caption font-medium">{substitute.name.split(' ')[0]}</span>
                  <span className="w-full truncate text-center text-caption text-muted-foreground">
                    {t('manageSubstitutes.substitute')}
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
