import { createFileRoute } from '@tanstack/react-router'
import { ManageCreationCodes } from '@features/manage-creation-codes/ui/ManageCreationCodes'

// Platform-admin creation-codes surface (#154 Slice 4). Authorization is enforced server-side: the
// list endpoint 403s for non–platform-admins and the container renders a no-access shell. The route
// isn't gated in beforeLoad because platform-admin status isn't yet exposed on the client session
// (deferred to avoid colliding with the concurrent auth.me work); the root guard still requires a
// confirmed, onboarded session to reach it.
export const Route = createFileRoute('/admin/creation-codes')({
  component: CreationCodesAdminPage,
})

function CreationCodesAdminPage() {
  return <ManageCreationCodes />
}
