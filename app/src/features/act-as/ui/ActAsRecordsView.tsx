import type { ActAsRecord } from '@shared/api/act-as'

interface ActAsRecordsViewProps {
  records?: ActAsRecord[]
  isLoading?: boolean
  isError?: boolean
}

/**
 * The team-visible **Act-as Record** (ADR-0024 §4): what platform access this Team has had.
 *
 * Scoped to the act-as session rather than to individual rows — most tenant tables carry no
 * authorship column, so per-row attribution structurally cannot cover Season configuration or
 * Position curation, which is most of what setup is.
 *
 * The actor is rendered generically ("the platform"), never as a person: no name lookup, and no
 * operator email on a surface the whole team reads.
 */
export function ActAsRecordsView({ records = [], isLoading, isError }: ActAsRecordsViewProps) {
  return (
    <section>
      <h3 className="font-display text-lg font-bold">Platform access</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        When TeamBalance itself worked inside this team — to set it up or fix something.
      </p>

      {isLoading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="mt-3 text-sm text-red">Couldn't load platform access. Please try again.</p>}

      {!isLoading && !isError && (
        records.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">The platform has never worked inside this team.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
            {records.map((record) => (
              <li key={`${record.enteredAt}-${record.actorKind}`} className="flex flex-wrap items-center gap-2 p-3">
                <span className="text-sm font-medium">{actorLabel(record.actorKind)}</span>
                <span className="text-sm text-muted-foreground">{describeWindow(record)}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  )
}

// MEMBER exists in the contract so act-as records fold into the general audit log (#237) later; today
// every record is the platform. An unknown kind still renders as the platform rather than as a blank.
function actorLabel(actorKind: string): string {
  return actorKind === 'MEMBER' ? 'A team member' : 'TeamBalance'
}

/**
 * An episode that was left deliberately ends at `exitedAt`. One that simply ran out has none, and
 * `lastActiveAt` is then the honest end of the window — a guess from the 60-minute box would claim
 * more than the record knows.
 */
function describeWindow(record: ActAsRecord): string {
  const entered = formatDateTime(new Date(record.enteredAt))
  const end = formatTime(new Date(record.exitedAt ?? record.lastActiveAt))
  return record.exitedAt ? `was here on ${entered}, until ${end}` : `was here on ${entered}, last seen ${end}`
}

const formatDateTime = (at: Date) =>
  at.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

const formatTime = (at: Date) => at.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
