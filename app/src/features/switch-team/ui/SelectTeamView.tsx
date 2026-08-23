import { Users } from 'lucide-react'
import type { TeamRef } from '@shared/api/teams'

interface SelectTeamViewProps {
  /** At least two, or the caller would not be here. */
  teams: TeamRef[]
  onSelect: (slug: string) => void
}

/**
 * "Which Team?" — what a Member of several Teams sees when none is active. No "remember my choice"
 * control on purpose: picking a Team *is* the switch, and every switch is remembered (ADR-0023 §3).
 */
export function SelectTeamView({ teams, onSelect }: SelectTeamViewProps) {
  return (
    <div className="mx-auto mt-10 max-w-sm">
      <h1 className="font-display text-2xl font-bold">Which team?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You play in more than one. Pick where you want to be — you can switch any time from the
        header.
      </p>

      <ul className="mt-6 flex flex-col gap-2">
        {teams.map((team) => (
          <li key={team.id}>
            <button
              type="button"
              onClick={() => onSelect(team.slug)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
                <Users size={18} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{team.name}</span>
                <span className="block truncate text-xs text-muted-foreground">/{team.slug}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
