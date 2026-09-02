import { createFileRoute } from '@tanstack/react-router'
import { ManageCreationCodes } from '@features/manage-creation-codes/ui/ManageCreationCodes'

// Platform-admin creation-codes surface (#154 Slice 4). Authorization is enforced server-side: the
// endpoints 403 for non–platform-admins and the container renders a no-access shell. The route isn't
// gated in beforeLoad; the entry point (a link on /account) is shown only when /auth/me reports
// isPlatformAdmin.
export const Route = createFileRoute('/admin/creation-codes')({
  component: CreationCodesAdminPage,
})

function CreationCodesAdminPage() {
  return <ManageCreationCodes />
}
