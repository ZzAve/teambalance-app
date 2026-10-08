import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import type { EventTypeItem } from '../api/event-types'

interface EventTypeSelectProps {
  id: string
  eventTypes: EventTypeItem[]
  value: string
  onValueChange: (typeId: string) => void
  name?: string
  required?: boolean
  className?: string
}

export function EventTypeSelect({ id, eventTypes, value, onValueChange, name, required, className }: EventTypeSelectProps) {
  return (
    <Select name={name} required={required} value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        {eventTypes.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: t.color ?? '#888' }} />
              {t.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
