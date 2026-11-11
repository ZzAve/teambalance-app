import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MatchMismatch } from '@shared/api/match-feed'
import { Button } from '@shared/ui/button'
import { DialogFooter } from '@shared/ui/dialog'
import { Switch } from '@shared/ui/switch'
import { MismatchDetails } from './MatchFeedFindings'

interface ApplyMatchDialogViewProps {
  mismatch: MatchMismatch
  teamName: string
  isPending?: boolean
  isError?: boolean
  onConfirm: (resetResponses: boolean) => void
  onCancel: () => void
}

const localDate = (iso: string) => new Date(iso).toDateString()

/**
 * Body of the "Apply Nevobo values" dialog: what will change, and — when the event moves to another day — a
 * switch to reset the responses given for the old day. The dialog chrome lives in the container.
 */
export function ApplyMatchDialogView({ mismatch, teamName, isPending, isError, onConfirm, onCancel }: ApplyMatchDialogViewProps) {
  const { t } = useTranslation()
  const [resetResponses, setResetResponses] = useState(false)
  const movesDate =
    mismatch.differences.includes('START_TIME') &&
    localDate(mismatch.eventStartTime) !== localDate(mismatch.feedMatch.startTime)

  return (
    <div className="flex flex-col gap-4">
      <MismatchDetails mismatch={mismatch} teamName={teamName} />
      {movesDate && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2">
          <div className="flex flex-col">
            <span className="text-small font-medium">{t('editEvent.resetResponses')}</span>
            <span id="apply-reset-hint" className="text-caption text-muted-foreground">
              {t('matchFeed.apply.resetHint')}
            </span>
          </div>
          <Switch
            checked={resetResponses}
            onCheckedChange={setResetResponses}
            aria-label={t('editEvent.resetResponses')}
            aria-describedby="apply-reset-hint"
          />
        </div>
      )}
      {isError && <p className="rounded-lg bg-card p-3 text-small text-red-ink">{t('matchFeed.apply.failed')}</p>}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          {t('common.cancel')}
        </Button>
        <Button onClick={() => onConfirm(movesDate && resetResponses)} disabled={isPending}>
          {isPending ? t('editEvent.saving') : t('matchFeed.apply.button')}
        </Button>
      </DialogFooter>
    </div>
  )
}
