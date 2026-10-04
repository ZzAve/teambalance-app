// PROTOTYPE — throwaway (ADR-0038): member detail page reached from the /team roster prototype.
import { createFileRoute } from '@tanstack/react-router'
import { MemberDetailPrototype } from '@features/manage-members/ui/MemberDetailPrototype'

export const Route = createFileRoute('/t/$slug/team/$userId')({
  component: MemberDetailPrototype,
})
