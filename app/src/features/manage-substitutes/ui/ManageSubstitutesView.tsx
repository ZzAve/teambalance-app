import { useState } from 'react'
import type { Position } from '@shared/api/positions'
import type { Substitute } from '@shared/api/substitutes'
import { SubstituteAvatar } from '@entities/event/ui/SubstituteAvatar'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'

interface ManageSubstitutesViewProps {
  substitutes?: Substitute[]
  /** The team's position vocabulary, offered per row so an admin can (re)assign a Substitute. */
  positions: Position[]
  onRename: (substitute: Substitute, name: string) => void
}

/**
 * The Admin's list of the Team's Substitutes (ADR-0033), heading and all. Rows match the Member
 * roster's (MemberRosterView): avatar, name, Position, and a ⋯ menu for the rarer actions. Owns only
 * the inline rename field; the query and mutations live in the ManageSubstitutes container.
 */
export function ManageSubstitutesView({ substitutes = [], onRename }: ManageSubstitutesViewProps) {
  return (
    <div>
      <h2 className="font-display text-title font-bold">Substitutes</h2>
      <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
        {substitutes.map((substitute) => (
          <SubstituteRow key={substitute.id} substitute={substitute} onRename={onRename} />
        ))}
      </ul>
    </div>
  )
}

interface SubstituteRowProps {
  substitute: Substitute
  onRename: (substitute: Substitute, name: string) => void
}

function SubstituteRow({ substitute, onRename }: SubstituteRowProps) {
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(substitute.name)

  const startEdit = () => {
    setDraftName(substitute.name)
    setEditingName(true)
  }

  const cancelEdit = () => {
    setDraftName(substitute.name)
    setEditingName(false)
  }

  const saveEdit = () => {
    const next = draftName.trim()
    if (next.length === 0) return
    onRename(substitute, next)
    setEditingName(false)
  }

  if (editingName) {
    return (
      <li className="flex items-center gap-2 p-3">
        <SubstituteAvatar name={substitute.name} />
        <Input
          aria-label={`Name for ${substitute.name}`}
          value={draftName}
          autoFocus
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              saveEdit()
            } else if (e.key === 'Escape') {
              e.preventDefault()
              cancelEdit()
            }
          }}
          className="min-w-0 flex-1"
        />
        <Button size="sm" onClick={saveEdit}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={cancelEdit}>
          Cancel
        </Button>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-2 p-3">
      <SubstituteAvatar name={substitute.name} />
      <span className="min-w-0 flex-1 truncate font-medium" title={substitute.name}>
        {substitute.name}
      </span>
      <span className="shrink-0 text-small text-muted-foreground">{substitute.position?.label ?? 'Unassigned'}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Actions for ${substitute.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent"
          >
            ⋯
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={startEdit}>Rename</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
