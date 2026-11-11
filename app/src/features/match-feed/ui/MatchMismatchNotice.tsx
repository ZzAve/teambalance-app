import { useMatchFeed } from '@shared/api/match-feed'
import { MatchMismatchNoticeView } from './MatchMismatchNoticeView'

/** Container: shows the notice when this event differs from its match in the team's feed. Admins only. */
export function MatchMismatchNotice({ eventId }: { eventId: string }) {
  const { data: status } = useMatchFeed()
  const mismatch = status?.mismatches.find((it) => it.eventId === eventId)
  if (!status || !mismatch) return null
  return <MatchMismatchNoticeView mismatch={mismatch} teamName={status.teamName} />
}
