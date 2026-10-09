import { useState } from 'react'
import {
  useActiveAdminInvitation,
  useCreateAdminInvitation,
  useExpireAdminInvitations,
  useRotateAdminInvitation,
} from '@shared/api/invitations'
import { useCopyToClipboard } from '@shared/lib/copy-to-clipboard'
import { HandoverAdminView } from './HandoverAdminView'

/**
 * Container for the admin handover link (ADR-0024 §5): reads the team's current unspent link on load
 * (so it survives a refresh), and wires create / rotate / revoke to the presentational view — the same
 * lifecycle as the shareable-link dialog, kept off that link's state by its own query key. Pure wiring,
 * covered by e2e rather than a story (ADR-0017).
 */
export function HandoverAdmin() {
  const clipboard = useCopyToClipboard()
  const [justRevoked, setJustRevoked] = useState(false)
  const activeInvitation = useActiveAdminInvitation({ enabled: true })
  const createInvitation = useCreateAdminInvitation()
  const rotateInvitation = useRotateAdminInvitation()
  const expireInvitation = useExpireAdminInvitations()

  const invitation = activeInvitation.data
  const link = invitation ? `${window.location.origin}/invite/${invitation.token}` : null

  // Both a fresh create and a rotate land on a new link; drop the flags and let the invalidated query
  // supply it.
  const adoptNewLink = () => {
    setJustRevoked(false)
    clipboard.reset()
  }

  const handleCreate = () => createInvitation.mutate(undefined, { onSuccess: adoptNewLink })
  const handleRotate = () => rotateInvitation.mutate(undefined, { onSuccess: adoptNewLink })
  const handleRevoke = () =>
    expireInvitation.mutate(undefined, {
      onSuccess: () => {
        setJustRevoked(true)
        clipboard.reset()
      },
    })

  return (
    <HandoverAdminView
      isLoading={activeInvitation.isPending}
      isError={activeInvitation.isError}
      link={link}
      copied={clipboard.copiedKey !== null}
      copyFailed={clipboard.failedKey !== null}
      justRevoked={justRevoked}
      isCreating={createInvitation.isPending}
      isRotating={rotateInvitation.isPending}
      isRevoking={expireInvitation.isPending}
      actionError={createInvitation.isError || rotateInvitation.isError || expireInvitation.isError}
      onCopy={() => link && clipboard.copy(link)}
      onCreate={handleCreate}
      onRotate={handleRotate}
      onRevoke={handleRevoke}
    />
  )
}
