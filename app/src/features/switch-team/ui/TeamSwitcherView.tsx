import type { TeamRef } from '@shared/api/teams'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

interface TeamSwitcherViewProps {
  /** Every Team the caller is a Member of. */
  teams: TeamRef[]
  /** The Team this screen is scoped to, or null when none is active yet. */
  activeTeam: TeamRef | null
  /** Called with the chosen Team's slug. Opening `/t/:slug` is what performs the switch. */
  onSelect: (slug: string) => void
}

/**
 * Always **names the current Team** (ADR-0023 §3) — not decoration: with one kind of switch, opening
 * a teammate's link re-homes your default, and seeing which Team you are in is what makes that a
 * one-tap correction rather than a mystery.
 *
 * A single-Team caller gets the name without a menu; there is nothing to switch to.
 */
export function TeamSwitcherView({ teams, activeTeam, onSelect }: TeamSwitcherViewProps) {
  if (!activeTeam) return null

  if (teams.length < 2) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-blue/8 px-3 py-1.5 text-caption font-semibold text-blue">
        <span className="h-1.5 w-1.5 rounded-full bg-green" />
        {activeTeam.name}
      </div>
    )
  }

  return (
    <Select
      value={activeTeam.id}
      onValueChange={(id) => {
        const team = teams.find((t) => t.id === id)
        if (team) onSelect(team.slug)
      }}
    >
      <SelectTrigger
        aria-label={`Current team: ${activeTeam.name}. Switch team`}
        className="h-auto w-auto gap-2 rounded-full border-0 bg-blue/8 px-3 py-1.5 text-caption font-semibold text-blue transition-colors hover:bg-blue/15"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-green" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
