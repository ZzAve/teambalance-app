import { useState } from 'react'
import { useMatchFeed } from '@shared/api/match-feed'
import { ApplyMatchDialog } from './ApplyMatchDialog'
import { MatchMismatchNoticeView } from './MatchMismatchNoticeView'

/** Container: shows the notice when this event differs from its match in the team's feed. Admins only. */
export function MatchMismatchNotice({ eventId }: { eventId: string }) {
  const { data: status } = useMatchFeed()
  const [applying, setApplying] = useState(false)
  const mismatch = status?.mismatches.find((it) => it.eventId === eventId)
  if (!status || !mismatch) return null
  return (
    <>
      <MatchMismatchNoticeView mismatch={mismatch} teamName={status.teamName} onApply={() => setApplying(true)} />
      <ApplyMatchDialog
        mismatch={applying ? mismatch : null}
        teamName={status.teamName}
        onClose={() => setApplying(false)}
      />
    </>
  )
}
