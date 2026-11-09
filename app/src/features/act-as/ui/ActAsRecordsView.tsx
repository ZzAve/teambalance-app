import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ActAsRecord } from '@shared/api/act-as'
import { formatLocale, i18n } from '@shared/i18n/i18n'

interface ActAsRecordsViewProps {
  records?: ActAsRecord[]
  isLoading?: boolean
  isError?: boolean
}

/**
 * The Admin-visible **Act-as Record** (ADR-0024 §4): what platform access this Team has had.
 *
 * Scoped to the act-as session rather than to individual rows — most tenant tables carry no
 * authorship column, so per-row attribution structurally cannot cover Season configuration or
 * Position curation, which is most of what setup is. That is also why nothing here claims a
 * *change* was made: the record knows access happened, never what came of it.
 *
 * Quiet by default. Platform access is rare and, to an Admin who has never heard of it, alarming
 * out of context — so at rest it is one line, and the reasoning is reachable in two more taps
 * rather than pre-emptively defended on a page visited for other things.
 *
 * Each level is a native `<details>`, so the browser owns open/closed state and keyboard handling.
 *
 * The actor is rendered generically ("the TeamBalance owner"), never as a person: no name lookup,
 * and no operator email on a surface the team's Admins read.
 */
export function ActAsRecordsView({ records = [], isLoading, isError }: ActAsRecordsViewProps) {
  const { t } = useTranslation()
  return (
    <section>
      <h3 className="font-display text-lead font-bold">{t('actAs.records.title')}</h3>
      <p className="mt-1 text-small text-muted-foreground">
        {t('actAs.records.intro')}
      </p>

      {isLoading && <p className="mt-3 text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && <p className="mt-3 text-small text-red-ink">{t('actAs.records.loadFailed')}</p>}

      {!isLoading && !isError && (
        records.length === 0 ? (
          <p className="mt-3 text-small text-muted-foreground">
            {t('actAs.records.never')}
          </p>
        ) : (
          <details className="group/list mt-3">
            <summary className="flex w-full list-none items-center gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-card-hover [&::-webkit-details-marker]:hidden">
              <ChevronRight
                size={16}
                className="shrink-0 text-muted-foreground transition-transform duration-200 group-open/list:rotate-90"
              />
              <span className="text-small font-medium">{summarize(records.length)}</span>
            </summary>

            <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
              {records.map((record) => (
                <li key={`${record.enteredAt}-${record.actorKind}`}>
                  <details className="group/record">
                    <summary className="flex w-full list-none items-center gap-2 p-3 text-left [&::-webkit-details-marker]:hidden">
                      <ChevronRight
                        size={15}
                        className="shrink-0 text-muted-foreground transition-transform duration-200 group-open/record:rotate-90"
                      />
                      <span>
                        <span className="block text-small font-medium">{workedLabel(record.actorKind)}</span>
                        <span className="block text-small text-muted-foreground">{describeWindow(record)}</span>
                      </span>
                    </summary>

                    <div className="pb-3 pl-9 pr-3 text-small">
                      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                        <dt className="text-muted-foreground">{t('actAs.records.started')}</dt>
                        <dd>{formatDateTime(new Date(record.enteredAt))}</dd>
                        <dt className="text-muted-foreground">{t('actAs.records.ended')}</dt>
                        <dd>{describeEnd(record)}</dd>
                        <dt className="text-muted-foreground">{t('actAs.records.actingAs')}</dt>
                        <dd>{t('actAs.records.anAdmin')}</dd>
                      </dl>

                      <details className="mt-3">
                        <summary className="w-fit list-none text-small font-medium text-blue underline underline-offset-4 [&::-webkit-details-marker]:hidden">
                          {t('actAs.records.why')}
                        </summary>
                        <div className="mt-2 flex flex-col gap-2 border-l-2 border-border pl-3 text-small text-muted-foreground">
                          <p>{t('actAs.records.whyOwner')}</p>
                          <p>{t('actAs.records.whyListed')}</p>
                        </div>
                      </details>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </details>
        )
      )}
    </section>
  )
}

const summarize = (count: number) => i18n.t('actAs.records.workedHere', { count })

// MEMBER exists in the contract so act-as records fold into the general audit log (#237) later; today
// every record is the platform. An unknown kind still renders as the platform rather than as a blank.
function workedLabel(actorKind: string): string {
  return actorKind === 'MEMBER' ? i18n.t('actAs.records.memberWorked') : i18n.t('actAs.records.ownerWorked')
}

/**
 * An episode that was left deliberately ends at `exitedAt`. One that simply ran out has none, and
 * `lastActiveAt` is then the honest end of the window — a guess from the 60-minute box would claim
 * more than the record knows.
 */
function describeWindow(record: ActAsRecord): string {
  const enteredAt = new Date(record.enteredAt)
  const endAt = endOf(record)
  const entered = formatDateTime(enteredAt)
  // A window that crosses midnight reads backwards as a bare time ("23:30 – 00:15"), so the end
  // carries its date whenever it falls on another day.
  const end = enteredAt.toDateString() === endAt.toDateString() ? formatTime(endAt) : formatDateTime(endAt)
  return `${entered} – ${end}`
}

const describeEnd = (record: ActAsRecord) =>
  record.exitedAt
    ? i18n.t('actAs.records.endLeft', { time: formatTime(endOf(record)) })
    : i18n.t('actAs.records.endRanOut', { time: formatTime(endOf(record)) })

const endOf = (record: ActAsRecord) => new Date(record.exitedAt ?? record.lastActiveAt)

const formatDateTime = (at: Date) =>
  at.toLocaleString(formatLocale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

const formatTime = (at: Date) => at.toLocaleTimeString(formatLocale(), { hour: '2-digit', minute: '2-digit' })
