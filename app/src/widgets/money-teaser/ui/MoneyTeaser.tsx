import { useState } from 'react'
import { useTeamSlug } from '@shared/lib/team-routes'
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
 * Container for the Money tab's coming-soon teaser. There is no backend for the money feature yet,
 * so "I want this" is remembered only on this device (localStorage), scoped to the active team.
 * When the Bunq integration lands, this is the seam that swaps local memory for a real interest
 * endpoint — the prop-only MoneyTeaserView underneath does not change.
 */
export function MoneyTeaser() {
  const slug = useTeamSlug()
  const [hasVoted, setHasVoted] = useState(() => readVote(slug))

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

  return <MoneyTeaserView hasVoted={hasVoted} onVote={handleVote} />
}
