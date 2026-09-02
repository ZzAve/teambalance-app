import type { ReactNode } from 'react'
import { Check, PlusCircle, Ticket, Users } from 'lucide-react'
import type { TeamRef } from '@shared/api/teams'

// Section heading, matching AccountView's settings-list labels so the two screens read as one system.
function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">{children}</h2>
}

interface TeamsViewProps {
  /** Every Team the caller is a Member of. May be a single team. */
  teams: TeamRef[]
  /** The Team currently active, or null when none is — marks the Active row. */
  activeTeam: TeamRef | null
  /** Called with the chosen Team's slug. Opening `/t/:slug` is what performs the switch (ADR-0023). */
  onSelect: (slug: string) => void
  /** Entry point to the invite-link join flow. */
  onJoin: () => void
  /** Entry point to the create-team flow. */
  onCreate: () => void
}

/**
 * The Teams "main view" (ADR-0027 §4): the fuller entry point the Account tab's Teams row opens.
 * Beside switching between your teams it offers the two ways to gain another — join with an invite
 * link, or create a team — mirroring the teamless `/onboarding` hub for a member who already has one.
 *
 * Prop-only and presentational; the route container owns the navigation each callback performs.
 */
export function TeamsView({ teams, activeTeam, onSelect, onJoin, onCreate }: TeamsViewProps) {
  return (
    <div className="mx-auto mt-10 max-w-sm">
      <h1 className="font-display text-2xl font-bold">Teams</h1>

      {/* Section 1 — the teams you belong to; tapping one switches to it (ADR-0023). */}
      <section className="mt-6">
        <SectionLabel>Your teams</SectionLabel>
        <ul className="flex flex-col gap-2">
          {teams.map((team) => {
            const isActive = team.id === activeTeam?.id
            return (
              <li key={team.id}>
                <button
                  type="button"
                  onClick={() => onSelect(team.slug)}
                  aria-current={isActive ? 'true' : undefined}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
                    <Users size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{team.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">/{team.slug}</span>
                  </span>
                  {isActive && (
                    <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-xs font-semibold text-green">
                      <Check size={13} />
                      Active
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Section 2 — ways to gain another team, split off by a hairline divider for a clear break. */}
      <section className="mt-8 border-t border-border pt-6">
        <SectionLabel>Join or create</SectionLabel>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onJoin}
            className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
              <Ticket size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Join with an invite link</span>
              <span className="block truncate text-xs text-muted-foreground">
                Someone shared a join link with you
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onCreate}
            className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:border-blue/40 hover:bg-blue/5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
              <PlusCircle size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Create a team</span>
              <span className="block truncate text-xs text-muted-foreground">
                You'll need a creation code
              </span>
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}
