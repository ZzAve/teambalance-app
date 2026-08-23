import { Button } from '@shared/ui/button'

interface ActAsBannerViewProps {
  /** The Team the Platform Admin is currently inside; null renders nothing at all. */
  teamName?: string | null
  isExiting?: boolean
  onExit: () => void
}

/**
 * The persistent act-as banner (ADR-0024 §4). The team name is **load-bearing, not decoration**:
 * twelve near-identically-named club squads is the exact condition under which a season gets prepped
 * into the wrong one, and this line is the only thing standing between the operator and that.
 *
 * Presentational: the grant and the exit mutation live in the container, so every state here is a
 * no-network story (ADR-0017).
 */
export function ActAsBannerView({ teamName, isExiting, onExit }: ActAsBannerViewProps) {
  if (!teamName) return null

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/40 bg-gold/15 px-5 py-2"
    >
      <p className="text-sm">
        Acting as the platform inside <span className="font-semibold">{teamName}</span>
      </p>
      <Button size="sm" variant="outline" disabled={isExiting} onClick={onExit}>
        Exit
      </Button>
    </div>
  )
}
