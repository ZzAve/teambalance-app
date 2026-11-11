import { useTranslation } from 'react-i18next'
import type { MatchMismatch } from '@shared/api/match-feed'
import { Button } from '@shared/ui/button'
import { MismatchDetails } from './MatchFeedFindings'

interface MatchMismatchNoticeViewProps {
  mismatch: MatchMismatch
  teamName: string
  onApply: () => void
}

/** Tells an admin, on the event page, where this event differs from its match in the Nevobo feed. */
export function MatchMismatchNoticeView({ mismatch, teamName, onApply }: MatchMismatchNoticeViewProps) {
  const { t } = useTranslation()
  return (
    <div role="note" className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-small">
      <p className="font-medium">{t('matchFeed.notice')}</p>
      <MismatchDetails mismatch={mismatch} teamName={teamName} />
      <a href={mismatch.feedMatch.link} target="_blank" rel="noreferrer" className="text-caption text-blue underline">
        {t('matchFeed.openOnNevobo')}
      </a>
      <Button size="sm" variant="outline" className="mt-2 block" onClick={onApply}>
        {t('matchFeed.apply.button')}
      </Button>
    </div>
  )
}
