import type { AttendanceEntry } from '@shared/api/events'

/** The least an attribution needs: whose answer it is, what it says, and who last set it. */
interface AttributedAnswer {
  userId: string
  state: AttendanceEntry['state']
  changedBy: string | undefined
}

/**
 * The name to show after "set by", or `null` when no attribution should show — which doubles as the
 * marker-dot predicate (⑪): the dot shows exactly when this returns a name.
 *
 * Silent in the normal case: an answer its own member set, or one nobody has set, gets nothing.
 * NOT_RESPONDED is silent too — a blank is not an answer someone gave on your behalf. Only an answer
 * last changed by *someone else* (ADR-0003 trust-based editing) names them, resolved from `all`
 * since it carries every team member.
 *
 * A setter `all` does not name falls back to a neutral label rather than an id. That covers a setter
 * who has since left the team, and equally the events list, whose payload carries no attendance rows
 * yet (only `myChangedBy`): there `all` is empty and "set by a teammate" is the honest reading of an
 * id we cannot resolve. Passing the rows the day the list carries them upgrades it to the name with
 * no other change.
 */
export function attributionName(answer: AttributedAnswer, all: AttendanceEntry[]): string | null {
  const { changedBy, userId, state } = answer
  if (changedBy == null || changedBy === userId || state === 'NOT_RESPONDED') return null
  return all.find((a) => a.userId === changedBy)?.displayName ?? 'a teammate'
}
