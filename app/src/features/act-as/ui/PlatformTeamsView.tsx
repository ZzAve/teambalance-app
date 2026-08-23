import type { TeamRef } from '@shared/api/act-as'
import { Button } from '@shared/ui/button'

interface PlatformTeamsViewProps {
  teams?: TeamRef[]
  isLoading?: boolean
  isError?: boolean
  /** 403 — the caller is not a Platform Admin; renders a no-access shell rather than an error. */
  isForbidden?: boolean
  isEntering?: boolean
  /** Set when the operator was returned here because the 60-minute box ran out. */
  wasExpired?: boolean
  onEnter: (team: TeamRef) => void
}

/**
 * The platform console's team list (ADR-0024 §6): **every** team, because restricting the list would
 * be theatre — a Platform Admin owns the database. What makes it defensible is that entering is
 * explicit, time-boxed and recorded.
 *
 * Presentational; the query and the enter mutation live in the container, so every state is a
 * no-network story (ADR-0017).
 */
export function PlatformTeamsView({
  teams = [],
  isLoading,
  isError,
  isForbidden,
  isEntering,
  wasExpired,
  onEnter,
}: PlatformTeamsViewProps) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Teams</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter a team to set it up. You stay off its roster, and the team can see that you were here.
      </p>

      {wasExpired && (
        <p className="mt-4 text-sm text-gold">Your act-as ran out after 60 minutes. Enter a team again to continue.</p>
      )}

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {isForbidden && <p className="mt-4 text-sm text-muted-foreground">You don't have access to the platform console.</p>}
      {isError && !isForbidden && <p className="mt-4 text-sm text-red">Couldn't load teams. Please try again.</p>}

      {!isLoading && !isError && !isForbidden && (
        <div className="mt-4">
          {teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">No teams yet.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {teams.map((team) => (
                <li key={team.id} className="flex flex-wrap items-center gap-3 p-3">
                  <span className="text-sm font-medium">{team.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">/{team.slug}</span>
                  <Button
                    size="sm"
                    className="ml-auto"
                    disabled={isEntering}
                    onClick={() => onEnter(team)}
                  >
                    Enter
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
