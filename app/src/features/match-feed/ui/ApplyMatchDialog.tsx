import { useTranslation } from 'react-i18next'
import { useApplyMatchFeed, type MatchMismatch } from '@shared/api/match-feed'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { ApplyMatchDialogView } from './ApplyMatchDialogView'

interface ApplyMatchDialogProps {
  /** The difference to apply; null keeps the dialog closed. */
  mismatch: MatchMismatch | null
  teamName: string
  onClose: () => void
}

/** Container for "Apply Nevobo values": the dialog chrome and the ApplyMatchFeed mutation. */
export function ApplyMatchDialog({ mismatch, teamName, onClose }: ApplyMatchDialogProps) {
  const { t } = useTranslation()
  const apply = useApplyMatchFeed()
  const close = () => {
    apply.reset()
    onClose()
  }

  return (
    <Dialog open={mismatch !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('matchFeed.apply.title')}</DialogTitle>
          <DialogDescription>{mismatch?.eventTitle}</DialogDescription>
        </DialogHeader>
        {mismatch && (
          <ApplyMatchDialogView
            key={mismatch.eventId}
            mismatch={mismatch}
            teamName={teamName}
            isPending={apply.isPending}
            isError={apply.isError}
            onConfirm={(resetResponses) =>
              apply.mutate({ eventId: mismatch.eventId, resetResponses }, { onSuccess: close })
            }
            onCancel={close}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
