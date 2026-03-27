import { Button } from '@shared/ui/button'
import { useSetAttendance } from '@shared/api/attendances'

const STATES = [
  { value: 'ATTENDING', label: 'Yes', className: 'bg-green text-white hover:bg-green/90' },
  { value: 'MAYBE', label: 'Maybe', className: 'bg-gold text-white hover:bg-gold/90' },
  { value: 'ABSENT', label: 'No', className: 'bg-red-500 text-white hover:bg-red-500/90' },
] as const

interface AttendanceToggleProps {
  eventId: string
  userId: string
  currentState: string
}

export function AttendanceToggle({ eventId, userId, currentState }: AttendanceToggleProps) {
  const { mutate, isPending } = useSetAttendance()

  return (
    <div className="flex gap-1">
      {STATES.map(({ value, label, className }) => (
        <Button
          key={value}
          size="sm"
          variant={currentState === value ? 'default' : 'outline'}
          className={currentState === value ? className : ''}
          disabled={isPending}
          onClick={() => mutate({ eventId, userId, state: value })}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
