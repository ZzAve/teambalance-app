import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { ActAsRecord } from '@shared/api/act-as'

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
 * The actor is rendered generically ("the TeamBalance owner"), never as a person: no name lookup,
 * and no operator email on a surface the team's Admins read.
 */
export function ActAsRecordsView({ records = [], isLoading, isError }: ActAsRecordsViewProps) {
  const [listOpen, setListOpen] = useState(false)
  const [openRecord, setOpenRecord] = useState<string | null>(null)
  const [whyOpen, setWhyOpen] = useState(false)

  // The reasoning belongs to the record you opened it from, so collapsing that record takes it too.
  const toggleRecord = (key: string) => {
    setOpenRecord((current) => (current === key ? null : key))
    setWhyOpen(false)
  }

  return (
    <section>
      <h3 className="font-display text-lg font-bold">Platform access</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        When the people who run TeamBalance worked inside your team.
      </p>

      {isLoading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="mt-3 text-sm text-red">Couldn't load platform access. Please try again.</p>}

      {!isLoading && !isError && (
        records.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            The TeamBalance owner has never worked in your team.
          </p>
        ) : (
          <div className="mt-3">
            <button
              type="button"
              aria-expanded={listOpen}
              onClick={() => setListOpen((open) => !open)}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-card-hover"
            >
              <ChevronRight
                size={16}
                className={`shrink-0 text-muted-foreground transition-transform duration-200 ${listOpen ? 'rotate-90' : ''}`}
              />
              <span className="text-sm font-medium">{summarize(records.length)}</span>
            </button>

            {listOpen && (
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {records.map((record) => {
                  const key = `${record.enteredAt}-${record.actorKind}`
                  const isOpen = openRecord === key
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggleRecord(key)}
                        className="flex w-full items-center gap-2 p-3 text-left"
                      >
                        <ChevronRight
                          size={15}
                          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                        />
                        <span>
                          <span className="block text-sm font-medium">{actorLabel(record.actorKind)} worked in your team</span>
                          <span className="block text-sm text-muted-foreground">{describeWindow(record)}</span>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pb-3 pl-9 pr-3 text-sm">
                          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                            <dt className="text-muted-foreground">Started</dt>
                            <dd>{formatDateTime(new Date(record.enteredAt))}</dd>
                            <dt className="text-muted-foreground">Ended</dt>
                            <dd>{describeEnd(record)}</dd>
                            <dt className="text-muted-foreground">Acting as</dt>
                            <dd>An admin of your team</dd>
                          </dl>

                          <button
                            type="button"
                            aria-expanded={whyOpen}
                            onClick={() => setWhyOpen((open) => !open)}
                            className="mt-3 text-sm font-medium text-blue underline underline-offset-4"
                          >
                            Why does this happen?
                          </button>

                          {whyOpen && (
                            <div className="mt-2 flex flex-col gap-2 border-l-2 border-border pl-3 text-sm text-muted-foreground">
                              <p>
                                TeamBalance is run by a small team. The owner works inside a team to set it up,
                                prepare a season, or fix something that was reported.
                              </p>
                              <p>
                                Access lasts an hour at a time and is never silent — it is listed here whether or
                                not anything changed.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      )}
    </section>
  )
}

const summarize = (count: number) =>
  count === 1 ? 'The TeamBalance owner worked here once' : `The TeamBalance owner worked here ${count} times`

// MEMBER exists in the contract so act-as records fold into the general audit log (#237) later; today
// every record is the platform. An unknown kind still renders as the platform rather than as a blank.
function actorLabel(actorKind: string): string {
  return actorKind === 'MEMBER' ? 'A team member' : 'The TeamBalance owner'
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
    ? `${formatTime(endOf(record))}, when they left`
    : `${formatTime(endOf(record))}, when the hour ran out`

const endOf = (record: ActAsRecord) => new Date(record.exitedAt ?? record.lastActiveAt)

const formatDateTime = (at: Date) =>
  at.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

const formatTime = (at: Date) => at.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
