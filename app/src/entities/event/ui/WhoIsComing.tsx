import type { EventRoster } from '@shared/api/events'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { whoIsComing } from '../lib/roster-view'
import { useTranslation } from 'react-i18next'

/**
 * How many people are going, split into members playing, substitutes and each staff role. The
 * per-position verdicts live with the people in the attendee list below; this answers the other
 * question — who will actually be in the room. Chrome-free: the caller supplies the card.
 */
export function WhoIsComing({ roster, staffRoles }: { roster: EventRoster; staffRoles?: { id: string; label: string }[] }) {
  const { t } = useTranslation()
  const { total, players, substitutes, staff } = whoIsComing(roster, staffRoles)
  return (
    <div className="px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <SectionLabel as="h2">{t('whoIsComing.heading')}</SectionLabel>
        <span className="font-display text-small font-bold tabular-nums">{t('roster.going', { count: total })}</span>
      </div>
      <dl className="mt-3 flex flex-wrap gap-2">
        <Count value={players} label={t('whoIsComing.player', { count: players })} tone="text-green-dark" />
        <Count value={substitutes} label={t('whoIsComing.sub', { count: substitutes })} tone="text-purple-ink" />
        {staff.map((role) => (
          <Count key={role.id} value={role.count} label={role.label} />
        ))}
      </dl>
    </div>
  )
}

function Count({ value, label, tone = '' }: { value: number; label: string; tone?: string }) {
  return (
    <div className="flex min-w-16 flex-1 flex-col items-center rounded-md bg-muted/50 px-2 py-2">
      <dd className={`font-display text-title font-bold leading-none tabular-nums ${tone}`}>{value}</dd>
      <dt className="order-last mt-1 max-w-full truncate text-caption text-muted-foreground">{label}</dt>
    </div>
  )
}
