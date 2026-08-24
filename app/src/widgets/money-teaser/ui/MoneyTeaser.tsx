import { useState } from 'react'
import { useTeamSlug } from '@shared/lib/team-routes'
import { useNow } from '@shared/lib/use-now'
import { interestCount } from '../lib/interest-count'
import { MoneyTeaserView } from './MoneyTeaserView'

/** Per-device, per-team key — a vote on one team's teaser must not light up another's. */
function voteKey(slug: string | null): string {
  return `tb.money-vote.${slug ?? 'unknown'}`
}

function readVote(slug: string | null): boolean {
  try {
    return localStorage.getItem(voteKey(slug)) === '1'
  } catch {
    return false
  }
}

/**
 * Container for the Money tab's coming-soon teaser. There is no backend for the money feature yet, so
 * both moving parts are local theatre:
 *   · "I want this" is remembered only on this device (localStorage), scoped to the active team.
 *   · the interest count is a deterministic, deliberately-fake function of the clock (interestCount),
 *     ticking via useNow so the number visibly climbs, plus this viewer's own +1 once they've voted.
 *
 * When the Bunq integration lands, this is the single seam that swaps local memory and the fake count
 * for a real interest endpoint — the prop-only MoneyTeaserView underneath does not change.
 */
export function MoneyTeaser() {
  const slug = useTeamSlug()
  const [hasVoted, setHasVoted] = useState(() => readVote(slug))
  const now = useNow()
  const count = interestCount(now) + (hasVoted ? 1 : 0)

  const handleVote = () => {
    if (hasVoted) return
    setHasVoted(true)
    try {
      localStorage.setItem(voteKey(slug), '1')
    } catch {
      // A private-mode/quota failure must not break the confirmation — the in-memory state still
      // flips, the tap just won't be remembered across reloads.
    }
  }

  return <MoneyTeaserView hasVoted={hasVoted} count={count} onVote={handleVote} />
}
