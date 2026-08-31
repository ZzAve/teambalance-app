import { useState } from 'react'
import { useCreateAdminInvitation } from '@shared/api/invitations'
import { HandoverAdminView } from './HandoverAdminView'

/**
 * Container for the admin handover link (ADR-0024 §5): mints the single-use ADMIN invitation and builds
 * the shareable URL, mirroring how GenerateInviteDialog builds the player link. Idempotent server-side
 * while unspent, so re-clicking returns the same live link rather than a second admin credential. Pure
 * wiring, covered by e2e rather than a story (ADR-0017).
 */
export function HandoverAdmin() {
  const createAdminInvitation = useCreateAdminInvitation()
  const [link, setLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () =>
    createAdminInvitation.mutate(undefined, {
      onSuccess: (invitation) => {
        setLink(`${window.location.origin}/invite/${invitation.token}`)
        setCopied(false)
      },
    })

  const handleCopy = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
  }

  return (
    <HandoverAdminView
      isGenerating={createAdminInvitation.isPending}
      isError={createAdminInvitation.isError}
      link={link}
      copied={copied}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
    />
  )
}
