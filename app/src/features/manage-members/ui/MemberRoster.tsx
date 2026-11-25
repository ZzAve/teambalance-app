import { useMembers } from '@shared/api/members'
import { MemberRosterView } from './MemberRosterView'

/**
 * Container for the Team page's Roster: wires the members query to MemberRosterView. Pure wiring —
 * the View's stories cover its states (ADR-0017). Editing a member lives on their page.
 */
export function MemberRoster() {
  const { data: members, isLoading, error } = useMembers()
  return <MemberRosterView members={members} isLoading={isLoading} isError={!!error} />
}
