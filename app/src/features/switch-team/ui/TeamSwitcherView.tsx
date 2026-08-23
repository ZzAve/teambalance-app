import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import type { TeamRef } from '@shared/api/teams'

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
  const [open, setOpen] = useState(false)

  if (!activeTeam) return null

  if (teams.length < 2) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-blue/8 px-3 py-1.5 text-xs font-semibold text-blue">
        <span className="h-1.5 w-1.5 rounded-full bg-green" />
        {activeTeam.name}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Current team: ${activeTeam.name}. Switch team`}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="flex items-center gap-2 rounded-full bg-blue/8 px-3 py-1.5 text-xs font-semibold text-blue transition-colors hover:bg-blue/15"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-green" />
        {activeTeam.name}
        <ChevronsUpDown size={13} />
      </button>

      {open && (
        <>
          {/* Tap-anywhere-to-close, for devices with no Escape key. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            aria-label="Your teams"
            className="absolute right-0 z-50 mt-2 min-w-56 overflow-hidden rounded-2xl border border-border/60 bg-card py-1 shadow-lg"
          >
            {teams.map((team) => {
              const isActive = team.id === activeTeam.id
              return (
                <li key={team.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setOpen(false)
                      if (!isActive) onSelect(team.slug)
                    }}
                    className={[
                      'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors',
                      isActive ? 'font-semibold text-blue' : 'text-foreground hover:bg-blue/8',
                    ].join(' ')}
                  >
                    {team.name}
                    {isActive && <Check size={15} className="shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
