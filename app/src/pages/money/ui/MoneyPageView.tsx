import type { ReactNode } from 'react'

interface MoneyPageViewProps {
  /** The money pool — the live container in the route, the prop-only View in a story. */
  pool: ReactNode
}

/** The Money tab laid out (ADR-0032 §3): the page title over the team's money pool. */
export function MoneyPageView({ pool }: MoneyPageViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-title font-bold">Money</h2>
      {pool}
    </div>
  )
}
