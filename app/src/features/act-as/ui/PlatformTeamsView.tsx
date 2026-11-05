import { useTranslation } from 'react-i18next'
import type { TeamRef } from '@shared/api/act-as'
import { Button } from '@shared/ui/button'

interface PlatformTeamsViewProps {
  teams?: TeamRef[]
  isLoading?: boolean
  isError?: boolean
  /** 403 — the caller is not a Platform Admin; renders a no-access shell rather than an error. */
  isForbidden?: boolean
  isEntering?: boolean
  /** Set when the operator was returned here because the 60-minute box ran out. */
  wasExpired?: boolean
  onEnter: (team: TeamRef) => void
}

/**
 * The platform console's team list (ADR-0024 §6): **every** team, because restricting the list would
 * be theatre — a Platform Admin owns the database. What makes it defensible is that entering is
 * explicit, time-boxed and recorded.
 *
 * Presentational; the query and the enter mutation live in the container, so every state is a
 * no-network story (ADR-0017).
 */
export function PlatformTeamsView({
  teams = [],
  isLoading,
  isError,
  isForbidden,
  isEntering,
  wasExpired,
  onEnter,
}: PlatformTeamsViewProps) {
  const { t } = useTranslation()
  return (
    <div>
      <h2 className="font-display text-title font-bold">{t('actAs.console.heading')}</h2>
      <p className="mt-1 text-small text-muted-foreground">
        {t('actAs.console.intro')}
      </p>

      {wasExpired && (
        <p className="mt-4 text-small text-gold-ink">{t('actAs.console.expired')}</p>
      )}

      {isLoading && <p className="mt-4 text-small text-muted-foreground">{t('account.loading')}</p>}
      {isForbidden && <p className="mt-4 text-small text-muted-foreground">{t('actAs.console.forbidden')}</p>}
      {isError && !isForbidden && <p className="mt-4 text-small text-red-ink">{t('actAs.console.loadFailed')}</p>}

      {!isLoading && !isError && !isForbidden && (
        <div className="mt-4">
          {teams.length === 0 ? (
            <p className="text-small text-muted-foreground">{t('actAs.console.empty')}</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {teams.map((team) => (
                <li key={team.id} className="flex items-center gap-3 p-3">
                  {/* Name over slug rather than beside it: side by side, the slug started wherever
                      the name happened to end, so no two rows lined up. */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-small font-medium">{team.name}</p>
                    <p className="truncate font-mono text-caption text-muted-foreground">/{team.slug}</p>
                  </div>
                  <Button size="sm" disabled={isEntering} onClick={() => onEnter(team)}>
                    {t('actAs.console.enter')}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
