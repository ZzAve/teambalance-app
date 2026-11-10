import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { useResetAttendance } from '@shared/api/attendances'
import type { EventDetail } from '@shared/api/events'
import { respondedCount } from '../lib/responded-count'

interface ResetAttendanceButtonProps {
  event: EventDetail
}

/**
 * Container for the admin "Reset responses" action: a button, a confirm step, and the ResetAttendance
 * mutation. Shows nothing when no member has responded, because then there is nothing to reset.
 */
export function ResetAttendanceButton({ event }: ResetAttendanceButtonProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const resetAttendance = useResetAttendance()
  const count = respondedCount(event)

  if (count === 0) return null

  return (
    <>
      <Button variant="outline" className="basis-full" onClick={() => setOpen(true)} disabled={resetAttendance.isPending}>
        <RotateCcw size={15} />
        {t('resetAttendance.button')}
      </Button>
      <ConfirmDialog
        open={open}
        title={t('resetAttendance.title')}
        description={t('resetAttendance.description', { count, title: event.title })}
        confirmLabel={t('resetAttendance.confirm')}
        onConfirm={() => {
          resetAttendance.mutate(event.id)
          setOpen(false)
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
