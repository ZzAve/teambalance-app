import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeedMatch, MatchFeedErrorCode, MatchFeedStatus, MatchMismatch } from '@shared/api/match-feed'
import { formatLocale } from '@shared/i18n/i18n'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { MatchFeedFindings } from './MatchFeedFindings'

interface MatchFeedViewProps {
  /** The team's feed; null when it has none. */
  status?: MatchFeedStatus | null
  isLoading?: boolean
  isError?: boolean
  /** The team names of the feed the admin entered, once looked up. */
  teams?: string[]
  isFindingTeams?: boolean
  isSaving?: boolean
  isRemoving?: boolean
  /** What went wrong with the last lookup or save. */
  error?: MatchFeedErrorCode | null
  onFindTeams: (feedUrl: string) => void
  onSave: (feedUrl: string, teamName: string) => void
  onRemove: () => void
  onApply: (mismatch: MatchMismatch) => void
  onCreate: (match: FeedMatch) => void
}

/**
 * Presentational match feed settings (ADR-0047): the admin enters a Nevobo poule programme feed, picks the
 * team's name from the names in it, and then sees where the team's events differ from the feed. The queries
 * and mutations live in the MatchFeed container; every state renders from props (ADR-0017).
 */
export function MatchFeedView({
  status,
  isLoading,
  isError,
  teams,
  isFindingTeams,
  isSaving,
  isRemoving,
  error,
  onFindTeams,
  onSave,
  onRemove,
  onApply,
  onCreate,
}: MatchFeedViewProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-title font-bold">{t('matchFeed.title')}</h2>
        <p className="mt-1 text-small text-muted-foreground">{t('matchFeed.intro')}</p>
      </div>

      {isLoading && (
        <p role="status" className="text-small text-muted-foreground">
          {t('account.loading')}
        </p>
      )}
      {isError && (
        <p role="alert" className={ERROR_CLASS}>
          {t('matchFeed.loadFailed')}
        </p>
      )}
      {status === null && !isLoading && !isError && (
        <MatchFeedForm
          teams={teams}
          isFindingTeams={isFindingTeams}
          isSaving={isSaving}
          error={error}
          onFindTeams={onFindTeams}
          onSave={onSave}
        />
      )}
      {status && !isLoading && !isError && (
        <>
          <ConnectedFeed status={status} isRemoving={isRemoving} onRemove={onRemove} />
          <MatchFeedFindings status={status} onApply={onApply} onCreate={onCreate} />
        </>
      )}
    </div>
  )
}

const ERROR_CLASS = 'rounded-lg bg-card p-3 text-small text-red-ink'

function MatchFeedForm({
  teams,
  isFindingTeams,
  isSaving,
  error,
  onFindTeams,
  onSave,
}: Pick<MatchFeedViewProps, 'teams' | 'isFindingTeams' | 'isSaving' | 'error' | 'onFindTeams' | 'onSave'>) {
  const { t } = useTranslation()
  const id = useId()
  const [feedUrl, setFeedUrl] = useState('')
  const [teamName, setTeamName] = useState('')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${id}-url`}>{t('matchFeed.feedUrl')}</Label>
        <Input
          id={`${id}-url`}
          inputMode="url"
          value={feedUrl}
          placeholder="https://api.nevobo.nl/export/poule/…/programma.rss"
          onChange={(e) => {
            setFeedUrl(e.target.value)
            setTeamName('')
          }}
        />
        <p className="text-caption text-muted-foreground">{t('matchFeed.feedUrlHint')}</p>
      </div>
      <Button
        variant="outline"
        className="self-start"
        disabled={!feedUrl.trim() || isFindingTeams}
        onClick={() => onFindTeams(feedUrl.trim())}
      >
        {isFindingTeams ? t('matchFeed.findingTeams') : t('matchFeed.findTeams')}
      </Button>

      {teams && teams.length > 0 && (
        <div className="flex flex-col gap-1">
          <Label htmlFor={`${id}-team`}>{t('matchFeed.team')}</Label>
          <Select value={teamName} onValueChange={setTeamName}>
            <SelectTrigger id={`${id}-team`}>
              <SelectValue placeholder={t('matchFeed.pickTeam')} />
            </SelectTrigger>
            <SelectContent>
              {teams.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div aria-live="polite" aria-atomic="true">
        {error && <p className={ERROR_CLASS}>{t(`matchFeed.error.${error}`)}</p>}
      </div>

      {teams && teams.length > 0 && (
        <Button className="self-start" disabled={!teamName || isSaving} onClick={() => onSave(feedUrl.trim(), teamName)}>
          {isSaving ? t('matchFeed.saving') : t('matchFeed.save')}
        </Button>
      )}
    </div>
  )
}

function ConnectedFeed({
  status,
  isRemoving,
  onRemove,
}: { status: MatchFeedStatus } & Pick<MatchFeedViewProps, 'isRemoving' | 'onRemove'>) {
  const { t } = useTranslation()
  const lastChecked = status.lastCheckedAt
    ? new Date(status.lastCheckedAt).toLocaleString(formatLocale(), { dateStyle: 'medium', timeStyle: 'short' })
    : null

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-card p-4">
      <p className="text-body font-medium">{status.teamName}</p>
      <a href={status.feedUrl} target="_blank" rel="noreferrer" className="break-all text-caption text-blue underline">
        {status.feedUrl}
      </a>
      {lastChecked && <p className="text-caption text-muted-foreground">{t('matchFeed.lastChecked', { at: lastChecked })}</p>}
      {status.lastCheckFailed && <p className={ERROR_CLASS}>{t('matchFeed.lastCheckFailed')}</p>}
      <Button variant="outline" className="self-start" disabled={isRemoving} onClick={onRemove}>
        {t('matchFeed.remove')}
      </Button>
    </div>
  )
}
