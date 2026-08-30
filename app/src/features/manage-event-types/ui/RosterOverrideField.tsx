import type { EventTypeItem, RosterRequirement } from '@shared/api/event-types'
import type { Position } from '@shared/api/positions'
import { RosterRequirementEditor } from './RosterRequirementEditor'
import { rosterDefaultSummary } from '../lib/roster-default-summary'

interface RosterOverrideFieldProps {
  /** The event's own requirement, or undefined to inherit `eventType`'s default. */
  value?: RosterRequirement
  /** The type currently selected in the form — whose default is what "Inherit" means right now. */
  eventType?: EventTypeItem
  positions?: Position[]
  disabled?: boolean
  onChange: (next: RosterRequirement | undefined) => void
}

/**
 * "Inherit default / Customise" for one event's roster (#219).
 *
 * Inherit is not a snapshot: an inheriting event follows its type's default as that default changes,
 * which is what lets a recurring series track the team's shape without every occurrence being
 * rewritten. Customising replaces the default outright rather than patching it — there is no partial
 * inheritance to explain, and "what does this event need?" keeps a single answer.
 *
 * Switching to Customise seeds the form with the type's current default, so an admin edits from
 * where the event already is rather than from an empty form.
 */
export function RosterOverrideField({
  value,
  eventType,
  positions = [],
  disabled,
  onChange,
}: RosterOverrideFieldProps) {
  const inheriting = value === undefined
  const typeDefault = eventType?.rosterDefault

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium">Roster</legend>

      <div className="flex gap-2" role="radiogroup" aria-label="Roster">
        <button
          type="button"
          role="radio"
          aria-checked={inheriting}
          disabled={disabled}
          onClick={() => onChange(undefined)}
          className={`rounded-full border px-3 py-1.5 text-[13px] ${
            inheriting ? 'border-foreground bg-foreground text-background' : 'border-border'
          }`}
        >
          Inherit default
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={!inheriting}
          disabled={disabled}
          // Seeded from the type's current default so Customise starts where the event already is —
          // but only on the way IN. Re-clicking the option you are already on is a no-op for a radio,
          // and re-seeding here would silently discard everything the admin had just typed.
          onClick={() => {
            if (inheriting) {
              onChange(typeDefault ?? { trackRoster: false, totalTarget: undefined, positionTargets: [] })
            }
          }}
          className={`rounded-full border px-3 py-1.5 text-[13px] ${
            !inheriting ? 'border-foreground bg-foreground text-background' : 'border-border'
          }`}
        >
          Customise
        </button>
      </div>

      {inheriting ? (
        <p className="text-[11.5px] text-muted-foreground">
          {eventType
            ? `Follows ${eventType.name}: ${rosterDefaultSummary(eventType.rosterDefault, positions)}. Changing the type's default changes this event too.`
            : 'Follows the event type’s default.'}
        </p>
      ) : (
        <RosterRequirementEditor
          idPrefix="event-override"
          value={value}
          positions={positions}
          disabled={disabled}
          onChange={onChange}
        />
      )}
    </fieldset>
  )
}
