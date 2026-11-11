import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'
import type { FeedMatch, MatchFeedStatus, MatchMismatch } from '@shared/api/match-feed'
import { formatLocale } from '@shared/i18n/i18n'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { isHome, opponentOf } from '../lib/match-feed'

export const formatMatchTime = (iso: string) =>
  new Date(iso).toLocaleString(formatLocale(), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

interface MatchFeedFindingsProps {
  status: MatchFeedStatus
  onApply: (mismatch: MatchMismatch) => void
  onCreate: (match: FeedMatch) => void
}

/** The events that differ from the feed, and the feed's matches that have no event. */
export function MatchFeedFindings({ status, onApply, onCreate }: MatchFeedFindingsProps) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()

  if (status.mismatches.length === 0 && status.missing.length === 0) {
    return <p className="text-small text-muted-foreground">{t('matchFeed.inSync')}</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {status.mismatches.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-body font-semibold">{t('matchFeed.differs', { count: status.mismatches.length })}</h3>
          <ul className="flex flex-col gap-2">
            {status.mismatches.map((mismatch) => (
              <li key={mismatch.eventId} className="rounded-lg border border-gold/40 bg-gold/10 p-3">
                <Link to={routes.event(mismatch.eventId)} className="text-small font-medium underline">
                  {mismatch.eventTitle}
                </Link>
                <MismatchDetails mismatch={mismatch} teamName={status.teamName} />
                <Button size="sm" variant="outline" className="mt-2" onClick={() => onApply(mismatch)}>
                  {t('matchFeed.apply.button')}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {status.missing.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-body font-semibold">{t('matchFeed.missing', { count: status.missing.length })}</h3>
          <ul className="flex flex-col gap-2">
            {status.missing.map((match) => (
              <li key={match.code} className="rounded-lg bg-card p-3 text-small">
                <MissingMatch match={match} teamName={status.teamName} />
                <Button size="sm" variant="outline" className="mt-2" onClick={() => onCreate(match)}>
                  {t('matchFeed.create.button')}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

/** Each difference as "ours → the feed's". Shared with the notice on the event page. */
export function MismatchDetails({ mismatch, teamName }: { mismatch: MatchMismatch; teamName: string }) {
  const { t } = useTranslation()
  const feed = mismatch.feedMatch
  return (
    <ul className="mt-1 flex flex-col gap-0.5 text-caption">
      {mismatch.differences.map((difference) => (
        <li key={difference}>
          {difference === 'START_TIME' &&
            t('matchFeed.difference.START_TIME', {
              ours: formatMatchTime(mismatch.eventStartTime),
              feed: formatMatchTime(feed.startTime),
            })}
          {difference === 'LOCATION' &&
            t('matchFeed.difference.LOCATION', {
              ours: mismatch.eventLocation ?? t('matchFeed.none'),
              feed: feed.venue ?? '',
            })}
          {difference === 'OPPONENT' && t('matchFeed.difference.OPPONENT', { feed: opponentOf(feed, teamName) })}
        </li>
      ))}
    </ul>
  )
}

function MissingMatch({ match, teamName }: { match: FeedMatch; teamName: string }) {
  const { t } = useTranslation()
  return (
    <>
      <p className="font-medium">
        {t(isHome(match, teamName) ? 'matchFeed.home' : 'matchFeed.away', { opponent: opponentOf(match, teamName) })}
      </p>
      <p className="text-caption text-muted-foreground">
        {formatMatchTime(match.startTime)}
        {match.venue && ` · ${match.venue}`}
      </p>
      <a href={match.link} target="_blank" rel="noreferrer" className="text-caption text-blue underline">
        {t('matchFeed.openOnNevobo')}
      </a>
    </>
  )
}
