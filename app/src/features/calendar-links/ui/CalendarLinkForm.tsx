import { useId, useState } from 'react'
import type { CalendarLinkRequest } from '@shared/api/calendar-links'
import type { EventTypeItem } from '@shared/api/event-types'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { ALL_ATTENDANCE_STATES } from '@entities/event/lib/attendance-states'
import { PRESET_OPTIONS, presetOf, type LinkOptions, type Preset } from '../model/preset'
import { AdvancedOptions } from './AdvancedOptions'
import { PresetControl } from './PresetControl'

/** The server's label limit. */
const MAX_LABEL_LENGTH = 50
/** What picking Partner fills an empty label with. */
const PARTNER_LABEL = 'Partner'

export type CalendarLinkFormValues = LinkOptions & { label?: string }

interface CalendarLinkFormProps {
  /** What the form starts from: the Me preset for a new link, the link itself when editing. */
  initial?: CalendarLinkFormValues
  /** The Active Team's name, which a link's calendar is named after. */
  teamName: string
  /** The types the picker offers, in the team's order. */
  eventTypes: EventTypeItem[]
  disabled?: boolean
  isSaving?: boolean
  submitLabel: string
  onSubmit: (request: CalendarLinkRequest) => void
  /** Offered as a Cancel button when given. */
  onCancel?: () => void
}

/**
 * A link's label, preset and options, for creating a link and for editing one in place. Owns its
 * field state from `initial` on; a parent that wants a fresh form renders it under a new `key`.
 */
export function CalendarLinkForm({
  initial = { label: '', ...PRESET_OPTIONS.me },
  teamName,
  eventTypes,
  disabled,
  isSaving,
  submitLabel,
  onSubmit,
  onCancel,
}: CalendarLinkFormProps) {
  const labelId = useId()
  const [label, setLabel] = useState(initial.label ?? '')
  const [options, setOptions] = useState<LinkOptions>({
    attendanceStates: initial.attendanceStates,
    showAttendancePrefix: initial.showAttendancePrefix,
    calendarNameSuffix: initial.calendarNameSuffix,
    eventTypeIds: initial.eventTypeIds,
  })
  // Any edit makes the form Custom, even one that lands back on a preset's shape: the member chose
  // their own options, and the control should say so until they pick a preset again.
  const [customised, setCustomised] = useState(false)
  // A Custom link being edited opens on the options that make it Custom.
  const [advancedOpen, setAdvancedOpen] = useState(() => presetOf(options) === 'custom')
  const preset: Preset = customised ? 'custom' : presetOf(options)
  // In the team's order, as the states are sent in answer order.
  const typeOrder = (id: string) => {
    const index = eventTypes.findIndex((type) => type.id === id)
    return index === -1 ? eventTypes.length : index
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          label: label.trim() || undefined,
          attendanceStates: ALL_ATTENDANCE_STATES.filter((state) => options.attendanceStates.includes(state)),
          showAttendancePrefix: options.showAttendancePrefix,
          calendarNameSuffix: options.calendarNameSuffix?.trim() || undefined,
          eventTypeIds: options.eventTypeIds && [...options.eventTypeIds].sort((a, b) => typeOrder(a) - typeOrder(b)),
        })
      }}
    >
      <PresetControl
        value={preset}
        teamName={teamName}
        disabled={disabled}
        onChange={(next) => {
          if (next === 'custom') {
            setCustomised(true)
            setAdvancedOpen(true)
            return
          }
          setOptions(PRESET_OPTIONS[next])
          setCustomised(false)
          if (next === 'partner' && label.trim() === '') setLabel(PARTNER_LABEL)
          // Back to Me takes Partner's auto-filled label with it; a label the member typed stays.
          if (next === 'me' && label === PARTNER_LABEL) setLabel('')
        }}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor={labelId}>Label (optional)</Label>
        <div className="flex gap-2">
          <Input
            id={labelId}
            value={label}
            maxLength={MAX_LABEL_LENGTH}
            placeholder="e.g. My phone"
            disabled={disabled}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button type="submit" disabled={disabled || isSaving}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <AdvancedOptions
        open={advancedOpen}
        onOpenChange={setAdvancedOpen}
        options={options}
        teamName={teamName}
        eventTypes={eventTypes}
        disabled={disabled}
        onChange={(next) => {
          setOptions(next)
          setCustomised(true)
        }}
      />
    </form>
  )
}
